import { test, expect } from './pages/fixtures';

test.beforeEach(async ({ browserName, page, boardsPage, thumbshotPage }) => {
    test.skip(browserName === 'webkit', 'Not working');
    await page.goto('/')
    await boardsPage.useNewBoard()

    await thumbshotPage.clickRandom()
    await thumbshotPage.updateTitle(0, 'First title')
    await thumbshotPage.clickRandom()
    await thumbshotPage.updateTitle(1, 'Second title')
    await thumbshotPage.clickRandom()
    await thumbshotPage.updateTitle(2, 'Third title')
});

test('Drag and drop to right before', async ({ thumbshotPage }) => {
    await thumbshotPage.getPreview(0).dragTo(thumbshotPage.getPreview(1));

    await expect(thumbshotPage.getPreviewTitle(0)).toHaveText('Second title')
    await expect(thumbshotPage.getPreviewTitle(1)).toHaveText('First title')
    await expect(thumbshotPage.getPreviewTitle(2)).toHaveText('Third title')
});

test('Drag and drop to left before', async ({ thumbshotPage }) => {
    await thumbshotPage.getPreview(2).dragTo(thumbshotPage.getPreview(0));

    await expect(thumbshotPage.getPreviewTitle(0)).toHaveText('Third title')
    await expect(thumbshotPage.getPreviewTitle(1)).toHaveText('First title')
    await expect(thumbshotPage.getPreviewTitle(2)).toHaveText('Second title')
});