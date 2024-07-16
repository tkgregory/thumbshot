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

test('Uploads multiple thumbnails at once', async ({ thumbshotPage }) => {
    await thumbshotPage.addThumbnails(['correct-dimensions.png', 'correct-dimensions-2.jpg'])

    await expect(thumbshotPage.allPreviews()).toHaveCount(2, { timeout: 5000 })
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

test('Can add thumbnail with default values', async ({ page, thumbshotPage, boardsPage }) => {
    await thumbshotPage.addThumbnail('correct-dimensions.png')

    const image = page.locator('youtube-thumbnail > img:first-child').first()
    const src = await image.getAttribute('src')
    expect(src).toMatch(/https:/)

    const boardTitle = await boardsPage.boardTitle().textContent()
    if (boardTitle == null) {
        throw new Error('Board title not found')
    }
    await expect(thumbshotPage.getPreviewTitle(0)).toHaveText(boardTitle)
    await expect(thumbshotPage.getChannelName(0)).toHaveText('Enter your channel name')
});

test('Can change a thumbnail twice', async ({ page, thumbshotPage }) => {
    test.slow()
    await thumbshotPage.clickRandom()
    await thumbshotPage.updateThumbnail(0, 'correct-dimensions.png')
    await thumbshotPage.updateThumbnail(0, 'correct-dimensions.png')

    const image = page.locator('youtube-thumbnail > img:first-child').first()
    const src = await image.getAttribute('src')
    expect(src).toMatch(/https/)
});

test('Can update title', async ({ page, thumbshotPage }) => {
    thumbshotPage.addThumbnail('correct-dimensions.png')

    await thumbshotPage.updateTitle(0, 'Updated title')
    await expect(page.locator('span >> text="Updated title"')).toHaveCount(1)
});

test('Can update 2nd title', async ({ page, thumbshotPage }) => {
    thumbshotPage.addThumbnail('correct-dimensions.png')
    await thumbshotPage.updateTitle(0, 'Preview 1')

    thumbshotPage.addThumbnail('correct-dimensions.png')
    await thumbshotPage.updateTitle(1, 'Preview 2')

    await expect(page.locator('youtube-thumbnail')).toHaveCount(2)
    await expect(thumbshotPage.getPreviewTitle(0)).toHaveText('Preview 1')
    await expect(thumbshotPage.getPreviewTitle(1)).toHaveText('Preview 2')
});

test('Can update channel name', async ({ page, thumbshotPage }) => {
    thumbshotPage.addThumbnail('correct-dimensions.png')

    await thumbshotPage.updateChannelName(0, 'Updated channel name')
    await expect(page.locator('span >> text="Updated channel name"')).toHaveCount(1)
});

test('Can delete preview', async ({ page, thumbshotPage }) => {
    thumbshotPage.addThumbnail('correct-dimensions.png')
    await thumbshotPage.updateTitle(0, 'Preview 1')

    thumbshotPage.addThumbnail('correct-dimensions.png')
    await thumbshotPage.updateTitle(1, 'Preview 2')

    await thumbshotPage.clickDelete(0)

    await expect(page.locator('youtube-thumbnail')).toHaveCount(1)
    await expect(thumbshotPage.getPreviewTitle(0)).toHaveText('Preview 2')
});