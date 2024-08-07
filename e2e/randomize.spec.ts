import { test, expect } from './pages/fixtures';

test.beforeEach(async ({ page, boardsPage }) => {
    await page.goto('/')
    await boardsPage.useNewBoard()
});

test('Randomize shows default YouTube preview', async ({ page, thumbshotPage }) => {
    await thumbshotPage.clickRandom()
    await expect(page.locator('div >> text="Some Channel Name"')).toHaveCount(1)
});

test('Can change randomized thumbnail', async ({ page, thumbshotPage }) => {
    await thumbshotPage.clickRandom()

    await page.locator('input[name="thumbnail"]').first().setInputFiles(['./e2e/images/correct-dimensions.png']);
    await expect(page.locator('div[role="alert"]')).toHaveCount(0)
});

test('Can update randomized title', async ({ page, thumbshotPage }) => {
    await thumbshotPage.clickRandom()

    await page.locator('span[class="cursor-pointer"]').first().click()
    await page.locator('input[name="title"]').fill('Updated title')
    await page.locator('input[name="title"]').blur()
    await expect(page.locator('span >> text="Updated title"')).toHaveCount(1)
});

test('Can update randomized channel name', async ({ page, thumbshotPage }) => {
    await thumbshotPage.clickRandom()

    await page.locator('span[class="cursor-pointer"]').nth(1).click()
    await page.locator('input[name="channelName"]').fill('Updated channel name')
    await page.locator('input[name="channelName"]').blur()
    await expect(page.locator('span >> text="Updated channel name"')).toHaveCount(1)
});