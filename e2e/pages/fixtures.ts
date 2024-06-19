import { Page, test as base } from '@playwright/test';
import { ThumbShotPage } from './thumbshot-page';
import { SettingsPage } from './settings-page';
import { CreateAccountPage } from './create-account-page';
import { BoardsPage } from './boards-page';
import { login } from '../utils/user';
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
            await use(fileName);
            return;
        }

        const page = await browser.newPage({ storageState: undefined });

        if (id === 0) {
            await getCredentialsAndLogin('t.k.gregory+proautomatedtestuser@gmail.com', 'THUMBSHOT_PRO_TEST_USER_PASSWORD', page)
        } else if (id === 1) {
            await getCredentialsAndLogin('t.k.gregory+proautomatedtestuser2@gmail.com', 'THUMBSHOT_PRO_TEST_USER_PASSWORD_2', page)
        } else {
            throw Error(`Unknown test worker index ${id}`)
        }

        await page.context().storageState({ path: fileName });
        await page.close();
        await use(fileName);
    }, { scope: 'worker' }]
});

async function getCredentialsAndLogin(email: string, passwordEnvVariableName: string, page: Page) {
    const password = process.env[passwordEnvVariableName]
    if (!password) {
        throw new Error(`Supply test user password using '${passwordEnvVariableName}' environment variable.`)
    }
    await login(email, password, page)
}

export { expect } from '@playwright/test';