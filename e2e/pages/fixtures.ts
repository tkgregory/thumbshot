import { test as base } from '@playwright/test';
import { ThumbShotPage } from './thumbshot-page';

type MyFixtures = {
    thumbshotPage: ThumbShotPage;
};

export const test = base.extend<MyFixtures>({
    thumbshotPage: async ({ page }, use) => {
        await use(new ThumbShotPage(page));
    },
});

export { expect } from '@playwright/test';