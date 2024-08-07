import { test, expect } from './pages/fixtures';

test.beforeEach(async ({ page, boardsPage }) => {
  test.slow();
  await page.goto('/')
  await boardsPage.useNewBoard()
});

test('Screenshot all button is disabled when no previews', async ({ page }) => {
  await expect(page.locator('div[data-tip="Generate shareable preview image"] > button')).toHaveCount(0)
});

test('Screenshot all button is enabled when has previews', async ({ page }) => {
  await page.locator('div[data-tip="Randomize"]').click()
  await expect(page.locator('div[data-tip="Generate shareable preview image"] > button')).toHaveCount(1)
});

test('Screenshot all button generates downloadable image URL', async ({ page, request, thumbshotPage }) => {
  await page.locator('div[data-tip="Randomize"]').click()
  await page.locator('div[data-tip="Generate shareable preview image"] > button').click()

  await expect(thumbshotPage.getScreenshotURL()).toHaveValue(/https/, { timeout: 10000 })
  const previewUrl = await thumbshotPage.getScreenshotURL().inputValue()

  const previewUrlResponse = await request.get(previewUrl)
  expect(previewUrlResponse.status()).toBe(200)
});

test('Copies image to clipboard', async ({ page, context, request, browserName }) => {
  test.skip(browserName !== 'chromium', 'Still working on it');

  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.locator('div[data-tip="Randomize"]').click()
  await page.locator('div[data-tip="Generate shareable preview image"] > button').click()
  await page.locator('div[data-tip="Copy image to clipboard"] > button').click()

  await expect(page.locator('div[data-tip="Copied!"]')).toHaveCount(1)
});

test('Downloads image', async ({ page }) => {
  const downloadPromise = page.waitForEvent('download');

  await page.locator('div[data-tip="Randomize"]').click()
  await page.locator('div[data-tip="Generate shareable preview image"] > button').click()
  await page.locator('div[data-tip="Download image"] > a').click()

  const download = await downloadPromise
  expect(download).not.toBeNull()
});