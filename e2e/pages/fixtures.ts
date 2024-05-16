import { test as base } from '@playwright/test';
import { ThumbShot } from './thumbshot-page';

type MyFixtures = {
    thumbshot: ThumbShot;
};

export const test = base.extend<MyFixtures>({
    thumbshot: async ({ page }, use) => {
        await use(new ThumbShot(page));
    },
});

export { expect } from '@playwright/test';