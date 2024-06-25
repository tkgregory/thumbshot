import { test, expect } from './pages/fixtures';

test.beforeEach(async ({ page, boardsPage }) => {
    test.slow()
    await page.goto('/')
    await boardsPage.useNewBoard()
});

test('Get from YouTube - thumbnail teaser', async ({ page, thumbshotPage }) => {
    await thumbshotPage.clickGetFromYouTubeForTeaser()
    await page.getByLabel('Video URL').fill('https://www.youtube.com/watch?v=9bZkp7q19f0')
    await page.locator('button:has-text("Go")').first().click()

    await expect(thumbshotPage.getPreviewTitle(0)).toContainText('PSY - GANGNAM STYLE(강남스타일) M/V')
    await expect(thumbshotPage.getChannelName(0)).toContainText('officialpsy')
    await expect(thumbshotPage.getThumbnailImage(0)).toHaveAttribute('src', 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg')
});

test('Get from YouTube - update preview', async ({ page, thumbshotPage }) => {
    await thumbshotPage.clickRandom()
    await thumbshotPage.clickGetFromYouTube(0)

    await page.locator('label:has-text("Video URL") input').first().fill('https://www.youtube.com/watch?v=9bZkp7q19f0')
    await page.locator('button:has-text("Go")').first().click()

    await expect(thumbshotPage.getPreviewTitle(0)).toContainText('PSY - GANGNAM STYLE(강남스타일) M/V')
    await expect(thumbshotPage.getChannelName(0)).toContainText('officialpsy')
    await expect(thumbshotPage.getThumbnailImage(0)).toHaveAttribute('src', 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg')
});

test('Get from YouTube - update preview with custom thumbnail', async ({ page, thumbshotPage }) => {
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('div[data-tip="Add thumbnail"] > label').click()
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(['./e2e/images/correct-dimensions.png']);

    await thumbshotPage.clickGetFromYouTube(0)

    await page.locator('label:has-text("Video URL") input').first().fill('https://www.youtube.com/watch?v=9bZkp7q19f0')
    await page.locator('button:has-text("Go")').first().click()

    await expect(thumbshotPage.getPreviewTitle(0)).toContainText('PSY - GANGNAM STYLE(강남스타일) M/V')
    await expect(thumbshotPage.getChannelName(0)).toContainText('officialpsy')
    await expect(thumbshotPage.getThumbnailImage(0)).toHaveAttribute('src', 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg')
});