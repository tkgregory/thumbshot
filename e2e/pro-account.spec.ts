import { test, expect } from './pages/fixtures';

test.describe.configure({ retries: 2 });

test.beforeEach(async ({ page, boardsPage }) => {
    test.slow()
    await page.goto('/')
    await boardsPage.useNewBoard()
});

test('Can add more than 9 thumbnails', async ({ page, thumbshotPage }) => {
    for (let i = 0; i < 10; i++) {
        await thumbshotPage.clickRandom()
    }

    await expect(page.getByText('Drop thumbnails here')).toBeVisible()
});