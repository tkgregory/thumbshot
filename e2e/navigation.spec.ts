import { test, expect } from './pages/fixtures';

test.beforeEach(async ({ page }) => {
    await page.goto('/')
});

test('Navigates back to last viewed board', async ({ page, boardsPage }) => {
    const boardName = await boardsPage.useNewBoard()
    await page.goto('/')

    await expect(boardsPage.boardTitle()).toHaveText(boardName)
});

test('Forgets board across user logins', async ({ page, boardsPage, createAccountPage }) => {
    await boardsPage.useNewBoard()
    await createAccountPage.signInAsFreeUser()

    await expect(page.getByText("Create or select a thumbnail board to get started.")).toHaveCount(1)
});