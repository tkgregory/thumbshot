import { Page, expect } from '@playwright/test';

export class ThumbShot {
    constructor(public readonly page: Page) {
    }

    async addThumbnail(imageName: string) {
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.page.locator('div[data-tip="Add thumbnail"] > label').click()
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles([`./e2e/images/${imageName}`]);
    }
}