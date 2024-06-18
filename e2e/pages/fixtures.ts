import { test as base } from '@playwright/test';
import { ThumbShotPage } from './thumbshot-page';
import { SettingsPage } from './settings-page';
import { CreateAccountPage } from './create-account-page';
import { BoardsPage } from './boards-page';

type MyFixtures = {
    thumbshotPage: ThumbShotPage;
    settingsPage: SettingsPage;
    createAccountPage: CreateAccountPage;
    boardsPage: BoardsPage;
};

export const test = base.extend<MyFixtures>({
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
});

export { expect } from '@playwright/test';