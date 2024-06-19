import { test, expect } from './pages/fixtures';

test.describe(() => {
    test.describe.configure({ retries: 2 });

    test.beforeEach(async ({ page }) => {
        test.slow()
        await page.goto('/#/trial')
        await page.locator('button:has-text("Compare My Thumbnails")').click()
    });

    test('Thumbnail too small', async ({ page }) => {
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.locator('div[data-tip="Add thumbnail"] > label').click()
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(['./e2e/images/right-ratio-too-small.png']);

        await expect(page.locator('p:has-text("Image size must be at least 1280x720 pixels")')).toHaveCount(1)
    });

    test('Thumbnail wrong format', async ({ page }) => {
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.locator('div[data-tip="Add thumbnail"] > label').click()
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(['./e2e/images/incorrect-format.txt']);

        await expect(page.locator('p:has-text("Image must be one of these types: jpg, jpeg, png")')).toHaveCount(1)
    });

    test('Thumbnail wrong aspect ratio', async ({ page }) => {
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.locator('div[data-tip="Add thumbnail"] > label').click()
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(['./e2e/images/wrong-aspect-ratio.png']);

        await expect(page.locator('p:has-text("Image aspect ratio must be 16:9")')).toHaveCount(1)
    });

    test('Thumbnail can be oversized', async ({ page }) => {
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.locator('div[data-tip="Add thumbnail"] > label').click()
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(['./e2e/images/oversized.png']);
        await expect(page.locator('div[role="alert"]')).toHaveCount(0)
    });

    test('Thumbnail can be the same as previous', async ({ page, thumbshotPage }) => {
        thumbshotPage.addThumbnail('same-file/1.jpg')
        const image1 = page.locator('youtube-thumbnail > img:first-child').first()
        const src1 = await image1.getAttribute('src')

        thumbshotPage.addThumbnail('same-file/2.jpg')
        const image2 = page.locator('youtube-thumbnail > img:first-child').first()
        const src2 = await image2.getAttribute('src')
        expect(src2).toBe(src1)
    });

    test('Thumbnail can have same name as previous', async ({ page, thumbshotPage }) => {
        thumbshotPage.addThumbnail('same-name/1/quit.jpg')
        const image1 = page.locator('youtube-thumbnail > img:first-child').first()
        const src1 = await image1.getAttribute('src')

        thumbshotPage.addThumbnail('same-name/2/quit.jpg')
        const image2 = page.locator('youtube-thumbnail > img:first-child').nth(1)
        const src2 = await image2.getAttribute('src')
        expect(src2).not.toBe(src1)
    });
});