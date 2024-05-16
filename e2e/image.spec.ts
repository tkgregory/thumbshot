import { expect, test } from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('/')
    await page.locator('button:has-text("Compare My Thumbnails")').click()
  });

test('Exceeding browser local storage limit shows useful message', async ({page}) => {
    const fileChooserPromise1 = page.waitForEvent('filechooser');
    await page.locator('div[data-tip="Add thumbnail"] > label').click()
    const fileChooser1 = await fileChooserPromise1;
    await fileChooser1.setFiles(['./e2e/images/large-file-size.png']);

    const fileChooserPromise2 = page.waitForEvent('filechooser');
    await page.locator('div[data-tip="Add thumbnail"] > label').click()
    const fileChooser2 = await fileChooserPromise2;
    await fileChooser2.setFiles(['./e2e/images/large-file-size.png']);

    await expect(page.locator('p:has-text("Thumbnail images too large.")')).toHaveCount(1);
});

test('Thumbnail too small', async ({page}) => {
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('div[data-tip="Add thumbnail"] > label').click()
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(['./e2e/images/right-ratio-too-small.png']);

    await expect(page.locator('p:has-text("Image size must be at least 1280x720 pixels")')).toHaveCount(1)
});

test('Thumbnail wrong format', async ({page}) => {
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('div[data-tip="Add thumbnail"] > label').click()
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(['./e2e/images/incorrect-format.txt']);

    await expect(page.locator('p:has-text("Image must be one of these types: jpg, jpeg, png")')).toHaveCount(1)
});

test('Thumbnail wrong aspect ratio', async ({page}) => {
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('div[data-tip="Add thumbnail"] > label').click()
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(['./e2e/images/wrong-aspect-ratio.png']);

    await expect(page.locator('p:has-text("Image aspect ratio must be 16:9")')).toHaveCount(1)
});

test('Thumbnail can be oversized', async ({page}) => {
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('div[data-tip="Add thumbnail"] > label').click()
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(['./e2e/images/oversized.png']);
    await expect(page.locator('div[role="alert"]')).toHaveCount(0)
});