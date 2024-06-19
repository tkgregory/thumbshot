import { test, expect } from './pages/fixtures';

test.beforeEach(async ({ page, boardsPage }) => {
  await page.goto('/')
  await boardsPage.useNewBoard()
});

test('Reset button is disabled when no previews', async ({ page }) => {
  await expect(page.locator('div[data-tip="Reset"] > button')).toHaveCount(0)
});

test('Reset button is enabled when has previews', async ({ page }) => {
  await page.locator('div[data-tip="Randomize"]').click()
  await expect(page.locator('div[data-tip="Reset"] > button')).toHaveCount(1)
});

test('Reset button removes all previews', async ({ page, thumbshotPage }) => {
  await page.locator('div[data-tip="Randomize"]').click()
  await page.locator('div[data-tip="Randomize"]').click()
  await expect(page.locator('youtube-preview')).toHaveCount(2)
  await thumbshotPage.getResetButton().click()
  await expect(page.locator('youtube-preview')).toHaveCount(0)
});