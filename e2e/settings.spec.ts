import { test, expect } from './pages/fixtures';

test.beforeEach(async ({page}) => {
    await page.goto('/')
    await page.locator('button:has-text("Don\'t show again")').click()
  });

test('Numbering setting defaults to false', async ({page, settingsPage}) => {
    await settingsPage.open()
    await expect(settingsPage.numberingSetting()).not.toBeChecked
});

test('Saves numbering setting true', async ({page, settingsPage, browserName}) => {
    test.skip(browserName === 'webkit', 'Reported flakiness');
    await settingsPage.open()
    await settingsPage.numberingSetting().check()
    await page.reload();
    await settingsPage.open()
    await expect(settingsPage.numberingSetting()).toBeChecked
});

test('Saves numbering setting false', async ({page, settingsPage, browserName}) => {
    test.skip(browserName === 'webkit', 'Reported flakiness');
    await settingsPage.open()
    await settingsPage.numberingSetting().check()
    await settingsPage.numberingSetting().uncheck()
    await page.reload();
    await settingsPage.open()
    await expect(settingsPage.numberingSetting()).not.toBeChecked
});