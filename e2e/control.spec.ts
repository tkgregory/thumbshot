import { expect, test } from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('/')
    await page.locator('button:has-text("Compare My Thumbnails")').click()
  });

test('Reset button is disabled when no previews', async ({page}) => {
    await expect(page.locator('div[data-tip="Reset"] > button')).toHaveCount(0)
});

test('Reset button is enabled when has previews', async ({page}) => {
  await page.locator('div[data-tip="Randomize"]').click()
  await expect(page.locator('div[data-tip="Reset"] > button')).toHaveCount(1)
});

test('Reset button removes all previews', async ({page}) => {
  await page.locator('div[data-tip="Randomize"]').click()
  await page.locator('div[data-tip="Randomize"]').click()
  await expect(page.locator('youtube-preview')).toHaveCount(2)
  await page.locator('div[data-tip="Reset"]').click()
  await expect(page.locator('youtube-preview')).toHaveCount(0)
});