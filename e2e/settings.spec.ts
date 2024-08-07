import { test, expect } from './pages/fixtures';

test.beforeEach(async ({ page, boardsPage }) => {
    await page.goto('/')
    await boardsPage.useNewBoard()
});

test('Numbering setting defaults to false', async ({ settingsPage }) => {
    await settingsPage.open()
    await expect(settingsPage.numberingSetting()).not.toBeChecked
});

test('Saves numbering setting true', async ({ page, settingsPage, browserName }) => {
    test.skip(browserName === 'webkit', 'Reported flakiness');
    await settingsPage.open()
    await settingsPage.numberingSetting().check()
    await page.reload();
    await settingsPage.open()
    await expect(settingsPage.numberingSetting()).toBeChecked
});

test('Saves numbering setting false', async ({ page, settingsPage, browserName }) => {
    test.skip(browserName === 'webkit', 'Reported flakiness');
    await settingsPage.open()
    await settingsPage.numberingSetting().check()
    await settingsPage.numberingSetting().uncheck()
    await page.reload();
    await settingsPage.open()
    await expect(settingsPage.numberingSetting()).not.toBeChecked
});

test('Default channel name defaults to empty', async ({ settingsPage }) => {
    await settingsPage.open()
    await expect(settingsPage.defaultChannelName()).toBeEmpty()
});

test('Saves default channel name', async ({ page, settingsPage }) => {
    await settingsPage.open()
    await settingsPage.defaultChannelName().fill("Mr. Beast")

    await page.reload();
    await settingsPage.open()
    await expect(settingsPage.defaultChannelName()).toHaveValue("Mr. Beast")
});
