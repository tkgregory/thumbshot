import { test, expect } from './pages/fixtures';

test.beforeEach(async ({page}) => {
    await page.goto('/')
    await page.locator('button:has-text("Compare My Thumbnails")').click()
});

test('Can add a thumbnail', async ({page, thumbshot}) => {
    thumbshot.addThumbnail('oversized.png')

    const image = await page.locator('youtube-thumbnail > img:first-child').first() as HTMLImageElement
    const src = await image.getAttribute('src')
    await expect(src).toMatch(/data:image\/png;base64,iVB/)
});

test('Can update title', async ({page, thumbshot}) => {
    thumbshot.addThumbnail('oversized.png')

    await thumbshot.updateTitle(0, 'Updated title')
    await expect(page.locator('span >> text="Updated title"')).toHaveCount(1)
});

test('Can update 2nd title', async ({page, thumbshot}) => {
    thumbshot.addThumbnail('oversized.png')
    await thumbshot.updateTitle(0, 'Preview 1')

    thumbshot.addThumbnail('oversized.png')
    await thumbshot.updateTitle(1, 'Preview 2')

    await expect(page.locator('youtube-thumbnail')).toHaveCount(2)
    await expect(thumbshot.getPreviewTitle(0)).toHaveText('Preview 1')
    await expect(thumbshot.getPreviewTitle(1)).toHaveText('Preview 2')
});

test('Can update channel name', async ({page, thumbshot}) => {
    thumbshot.addThumbnail('oversized.png')

    await thumbshot.updateChannelName(0, 'Updated channel name')
    await expect(page.locator('span >> text="Updated channel name"')).toHaveCount(1)
});

test('Can delete preview', async ({page, thumbshot}) => {
    thumbshot.addThumbnail('oversized.png')
    await thumbshot.updateTitle(0, 'Preview 1')

    thumbshot.addThumbnail('oversized.png')
    await thumbshot.updateTitle(1, 'Preview 2')

    await thumbshot.clickDelete(0)

    await expect(page.locator('youtube-thumbnail')).toHaveCount(1)
    await expect(thumbshot.getPreviewTitle(0)).toHaveText('Preview 2')
});