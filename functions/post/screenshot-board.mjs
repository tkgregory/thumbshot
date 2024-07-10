'use strict';

import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

const s3Client = new S3Client({});

export const handler = async (event) => {
  let browser = null;
  const id = event.pathParameters.id

  const body = JSON.parse(event.body)
  if (!id || !body.settings) {
    return {
      statusCode: 400,
      body: JSON.stringify({ "error": "Bad request" }),
      headers: { "Content-Type": "application/json" },
    };
  }

  let screenshot;
  const boardURL = `https://${process.env.DOMAIN_NAME}/#/boards/${id}/screenshot` + (typeof (body.index) !== 'undefined' ? `/${body.index}` : '')

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath('/opt/nodejs/node_modules/@sparticuz/chromium/bin'),
      headless: chromium.headless,
    });

    let page = await browser.newPage();
    await page.evaluateOnNewDocument((body) => {
      localStorage.setItem('showInstructions', false);
      localStorage.setItem('settings', JSON.stringify(body.settings));
      if (body.columnCount !== undefined) {
        localStorage.setItem('columnCount', body.columnCount);
      }
    }, body);

    if (process.env.SET_NGROK_HEADER === 'true') {
      page.setExtraHTTPHeaders({ 'ngrok-skip-browser-warning': 'true' })
    }
    await page.goto(boardURL, { "waitUntil": "networkidle0" });

    function imagesHaveLoaded() {
      return Array.from(document.images).every((image) => image.complete);
    }
    await page.waitForFunction(imagesHaveLoaded, { timeout: 5000 });

    const firstChildSelector = 'youtube-container > youtube-preview:first-child'
    await page.waitForSelector(firstChildSelector)
    const first = await getBoundingRectangle(page, firstChildSelector);

    const lastChildSelector = 'youtube-container > youtube-preview:last-child'
    await page.waitForSelector(lastChildSelector)
    const last = await getBoundingRectangle(page, lastChildSelector);

    const screenshotContainerSelector = 'screenshot-container'
    const screenshotContainerStats = await getBoundingRectangle(page, screenshotContainerSelector);

    const isSingleRow = first.top === last.top
    const padding = first.left - screenshotContainerStats.left
    const width = last.left + last.width - first.left + padding * 2
    const options = isSingleRow ? { clip: { x: 0, y: 0, width: width, height: screenshotContainerStats.height } } : {}
    const screenshotContainerElement = await page.$(screenshotContainerSelector);
    screenshot = await screenshotContainerElement.screenshot(options);
  }
  catch (error) {
    console.log(`Error generating screenshot of ${boardURL}. Original request body was: ${JSON.stringify(event.body)}`)
    throw error;
  } finally {
    await browser.close();
  }

  const objectKey = `${uuid()}.png`
  const s3putObjectCommand = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: objectKey,
    Body: screenshot,
  });

  await s3Client.send(s3putObjectCommand);
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      { "previewUrl": `https://${process.env.BUCKET_DOMAIN_NAME}/${objectKey}` },
      null,
      2
    ),
  };
};

async function getBoundingRectangle(page, selector) {
  const element = await page.$(selector);
  if (element === null) {
    throw new Error(`Element selector not found '${selector}'`)
  }

  return page.evaluate(element => {
    const { x, y, width, height } = element.getBoundingClientRect();
    return { left: x, top: y, width, height };
  }, element);
}