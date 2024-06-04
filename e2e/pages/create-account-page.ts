import { type Page } from '@playwright/test';
import { exec } from 'child_process';
import crypto from 'crypto'

export class CreateAccountPage {
    public email: string
    public password: string

    constructor(public readonly page: Page) {
        this.newPassword();
    }

    private newPassword() {
        this.password = crypto.randomBytes(5).toString('hex');
    }

    async useExistingUser() {
        this.email = 't.k.gregory+automatedtestuser@gmail.com'
        await this.adminSetPassword()
    }

    async changePassword() {
        this.newPassword()
        await this.page.locator('input[name="password"]').fill(this.password)
        await this.page.locator('input[name="confirm_password"]').fill(this.password)
        await this.page.locator('button:text("Change Password")').first().click()
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

    async adminSetPassword() {
        const userPoolName = process.env.ENVIRONMENT == 'prod' ? 'thumbshot-prod' : 'thumbshot-dev'
        const userPoolIdCommand = `aws cognito-idp list-user-pools --query "UserPools[?starts_with(Name, '${userPoolName}')].Id" --max-results 10 --output text --region us-east-1`
        const userPoolId = await new Promise<String>((resolve, reject) => {
            exec(userPoolIdCommand, (err, stdout) => {
                if (err) {
                    console.log(err)
                    reject()
                } else {
                    resolve(stdout.replace(/^\s+|\s+$/g, ''))
                }
            });
        });

        await new Promise<void>((resolve, reject) => {
            exec(`aws cognito-idp admin-set-user-password --user-pool-id ${userPoolId} --username ${this.email} --password ${this.password} --region us-east-1`, (err) => {
                if (err) {
                    console.log(err)
                    reject()
                } else {
                    resolve()
                }
            });
        });
    }
}
