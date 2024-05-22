import { type Page } from '@playwright/test';

export class SettingsPage {
    constructor(public readonly page: Page) {
    }

    async open() {
        await this.page.locator('div[data-tip="Change settings"]').click()
    }

    numberingSetting() {
        return this.page.locator('span:has-text("Show numbers on screenshot") + input')
    }
}
