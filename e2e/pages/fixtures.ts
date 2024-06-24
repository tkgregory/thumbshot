import { test as base, expect } from '@playwright/test';
import { ThumbShotPage } from './thumbshot-page';
import { SettingsPage } from './settings-page';
import { CreateAccountPage } from './create-account-page';
import { BoardsPage } from './boards-page';
import path from 'path';
import fs from 'fs';

type MyFixtures = {
    thumbshotPage: ThumbShotPage;
    settingsPage: SettingsPage;
    createAccountPage: CreateAccountPage;
    boardsPage: BoardsPage;
};

export const test = base.extend<MyFixtures, { workerStorageState: string }>({
    thumbshotPage: async ({ page }, use) => {
        await use(new ThumbShotPage(page));
    },
    settingsPage: async ({ page }, use) => {
        await use(new SettingsPage(page));
    },
    createAccountPage: async ({ page }, use) => {
        await use(new CreateAccountPage(page));
    },
    boardsPage: async ({ page }, use) => {
        await use(new BoardsPage(page));
    },
    storageState: ({ workerStorageState }, use) => use(workerStorageState),

    workerStorageState: [async ({ browser }, use) => {
        const id = test.info().parallelIndex;
        const fileName = path.resolve(test.info().project.outputDir, `.auth/${id}.json`);

        if (fs.existsSync(fileName)) {
            console.log('Using saved login state')
            await use(fileName);
            return;
        }
        console.log('Logging in')
        const page = await browser.newPage({ storageState: undefined });

        await page.goto('http://localhost:5173/')
        await page.locator('a >> text="Sign in"').first().click()
        await page.locator('input[name="username"]').fill('t.k.gregory+proautomatedtestuser@gmail.com')

        const password = process.env.THUMBSHOT_PRO_TEST_USER_PASSWORD
        if (!password) {
            throw new Error('Supply test user password using `THUMBSHOT_TEST_USER_PASSWORD` environment variable.')
        }
        await page.locator('input[name="password"]').fill(password)
        await page.locator('form button:text("Sign in")').first().click()
        await expect(page.locator('.btn >> text="Sign out"')).toHaveCount(1, { timeout: 5000 })

        await page.context().storageState({ path: fileName });
        await page.close();
        await use(fileName);
    }, { scope: 'worker' }]
});

export { expect } from '@playwright/test';