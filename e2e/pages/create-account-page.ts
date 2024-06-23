import { type Page, expect } from '@playwright/test';

export class CreateAccountPage {
    constructor(public readonly page: Page) {
    }

    signOutButton() {
        return this.page.locator('.btn >> text="Sign out"')
    }

    signInButton() {
        return this.page.locator('a >> text="Sign in"').first()
    }

    async signInAsFreeUser() {
        await this.signOutButton().click()
        await expect(this.page.locator('.btn >> text="Sign in"')).toHaveCount(1, { timeout: 10000 })

        await this.signInButton().click()
        await this.page.locator('input[name="username"]').fill('t.k.gregory+automatedtestuser@gmail.com')
        const password = process.env.THUMBSHOT_TEST_USER_PASSWORD
        if (!password) {
            throw new Error('Supply test user password using `THUMBSHOT_PRO_TEST_USER_PASSWORD` environment variable.')
        }
        await this.page.locator('input[name="password"]').fill(password)
        await this.page.locator('form button:text("Sign in")').first().click()
        await expect(this.page.locator('.btn >> text="Sign out"')).toHaveCount(1, { timeout: 5000 })
    }
}
