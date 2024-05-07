'use strict';

import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const handler = async (event) => {
  let result = null;
  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath('/opt/nodejs/node_modules/@sparticuz/chromium/bin'),
      headless: chromium.headless,
    });

    let page = await browser.newPage();
    await page.goto('https://example.com');

    result = await page.title();
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        url: result,
      }
    ),
  };
};