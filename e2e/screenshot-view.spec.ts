import { test, expect } from './pages/fixtures';

test.beforeEach(async ({ page, createAccountPage, boardsPage }) => {
  test.slow();
  await page.goto('/')
  await createAccountPage.signIn()
  await boardsPage.useNewBoard()

  await page.locator('div[data-tip="Randomize"]').click()
  await page.locator('div[data-tip="Randomize"]').click()
  await page.locator('div[data-tip="Randomize"]').click()
});

test('Shows numbers', async ({ page, boardsPage }) => {
  await boardsPage.gotoScreenshotView()

  await expect(page.locator('youtube-preview').nth(0)).toContainText('Option 1')
  await expect(page.locator('youtube-preview').nth(1)).toContainText('Option 2')
  await expect(page.locator('youtube-preview').nth(2)).toContainText('Option 3')
});

test('Doesn\'t show numbers', async ({ page, settingsPage, browserName, boardsPage }) => {
  test.skip(browserName === 'webkit', 'Reported flakiness');

  await settingsPage.open()
  await settingsPage.numberingSetting().uncheck()

  await boardsPage.gotoScreenshotView()

  expect(page.locator('youtube-preview').nth(0)).not.toContainText('Option 1')
  expect(page.locator('youtube-preview').nth(1)).not.toContainText('Option 2')
  expect(page.locator('youtube-preview').nth(2)).not.toContainText('Option 3')
});

test('Doesn\'t show numbers for single screenshot', async ({ page, browserName, thumbshotPage, boardsPage }) => {
  test.skip(browserName === 'webkit', 'Reported flakiness');

  await thumbshotPage.getResetButton().click()
  await page.locator('div[data-tip="Randomize"]').click()

  await boardsPage.gotoScreenshotView()

  expect(page.locator('youtube-preview').nth(0)).not.toContainText('Option 1')
});