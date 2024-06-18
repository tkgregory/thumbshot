import { test, expect } from './pages/fixtures';

test.beforeEach(async ({ page, boardsPage }) => {
    test.slow()
    await page.goto('/')
    await boardsPage.useNewBoard()
});

test('Can add up to 9 thumbnails', async ({ page, thumbshotPage }) => {
    for (let i = 0; i < 8; i++) {
        await thumbshotPage.clickRandom()
    }

    await expect(page.getByText('Add thumbnail or randomize')).toBeVisible()
    await thumbshotPage.clickRandom()
    await expect(page.getByText('Add thumbnail or randomize')).not.toBeVisible()
});