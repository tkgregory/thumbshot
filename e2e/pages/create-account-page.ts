import { type Page } from '@playwright/test';

export class CreateAccountPage {
    constructor(public readonly page: Page) {
    }

    signOutButton() {
        return this.page.locator('.btn >> text="Sign out"')
    }

    signInButton() {
        return this.page.locator('a >> text="Sign in"').first()
    }
}
