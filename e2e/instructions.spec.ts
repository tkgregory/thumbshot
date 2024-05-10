import { expect, test } from '@playwright/test';

test('Shows instructions dialog', async ({page}) => {
    await page.goto('/')
    await expect(page.locator('h3:has-text("Compare and share YouTube title & thumbnail ideas!")')).toBeVisible()
});

test('Shows instructions dialog on page reload', async ({page}) => {
    await page.goto('/')
    await page.locator('button:has-text("Compare My Thumbnails")').click()
    await page.goto('/')
    await expect(page.locator('h3:has-text("Compare and share YouTube title & thumbnail ideas!")')).toBeVisible()
});

test('Can dismiss instructions dialog forever', async ({page}) => {
    await page.goto('/')
    await page.locator('button:has-text("Don\'t show again")').click()
    await page.goto('/')
    await expect(page.locator('h3:has-text("Compare and share YouTube title & thumbnail ideas!")')).toHaveCount(0)
});
