import { type Page } from '@playwright/test';
import { expect } from './fixtures';

export class ThumbShotPage {
    constructor(public readonly page: Page) {
    }

    async addThumbnail(imageName: string) {
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.page.locator('div[data-tip="Add thumbnail"] > label').click()
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles([`./e2e/images/${imageName}`]);
    }

    async addThumbnails(imageName: string[]) {
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.page.locator('div[data-tip="Add thumbnail"] > label').click()
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(imageName.map(name => `./e2e/images/${name}`));
    }

    async updateTitle(index: number, title: string) {
        await this.page.locator(`draggable-element:nth-child(${index + 1}) span[class="cursor-pointer"]`).first().click()
        await this.page.locator('input[name="title"]').fill(title)
        await this.page.locator('input[name="title"]').blur()
    }

    async updateChannelName(index: number, channelName: string) {
        await this.page.locator(`draggable-element:nth-child(${index + 1}) span[class="cursor-pointer"]`).nth(1).click()
        await this.page.locator('input[name="channelName"]').fill(channelName)
        await this.page.locator('input[name="channelName"]').blur()
    }

    allPreviews() {
        return this.page.locator('youtube-container youtube-preview')
    }

    getPreview(index: number) {
        return this.page.locator(`draggable-element:nth-child(${index + 1}) youtube-preview`).first()
    }

    getPreviewTitle(index: number) {
        return this.page.locator(`draggable-element:nth-child(${index + 1}) youtube-metadata-text span`).first()
    }

    getChannelName(index: number) {
        return this.page.locator(`draggable-element:nth-child(${index + 1}) youtube-metadata-text span`).nth(1)
    }

    getThumbnailImage(index: number) {
        return this.page.locator(`draggable-element:nth-child(${index + 1}) youtube-thumbnail img`).first()
    }

    getScreenshotURL() {
        return this.page.locator('input[id="previewUrl"]')
    }

    getResetButton() {
        return this.page.locator('div[data-tip="Reset"]')
    }

    getDecreaseColumnsButton() {
        return this.page.locator('div[data-tip="Set column count"] .lucide-minus-icon')
    }

    getIncreaseColumnsButton() {
        return this.page.locator('div[data-tip="Set column count"] .lucide-plus-icon')
    }

    async clickDelete(index: number) {
        await this.page.hover(`youtube-thumbnail:nth-child(${index + 1})`)
        await this.page.locator('youtube-thumbnail div[data-tip="Delete this preview"]').nth(index).click()
    }

    async clickGenerateSingleScreenshot(index: number) {
        await this.page.hover(`youtube-thumbnail:nth-child(${index + 1})`)
        await this.page.locator('youtube-thumbnail div[data-tip="Generate single preview image"]').nth(index).click()
    }

    async clickGetFromYouTube(index: number) {
        await this.page.hover(`youtube-thumbnail:nth-child(${index + 1})`)
        await this.page.locator('youtube-thumbnail div[data-tip="Get from YouTube"]').nth(index).click()
    }

    async updateThumbnail(index: number, imageName: string) {
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.page.hover(`youtube-thumbnail:nth-child(${index + 1})`)
        await this.page.locator('youtube-thumbnail div[data-tip="Change thumbnail"]').nth(index).click()
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles([`./e2e/images/${imageName}`]);
    }

    async generatePreviewModalIsOpen() {
        await expect(this.page.locator('#generate_preview_modal[open]')).toHaveCount(1, { timeout: 10000 })
    }

    async dismissModal() {
        await this.page.mouse.click(10, 10)
    }

    async clickRandom() {
        const previewCount = await this.allPreviews().count()
        await this.page.locator('div[data-tip="Randomize"]').click()
        await expect(this.allPreviews()).toHaveCount(previewCount + 1)
    }

    async clickGetFromYouTubeForTeaser() {
        await this.page.locator('div[data-tip="Get from YouTube"]:not(youtube-preview div)').click()
    }
}
