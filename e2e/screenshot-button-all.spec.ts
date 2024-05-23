import { test, expect } from './pages/fixtures';

test.beforeEach(async ({page}) => {
    await page.goto('/')
    await page.locator('button:has-text("Compare My Thumbnails")').click()
  });

test('Screenshot button is disabled when no previews', async ({page}) => {
  await expect(page.locator('div[data-tip="Generate shareable preview image"] > button')).toHaveCount(0)
});

test('Screenshot button is enabled when has previews', async ({page}) => {
  await page.locator('div[data-tip="Randomize"]').click()
  await expect(page.locator('div[data-tip="Generate shareable preview image"] > button')).toHaveCount(1)
});

test('Screenshot button generates downloadable image URL', async ({page, request, thumbshotPage}) => {
  await page.locator('div[data-tip="Randomize"]').click()
  await page.locator('div[data-tip="Generate shareable preview image"] > button').click()

  await expect(thumbshotPage.getScreenshotURL()).toHaveValue(/https/)
  const previewUrl = await thumbshotPage.getScreenshotURL().inputValue()

  const previewUrlResponse = await request.get(previewUrl)
  expect(previewUrlResponse.status()).toBe(200)
});

test('Copies downloadable image URL', async ({page, context, request, browserName}) => {
  test.skip(browserName !== 'chromium', 'Still working on it');

  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.locator('div[data-tip="Randomize"]').click()
  await page.locator('div[data-tip="Generate shareable preview image"] > button').click()
  await page.locator('div[data-tip="Copy URL to clipboard"] > button').click()

  const handle = await page.evaluateHandle(() => navigator.clipboard.readText());
  const previewUrl = await handle.jsonValue();
  const previewUrlResponse = await request.get(previewUrl)
  expect(previewUrlResponse.status()).toBe(200)
});

test('Downloads image', async ({page}) => {
  const downloadPromise = page.waitForEvent('download');

  await page.locator('div[data-tip="Randomize"]').click()
  await page.locator('div[data-tip="Generate shareable preview image"] > button').click()
  await page.locator('div[data-tip="Download image"] > a').click()

  const download = await downloadPromise
  expect(download).not.toBeNull()
});