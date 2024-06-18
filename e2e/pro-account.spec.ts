import { test, expect } from './pages/fixtures';

test.beforeEach(async ({ page, boardsPage, createAccountPage }) => {
    test.slow()
    await page.goto('/')
    await createAccountPage.signInAsProUser()
    await boardsPage.useNewBoard()
});

test('Can add more than 9 thumbnails', async ({ page, thumbshotPage }) => {
    for (let i = 0; i < 10; i++) {
        await thumbshotPage.clickRandom()
    }

    await expect(page.getByText('Add thumbnail or randomize')).toBeVisible()
});