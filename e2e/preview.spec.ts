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

    await page.locator('span[class="cursor-pointer"]').first().click()
    await page.locator('input[name="title"]').fill('Updated title')
    await page.locator('input[name="title"]').blur()
    await expect(page.locator('span >> text="Updated title"')).toHaveCount(1)
});

test('Can update channel name', async ({page, thumbshot}) => {
    thumbshot.addThumbnail('oversized.png')

    await page.locator('span[class="cursor-pointer"]').nth(1).click()
    await page.locator('input[name="channelName"]').fill('Updated channel name')
    await page.locator('input[name="channelName"]').blur()
    await expect(page.locator('span >> text="Updated channel name"')).toHaveCount(1)
});