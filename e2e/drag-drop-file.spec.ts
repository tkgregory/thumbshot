
import { test, expect } from './pages/fixtures';
import { dragAndDropFile, dragAndDropFiles } from './utils/drag-and-drop';

test.describe.configure({ retries: 2 });

test.beforeEach(async ({ page, boardsPage }) => {
    test.slow()
    await page.goto('/')
    await boardsPage.useNewBoard()
});
test.beforeEach(async ({ browserName }) => {
    test.skip(browserName === 'webkit', 'Not working');
});

test(`Can drag single file`, async ({ page, thumbshotPage }) => {
    await dragAndDropFile(page, 'file-drop-zone', './e2e/images/correct-dimensions.png')
    await expect(thumbshotPage.allPreviews()).toHaveCount(1, { timeout: 5000 })
});

test(`Can drag multiple files}`, async ({ page, thumbshotPage }) => {
    await dragAndDropFiles(page, 'file-drop-zone', ['./e2e/images/correct-dimensions.png', './e2e/images/correct-dimensions-2.jpg'])
    await expect(thumbshotPage.allPreviews()).toHaveCount(2, { timeout: 5000 })
});