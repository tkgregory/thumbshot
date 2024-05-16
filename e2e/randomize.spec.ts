import { expect, test } from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('/')
    await page.locator('button:has-text("Compare My Thumbnails")').click()
});

test('Randomize shows default YouTube preview', async ({page}) => {
    await page.locator('div[data-tip="Randomize"]').click()
    await expect(page.locator('div >> text="Some Channel Name"')).toHaveCount(1)
});

test('Can change randomized thumbnail', async ({page}) => {
    await page.locator('div[data-tip="Randomize"]').click()

    await page.locator('input[name="thumbnail"]').first().setInputFiles(['./e2e/images/oversized.png']);
    await expect(page.locator('div[role="alert"]')).toHaveCount(0)
});

test('Can update randomized title', async ({page}) => {
    await page.locator('div[data-tip="Randomize"]').click()

    await page.locator('span[class="cursor-pointer"]').first().click()
    await page.locator('input[name="title"]').fill('Updated title')
    await page.locator('input[name="title"]').blur()
    await expect(page.locator('span >> text="Updated title"')).toHaveCount(1)
});

test('Can update randomized channel name', async ({page}) => {
    await page.locator('div[data-tip="Randomize"]').click()

    await page.locator('span[class="cursor-pointer"]').nth(1).click()
    await page.locator('input[name="channelName"]').fill('Updated channel name')
    await page.locator('input[name="channelName"]').blur()
    await expect(page.locator('span >> text="Updated channel name"')).toHaveCount(1)
});