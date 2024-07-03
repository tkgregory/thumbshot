import { test, expect } from './pages/fixtures';

test.beforeEach(async ({ page, createAccountPage, boardsPage }) => {
    test.slow()
    await page.goto('/')
    await createAccountPage.useNewAccount()

    await boardsPage.openBoardsDrawer()
    await boardsPage.createBoard('B')
    await boardsPage.createBoard('C')
    await boardsPage.createBoard('A')
});

test.afterEach(async ({ createAccountPage }) => {
    await createAccountPage.deleteAccount()
});

test('Sorts by name by default', async ({ boardsPage }) => {
    await expect(boardsPage.boardListIndex(0)).toHaveText('A')
    await expect(boardsPage.boardListIndex(1)).toHaveText('B')
    await expect(boardsPage.boardListIndex(2)).toHaveText('C')
});

test('Sort by name reversed', async ({ page, boardsPage }) => {
    await page.locator('.lucide-arrow-up-icon').click()

    await expect(boardsPage.boardListIndex(0)).toHaveText('C')
    await expect(boardsPage.boardListIndex(1)).toHaveText('B')
    await expect(boardsPage.boardListIndex(2)).toHaveText('A')
});

test('Sorts by updated', async ({ page, boardsPage }) => {
    await boardsPage.sortBy().selectOption('Updated')

    await expect(boardsPage.boardListIndex(0)).toHaveText('B')
    await expect(boardsPage.boardListIndex(1)).toHaveText('C')
    await expect(boardsPage.boardListIndex(2)).toHaveText('A')
});

test('Sorts by updated reversed', async ({ page, boardsPage }) => {
    await boardsPage.sortBy().selectOption('Updated')
    await page.locator('.lucide-arrow-up-icon').click()

    await expect(boardsPage.boardListIndex(0)).toHaveText('A')
    await expect(boardsPage.boardListIndex(1)).toHaveText('C')
    await expect(boardsPage.boardListIndex(2)).toHaveText('B')
});

test('Saves sort by name', async ({ page, boardsPage }) => {
    await page.locator('select[name="sort-by"]').selectOption('Name')

    await page.reload()

    await boardsPage.openBoardsDrawer()
    await expect(boardsPage.sortBy()).toHaveValue('Name')
});

test('Saves sort by updated', async ({ page, boardsPage }) => {
    await page.locator('select[name="sort-by"]').selectOption('Updated')

    await page.reload()

    await boardsPage.openBoardsDrawer()
    await expect(boardsPage.sortBy()).toHaveValue('Updated')
});

test('Saves sort direction reversed', async ({ page, boardsPage }) => {
    await page.locator('.lucide-arrow-up-icon').click()

    await page.reload()

    await boardsPage.openBoardsDrawer()
    await expect(page.locator('.lucide-arrow-down-icon')).toHaveCount(1)
});