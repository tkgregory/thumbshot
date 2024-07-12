
import { test, expect } from './pages/fixtures';
import { dragAndDropFile } from './utils/drag-and-drop';

test.beforeEach(async ({ browserName }) => {
    test.skip(browserName === 'webkit', 'Not working');
});

test('Can drag file into first trial slot', async ({ page }) => {
    await page.goto('/#/trial')
    page.locator('button:has-text("Compare My Thumbnails")').click()

    await dragAndDropFile(page, 'file-drop-zone', './e2e/images/correct-dimensions.png', 'correct-dimensions.png')
    const image = page.locator('youtube-thumbnail > img:first-child').first()
    const src = await image.getAttribute('src')
    expect(src).toMatch(/blob:http/)
});

test('Can drag file into any other trial slot', async ({ page, thumbshotPage }) => {
    await page.goto('/#/trial')
    page.locator('button:has-text("Compare My Thumbnails")').click()

    await thumbshotPage.addThumbnail('correct-dimensions.png')

    await dragAndDropFile(page, 'file-drop-zone', './e2e/images/correct-dimensions.png', 'correct-dimensions.png')
    const image = page.locator('youtube-thumbnail > img:first-child').nth(1)
    const src = await image.getAttribute('src')
    expect(src).toMatch(/blob:http/)
});

test('Can drag file into first slot', async ({ page, boardsPage }) => {
    await page.goto('/')
    await boardsPage.useNewBoard()

    await dragAndDropFile(page, 'file-drop-zone', './e2e/images/correct-dimensions.png', 'correct-dimensions.png')

    const image = page.locator('youtube-thumbnail > img:first-child').first()
    const src = await image.getAttribute('src')
    expect(src).toMatch(/https/)
});

test('Can drag file into any other slot', async ({ page, thumbshotPage, boardsPage }) => {
    await page.goto('/')
    await boardsPage.useNewBoard()

    await thumbshotPage.addThumbnail('correct-dimensions.png')

    await dragAndDropFile(page, 'file-drop-zone', './e2e/images/correct-dimensions.png', 'correct-dimensions.png')

    const image = page.locator('youtube-thumbnail > img:first-child').nth(1)
    const src = await image.getAttribute('src')
    expect(src).toMatch(/https/)
});