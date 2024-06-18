import { expect, test } from '@playwright/test';

test("Don't show instructions dialog on home page", async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h3:has-text("Compare and share YouTube title & thumbnail ideas!")')).toHaveCount(0)
});

test("Show instructions dialog on #/trial page", async ({ page }) => {
    await page.goto('/#/trial')
    await expect(page.locator('h3:has-text("Compare and share YouTube title & thumbnail ideas!")')).toBeVisible()
});

test('Shows instructions dialog on page reload', async ({ page }) => {
    await page.goto('/#/trial')
    await page.locator('button:has-text("Compare My Thumbnails")').click()
    await page.goto('/#/trial')
    await expect(page.locator('h3:has-text("Compare and share YouTube title & thumbnail ideas!")')).toBeVisible()
});

test('Can dismiss instructions dialog forever', async ({ page }) => {
    await page.goto('/#/trial')
    await page.locator('button:has-text("Don\'t show again")').click()
    await page.reload()
    await expect(page.locator('h3:has-text("Compare and share YouTube title & thumbnail ideas!")')).toHaveCount(0)
});
