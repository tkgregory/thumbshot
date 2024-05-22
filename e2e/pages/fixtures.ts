import { test as base } from '@playwright/test';
import { ThumbShotPage } from './thumbshot-page';
import { SettingsPage } from './settings-page';

type MyFixtures = {
    thumbshotPage: ThumbShotPage;
    settingsPage: SettingsPage;
};

export const test = base.extend<MyFixtures>({
    thumbshotPage: async ({ page }, use) => {
        await use(new ThumbShotPage(page));
    },
    settingsPage: async ({ page }, use) => {
        await use(new SettingsPage(page));
    },
});

export { expect } from '@playwright/test';