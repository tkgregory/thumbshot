import { test, expect } from './pages/fixtures';

test.beforeEach(async ({ page, createAccountPage, boardsPage }) => {
    test.slow();
    await page.goto('/')
    await createAccountPage.signInAsExistingUser()
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