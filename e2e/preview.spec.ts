import { expect, test } from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('/')
    await page.locator('button:has-text("Compare My Thumbnails")').click()
    await page.locator('div[data-tip="Randomize"]').click()
  });

test('Shows default YouTube preview on load', async ({page}) => {
    await expect(page.locator('div >> text="Some Channel Name"')).toHaveCount(1)
});

test('Update title', async ({page}) => {
    await page.locator('span[class="cursor-pointer"]').first().click()
    await page.locator('input[name="title"]').fill('Updated title')
    await page.locator('input[name="title"]').blur()
    await expect(page.locator('span >> text="Updated title"')).toHaveCount(1)
});