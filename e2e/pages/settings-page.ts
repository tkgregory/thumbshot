import { type Page } from '@playwright/test';

export class SettingsPage {
    constructor(public readonly page: Page) {
    }

    async open() {
        await this.page.locator('.lucide-circle-user-round-icon').click()
        await this.page.locator('a:has-text("Settings")').click()
    }

    numberingSetting() {
        return this.page.locator('span:has-text("Show numbers on screenshot") + input')
    }
}
