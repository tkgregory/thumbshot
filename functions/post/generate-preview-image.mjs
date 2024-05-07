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
    await page.setExtraHTTPHeaders({ 'ngrok-skip-browser-warning': 'true' });
    await page.goto('https://d293-82-69-101-116.ngrok-free.app');

    const objectKey = `${uuid()}.png`
    const screenshot = await page.screenshot();
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