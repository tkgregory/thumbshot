import { type Page } from '@playwright/test';

export class CreateAccountPage {
    public email: string
    public password: string

    constructor(public readonly page: Page) {
        this.email = 't.k.gregory+automatedtestuser@gmail.com'
        const password = process.env.THUMBSHOT_TEST_USER_PASSWORD
        if (!password) {
            throw new Error('Supply test user password using `THUMBSHOT_TEST_USER_PASSWORD` environment variable.')
        }
        this.password = password
    }

    async signIn() {
        await this.signInButton().click()
        await this.page.locator('input[name="username"]').fill(this.email)
        await this.page.locator('input[name="password"]').fill(this.password)
        await this.page.locator('form button:text("Sign in")').first().click()
    }

    signOutButton() {
        return this.page.locator('.btn >> text="Sign out"')
    }

    signInButton() {
        return this.page.locator('a >> text="Sign in"').first()
    }
}
