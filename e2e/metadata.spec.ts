import { test, expect } from './pages/fixtures';

test.beforeEach(async ({ page, boardsPage }) => {
    test.slow()
    await page.goto('/')
    await boardsPage.useNewBoard()
});

test('Uses board name for title', async ({ thumbshotPage, boardsPage }) => {
    await thumbshotPage.addThumbnail('correct-dimensions.png')

    const boardTitle = await boardsPage.boardTitle().textContent()
    if (boardTitle == null) {
        throw new Error('Board title not found')
    }

    await expect(thumbshotPage.getPreviewTitle(0)).toHaveText(boardTitle, { timeout: 5000 })
});

test('Uses default channel name', async ({ thumbshotPage }) => {
    await thumbshotPage.addThumbnail('correct-dimensions.png')

    await expect(thumbshotPage.getChannelName(0)).toHaveText('Enter your channel name', { timeout: 5000 })
});

test('Uses configured channel name', async ({ settingsPage, thumbshotPage }) => {
    await settingsPage.open()
    await settingsPage.defaultChannelName().fill("Mr. Beast")
    await settingsPage.close()

    await thumbshotPage.addThumbnail('correct-dimensions.png')

    await expect(thumbshotPage.getChannelName(0)).toHaveText('Mr. Beast', { timeout: 5000 })
});