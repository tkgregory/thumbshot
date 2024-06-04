import { test as base } from '@playwright/test';
import { ThumbShotPage } from './thumbshot-page';
import { SettingsPage } from './settings-page';
import { CreateAccountPage } from './create-account-page';

type MyFixtures = {
    thumbshotPage: ThumbShotPage;
    settingsPage: SettingsPage;
    createAccountPage: CreateAccountPage;
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
});

export { expect } from '@playwright/test';