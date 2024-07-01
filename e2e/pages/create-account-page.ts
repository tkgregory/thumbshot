import { type Page, expect } from '@playwright/test';
import crypto from 'crypto'
import { CognitoIdentityProviderClient, AdminConfirmSignUpCommand, ListUsersCommand, AdminDeleteUserCommand, ListUsersCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import { exec } from 'child_process';

export class CreateAccountPage {
    public readonly randomEmail: string
    public readonly randomPassword: string

    constructor(public readonly page: Page) {
        this.randomEmail = this.createEmail()
        this.randomPassword = crypto.randomBytes(5).toString('hex')
    }

    signOutButton() {
        return this.page.locator('.btn >> text="Sign out"')
    }

    signInButton() {
        return this.page.locator('a >> text="Sign in"').first()
    }

    async signInAsFreeUser() {
        const password = process.env.THUMBSHOT_TEST_USER_PASSWORD
        if (!password) {
            throw new Error('Supply test user password using `THUMBSHOT_PRO_TEST_USER_PASSWORD` environment variable.')
        }

        await this.signOutButton().click()
        await this.signIn('t.k.gregory+automatedtestuser@gmail.com', password)
    }

    async signIn(email: string, password: string) {
        await expect(this.page.locator('.btn >> text="Sign in"')).toHaveCount(1, { timeout: 10000 })

        await this.signInButton().click()
        await this.page.locator('input[name="username"]').fill(email)

        await this.page.locator('input[name="password"]').fill(password)
        await this.page.locator('form button:text("Sign in")').first().click()
        await expect(this.page.locator('.btn >> text="Sign out"')).toHaveCount(1, { timeout: 5000 })
    }

    async useNewAccount() {
        await this.signOutButton().click()

        await this.page.locator('.btn >> text="Sign in"').click({ timeout: 10000 })
        await this.page.locator('button:has-text("Create Account")').click()

        await this.page.locator('input[name="email"]').fill(this.randomEmail)
        await this.page.locator('input[name="password"]').fill(this.randomPassword)
        await this.page.locator('input[name="confirm_password"]').fill(this.randomPassword)
        await this.page.locator('form button:text("Create Account")').click()

        await expect(this.page.locator('h3:text("We Emailed You")')).toHaveCount(1, { timeout: 5000 })

        await this.confirmAccount(this.randomEmail)
        await this.page.goto('/')
        await this.signIn(this.randomEmail, this.randomPassword)
    }

    private createEmail(): string {
        const emailHash = crypto.randomBytes(3).toString('hex')
        return `t.k.gregory+playwright${emailHash}@gmail.com`
    }

    private async confirmAccount(email: string) {
        const userPoolId = await this.userPoolId();
        const username = await this.userForEmail(email);

        const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });

        const input = {
            UserPoolId: userPoolId,
            Username: username,
        };
        const command = new AdminConfirmSignUpCommand(input);
        await client.send(command);
    }

    private async userForEmail(email: string) {
        const userPoolId = await this.userPoolId();
        const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });

        const listUsersInput = {
            UserPoolId: userPoolId,
            Filter: `"email"="${email}"`,
        };

        let listUsersResponse: ListUsersCommandOutput | undefined
        while (listUsersResponse === undefined || listUsersResponse.Users === undefined || listUsersResponse.Users.length === 0) {
            listUsersResponse = await client.send(new ListUsersCommand(listUsersInput));
            await new Promise(f => setTimeout(f, 1000));
        }

        return listUsersResponse.Users[0].Username
    }

    async deleteAccount() {
        const client = new CognitoIdentityProviderClient({ region: 'us-east-1' });

        const userPoolId = await this.userPoolId();
        const username = await this.userForEmail(this.randomEmail);

        const input = {
            UserPoolId: userPoolId,
            Username: username,
        };
        const command = new AdminDeleteUserCommand(input);
        await client.send(command);
    }

    private async userPoolId() {
        const userPoolIdCommand = `aws cognito-idp list-user-pools --query "UserPools[?starts_with(Name, 'thumbshot-dev')].Id" --max-results 10 --output text --region us-east-1`
        return await new Promise<string>((resolve, reject) => {
            exec(userPoolIdCommand, (err, stdout) => {
                if (err) {
                    console.log(err);
                    reject();
                } else {
                    resolve(stdout.replace(/^\s+|\s+$/g, ''));
                }
            });
        });
    }
}
