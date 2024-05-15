'use strict';

import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

const s3Client = new S3Client({});

export const handler = async (event) => {
  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath('/opt/nodejs/node_modules/@sparticuz/chromium/bin'),
      headless: chromium.headless,
    });

    let page = await browser.newPage();
    await page.evaluateOnNewDocument((previewData) => {
      localStorage.setItem('showInstructions', false);
      localStorage.setItem('previewData', previewData);
    }, event.body);

    if (process.env.SET_NGROK_HEADER === 'true') {
      page.setExtraHTTPHeaders({ 'ngrok-skip-browser-warning': 'true' })
    }
    await page.goto(`https://${process.env.DOMAIN_NAME}/#/screenshot`);

    async function getBoundingRectangle(element) {
      return page.evaluate(element => {
        const { x, y, width, height } = element.getBoundingClientRect();
        return { left: x, top: y, width, height };
      }, element);
    }

    const first = await getBoundingRectangle(await page.$('youtube-container > youtube-preview:first-child'));
    const last = await getBoundingRectangle(await page.$('youtube-container > youtube-preview:last-child'));
    const screenshotContainer = await page.$('screenshot-container');
    const screenshotContainerStats = await getBoundingRectangle(screenshotContainer);

    const isSingleRow = first.top === last.top
    const padding = first.left - screenshotContainerStats.left
    const width = last.left + last.width - first.left + padding * 2
    const options = isSingleRow ? { clip: { x: 0, y: 0, width: width, height: screenshotContainerStats.height } } : {}
    const screenshot = await screenshotContainer.screenshot(options);

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

  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};