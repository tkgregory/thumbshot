import { test, expect } from './pages/fixtures';

test.beforeEach(async ({ page, boardsPage }) => {
  test.slow();
  await page.goto('/')
  await boardsPage.useNewBoard()
  await page.locator('div[data-tip="Randomize"]').click()
});

test('Single screenshot button generates downloadable image URL', async ({ request, thumbshotPage }) => {
  await thumbshotPage.clickGenerateSingleScreenshot(0)

  await expect(thumbshotPage.getScreenshotURL()).toHaveValue(/https/, { timeout: 10000 })

  const previewUrl = await thumbshotPage.getScreenshotURL().inputValue()
  const previewUrlResponse = await request.get(previewUrl)
  expect(previewUrlResponse.status()).toBe(200)
});

test('Single screenshot button stops loading', async ({ thumbshotPage }) => {
  test.slow();
  await thumbshotPage.clickGenerateSingleScreenshot(0)
  await thumbshotPage.generatePreviewModalIsOpen()
  await expect(thumbshotPage.getScreenshotURL()).toHaveValue(/https/, { timeout: 10000 })

  thumbshotPage.dismissModal()

  await thumbshotPage.clickGenerateSingleScreenshot(0)
  await thumbshotPage.generatePreviewModalIsOpen()
  await expect(thumbshotPage.getScreenshotURL()).toHaveValue(/https/, { timeout: 10000 })
});

test('Copies image to clipboard', async ({ page, context, request, browserName }) => {
  test.skip(browserName !== 'chromium', 'Still working on it');

  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.locator('div[data-tip="Randomize"]').click()
  await page.locator('div[data-tip="Generate shareable preview image"] > button').click()
  await page.locator('div[data-tip="Copy image to clipboard"] > button').click()

  await expect(page.locator('div[data-tip="Copied!"]')).toHaveCount(1)
});

test('Downloads image', async ({ page, thumbshotPage }) => {
  const downloadPromise = page.waitForEvent('download');

  await thumbshotPage.clickGenerateSingleScreenshot(0)
  await page.locator('div[data-tip="Download image"] > a').click()

  const download = await downloadPromise
  expect(download).not.toBeNull()
});