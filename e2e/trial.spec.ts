import { test, expect } from './pages/fixtures';
import { dragAndDropFile } from './utils/drag-and-drop';

test.beforeEach(async ({ page }) => {
    await page.goto('/#/trial')
    page.locator('button:has-text("Compare My Thumbnails")').click()
});

test('Can add a trial thumbnail with default values', async ({ page, thumbshotPage }) => {
    await thumbshotPage.addThumbnail('correct-dimensions.png')

    const image = page.locator('youtube-thumbnail > img:first-child').first()
    const src = await image.getAttribute('src')
    expect(src).toMatch(/blob:http/)
    await expect(thumbshotPage.getPreviewTitle(0)).toHaveText('Enter your video title')
    await expect(thumbshotPage.getChannelName(0)).toHaveText('Enter your channel name')
});

test('Can change a thumbnail twice', async ({ page, thumbshotPage }) => {
    test.slow()
    await thumbshotPage.clickRandom()
    await thumbshotPage.updateThumbnail(0, 'correct-dimensions.png')
    await thumbshotPage.updateThumbnail(0, 'correct-dimensions.png')

    const image = page.locator('youtube-thumbnail > img:first-child').first()
    const src = await image.getAttribute('src')
    expect(src).toMatch(/blob:http/)
});

test('Can add up to 3 random thumbnails', async ({ page, thumbshotPage }) => {
    await thumbshotPage.clickRandom()
    await thumbshotPage.clickRandom()

    await expect(page.getByText('Add thumbnail or randomize')).toBeVisible()
    await thumbshotPage.clickRandom()
    await expect(page.getByText('Add thumbnail or randomize')).not.toBeVisible()
});

test('Can add up to 3 custom thumbnails', async ({ page, thumbshotPage }) => {
    await thumbshotPage.addThumbnail('correct-dimensions.png')
    await thumbshotPage.addThumbnail('correct-dimensions.png')

    await expect(page.getByText('Add thumbnail or randomize')).toBeVisible()
    await thumbshotPage.addThumbnail('correct-dimensions.png')
    await expect(page.getByText('Add thumbnail or randomize')).not.toBeVisible()
});

test('Can drag file into first trial slot', async ({ page }) => {
    await dragAndDropFile(page, 'file-drop-zone', './e2e/images/correct-dimensions.png', 'correct-dimensions.png')

    const image = page.locator('youtube-thumbnail > img:first-child').first()
    const src = await image.getAttribute('src')
    expect(src).toMatch(/blob:http/)
});

test('Can drag file into any other trial slot', async ({ page, thumbshotPage }) => {
    await thumbshotPage.addThumbnail('correct-dimensions.png')

    await dragAndDropFile(page, 'file-drop-zone', './e2e/images/correct-dimensions.png', 'correct-dimensions.png')

    const image = page.locator('youtube-thumbnail > img:first-child').nth(1)
    const src = await image.getAttribute('src')
    expect(src).toMatch(/blob:http/)
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