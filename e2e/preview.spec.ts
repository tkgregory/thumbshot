import { expect, test } from '@playwright/test';

test('Shows default YouTube preview on load', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('div >> text="Some Channel Name"')).toHaveCount(1)
});

test('Update title', async ({ page }) => {
    await page.goto('/')
    await page.locator('span').first().click()
    await page.locator('input[name="title"]').fill('Updated title')
    await page.locator('input[name="title"]').blur()
    await expect(page.locator('span >> text="Updated title"')).toHaveCount(1)
});

test('Thumbnail too small', async ({ page }) => {
    await page.goto('/')
    await page.locator('input[name="thumbnail"]').setInputFiles(['./e2e/images/right-ratio-too-small.png']);
    await expect(page.locator('div[role="alert"]')).toHaveText("Image size must be at least 1280x720 pixels")
});

test('Thumbnail wrong format', async ({ page }) => {
    await page.goto('/')
    await page.locator('input[name="thumbnail"]').setInputFiles(['./e2e/images/incorrect-format.txt']);
    await expect(page.locator('div[role="alert"]')).toHaveText("Image must be one of these types: jpg, jpeg, png")
});

test('Thumbnail wrong aspect ratio', async ({ page }) => {
    await page.goto('/')
    await page.locator('input[name="thumbnail"]').setInputFiles(['./e2e/images/wrong-aspect-ratio.png']);
    await expect(page.locator('div[role="alert"]')).toHaveText("Image aspect ratio must be 16:9")
});

test('Thumbnail can be oversized', async ({ page }) => {
    await page.goto('/')
    await page.locator('input[name="thumbnail"]').setInputFiles(['./e2e/images/oversized.png']);
    await expect(page.locator('div[role="alert"]')).toHaveCount(0)
});