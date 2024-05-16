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

    async updateTitle(index: number, title: string) {
        await this.page.locator(`youtube-preview:nth-child(${index + 1}) span[class="cursor-pointer"]`).first().click()
        await this.page.locator('input[name="title"]').fill(title)
        await this.page.locator('input[name="title"]').blur()
    }

    async updateChannelName(index: number, channelName: string) {
        await this.page.locator(`youtube-preview:nth-child(${index + 1}) span[class="cursor-pointer"]`).nth(1).click()
        await this.page.locator('input[name="channelName"]').fill(channelName)
        await this.page.locator('input[name="channelName"]').blur()
    }

    getPreviewTitle(index: number) {
        return this.page.locator(`youtube-preview:nth-child(${index + 1}) span`).first()
    }

    async clickDelete(index: number) {
        await this.page.hover(`youtube-thumbnail:nth-child(${index + 1})`)
        await this.page.locator('youtube-thumbnail div[data-tip="Delete this preview"]').nth(index).click()
    }
}
