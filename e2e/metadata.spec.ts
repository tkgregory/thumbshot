import { test, expect } from './pages/fixtures';

test.beforeEach(async ({ page, boardsPage }) => {
    test.slow()
    await page.goto('/')
    await boardsPage.useNewBoard()
});

test('Can add a thumbnail with default values', async ({ thumbshotPage }) => {
    await thumbshotPage.addThumbnail('correct-dimensions.png')

    await expect(thumbshotPage.getPreviewTitle(0)).toHaveText('Enter your video title', { timeout: 5000 })
    await expect(thumbshotPage.getChannelName(0)).toHaveText('Enter your channel name')
});

test('Can add a thumbnail with configured channel name', async ({ settingsPage, thumbshotPage }) => {
    await settingsPage.open()
    await settingsPage.defaultChannelName().fill("Mr. Beast")
    await settingsPage.close()

    await thumbshotPage.addThumbnail('correct-dimensions.png')

    await expect(thumbshotPage.getChannelName(0)).toHaveText('Mr. Beast', { timeout: 5000 })
});