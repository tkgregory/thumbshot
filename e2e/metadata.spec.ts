import { test, expect } from './pages/fixtures';
import { dragAndDropFile } from './utils/drag-and-drop';

test.beforeEach(async ({ page, boardsPage }) => {
    test.slow()
    await page.goto('/')
    await boardsPage.useNewBoard()
});

test('Can add a thumbnail with default values', async ({ thumbshotPage }) => {
    await thumbshotPage.addThumbnail('correct-dimensions.png')

    await expect(thumbshotPage.getPreviewTitle(0)).toHaveText('Enter your video title')
    await expect(thumbshotPage.getChannelName(0)).toHaveText('Enter your channel name')
});

test('Can drag file into first slot', async ({ page }) => {
    await dragAndDropFile(page, 'file-drop-zone', './e2e/images/correct-dimensions.png', 'correct-dimensions.png')

    const image = page.locator('youtube-thumbnail > img:first-child').first()
    const src = await image.getAttribute('src')
    expect(src).toMatch(/https/)
});

test('Can drag file into any other slot', async ({ page, thumbshotPage }) => {
    await thumbshotPage.addThumbnail('correct-dimensions.png')

    await dragAndDropFile(page, 'file-drop-zone', './e2e/images/correct-dimensions.png', 'correct-dimensions.png')

    const image = page.locator('youtube-thumbnail > img:first-child').nth(1)
    const src = await image.getAttribute('src')
    expect(src).toMatch(/https/)
});

test('Can add a thumbnail with configured channel name', async ({ settingsPage, thumbshotPage }) => {
    await settingsPage.open()
    await settingsPage.defaultChannelName().fill("Mr. Beast")
    await settingsPage.close()

    await thumbshotPage.addThumbnail('correct-dimensions.png')

    await expect(thumbshotPage.getChannelName(0)).toHaveText('Mr. Beast')
});