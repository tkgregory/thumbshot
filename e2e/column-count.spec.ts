import { test, expect } from './pages/fixtures';

test.beforeEach(async ({ page, boardsPage }) => {
    await page.goto('/')
    await boardsPage.useNewBoard()
});

test('Defaults to auto column count', async ({ page }) => {
    await expect(page.locator('div[data-tip="Set column count"]')).toHaveText('Auto')
});

test('Can increase column count', async ({ page, thumbshotPage }) => {
    await thumbshotPage.getIncreaseColumnsButton().click()
    await thumbshotPage.getIncreaseColumnsButton().click()
    await expect(page.locator('div[data-tip="Set column count"]')).toHaveText('4')
});

test('Can decrease column count', async ({ page, thumbshotPage }) => {
    await thumbshotPage.getIncreaseColumnsButton().click()
    await thumbshotPage.getIncreaseColumnsButton().click()
    await thumbshotPage.getDecreaseColumnsButton().click()
    await expect(page.locator('div[data-tip="Set column count"]')).toHaveText('3')
});

test('Saves auto column count', async ({ page, thumbshotPage }) => {
    await thumbshotPage.getIncreaseColumnsButton().click()
    await thumbshotPage.getDecreaseColumnsButton().click()

    await page.reload()

    await expect(page.locator('div[data-tip="Set column count"]')).toHaveText('Auto')
});

test('Saves numeric column count', async ({ page, thumbshotPage }) => {
    await thumbshotPage.getIncreaseColumnsButton().click()

    await page.reload()

    await expect(page.locator('div[data-tip="Set column count"]')).toHaveText('3')
});