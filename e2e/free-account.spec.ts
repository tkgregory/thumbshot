import { test, expect } from './pages/fixtures';
import { deleteUserBoards } from './utils/user';

test.beforeEach(async ({ page, createAccountPage }) => {
    test.slow()
    await deleteUserBoards('54b8c408-d041-703e-9e66-0fe343b5a7ba') // t.k.gregory+automatedtestuser@gmail.com
    await page.goto('/')
    await createAccountPage.signInAsFreeUser()

});

test('Can add up to 9 thumbnails', async ({ page, thumbshotPage, boardsPage }) => {
    await boardsPage.useNewBoard()

    for (let i = 0; i < 8; i++) {
        await thumbshotPage.clickRandom()
    }

    await expect(page.getByText('Add thumbnail or randomize')).toBeVisible()
    await thumbshotPage.clickRandom()
    await expect(page.getByText('Add thumbnail or randomize')).not.toBeVisible()
});

test('Can add up to 3 boards', async ({ boardsPage }) => {
    await boardsPage.openBoardsDrawer()
    await boardsPage.createBoardWithRandomName()
    await boardsPage.createBoardWithRandomName()
    await expect(boardsPage.createBoardButton()).toHaveCount(1)

    await boardsPage.createBoardWithRandomName()

    await expect(boardsPage.createBoardButton()).toHaveCount(0)
});