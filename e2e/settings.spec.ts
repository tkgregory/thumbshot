import { test, expect } from './pages/fixtures';

test.beforeEach(async ({page}) => {
    await page.goto('/')
    await page.locator('button:has-text("Don\'t show again")').click()
  });

test('Numbering setting defaults to false', async ({page, settingsPage}) => {
    await settingsPage.open()
    await expect(settingsPage.numberingSetting()).not.toBeChecked
});

test('Saves numbering setting true', async ({page, settingsPage}) => {
    await settingsPage.open()
    await settingsPage.numberingSetting().click()
    await page.reload();
    await settingsPage.open()
    await expect(settingsPage.numberingSetting()).toBeChecked
});

test('Saves numbering setting false', async ({page, settingsPage}) => {
    await settingsPage.open()
    await settingsPage.numberingSetting().click()
    await settingsPage.numberingSetting().click()
    await page.reload();
    await settingsPage.open()
    await expect(settingsPage.numberingSetting()).not.toBeChecked
});