import { test, expect } from './pages/fixtures';

test.beforeEach(async ({ page, boardsPage, thumbshotPage }) => {
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
    await thumbshotPage.getPreviewTitle(0).dragTo(thumbshotPage.getPreviewTitle(2));

    await expect(thumbshotPage.getPreviewTitle(0)).toHaveText('Second title')
    await expect(thumbshotPage.getPreviewTitle(1)).toHaveText('First title')
    await expect(thumbshotPage.getPreviewTitle(2)).toHaveText('Third title')
});

test('Drag and drop to right after', async ({ thumbshotPage }) => {
    const targetBoundingBox = await thumbshotPage.getPreviewTitle(2).boundingBox();
    if (targetBoundingBox === null) {
        throw new Error('Bounding box is null')
    }

    await thumbshotPage.getPreviewTitle(0).dragTo(thumbshotPage.getPreviewTitle(2), { targetPosition: { x: targetBoundingBox.width, y: 0 } });

    await expect(thumbshotPage.getPreviewTitle(0)).toHaveText('Second title')
    await expect(thumbshotPage.getPreviewTitle(1)).toHaveText('Third title')
    await expect(thumbshotPage.getPreviewTitle(2)).toHaveText('First title')
});

test('Drag and drop to left before', async ({ thumbshotPage }) => {
    await thumbshotPage.getPreviewTitle(2).dragTo(thumbshotPage.getPreviewTitle(0));

    await expect(thumbshotPage.getPreviewTitle(0)).toHaveText('Third title')
    await expect(thumbshotPage.getPreviewTitle(1)).toHaveText('First title')
    await expect(thumbshotPage.getPreviewTitle(2)).toHaveText('Second title')
});

test('Drag and drop to left after', async ({ thumbshotPage }) => {
    const targetBoundingBox = await thumbshotPage.getPreviewTitle(0).boundingBox();
    if (targetBoundingBox === null) {
        throw new Error('Bounding box is null')
    }

    await thumbshotPage.getPreviewTitle(2).dragTo(thumbshotPage.getPreviewTitle(0), { targetPosition: { x: targetBoundingBox.width, y: 0 } });

    await expect(thumbshotPage.getPreviewTitle(0)).toHaveText('First title')
    await expect(thumbshotPage.getPreviewTitle(1)).toHaveText('Third title')
    await expect(thumbshotPage.getPreviewTitle(2)).toHaveText('Second title')
});