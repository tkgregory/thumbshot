import { test, expect } from './pages/fixtures';

test.beforeEach(async ({page}) => {
    await page.goto('/')
    await page.locator('button:has-text("Compare My Thumbnails")').click()

    await page.locator('div[data-tip="Randomize"]').click()
    await page.locator('div[data-tip="Randomize"]').click()
    await page.locator('div[data-tip="Randomize"]').click()
  });

test('Shows numbers', async ({page}) => {
  await page.goto('/#/screenshot')

  expect(page.locator('youtube-preview').nth(0)).toContainText('Option 1')
  expect(page.locator('youtube-preview').nth(1)).toContainText('Option 2')
  expect(page.locator('youtube-preview').nth(2)).toContainText('Option 3')
});

test('Doesn\'t show numbers', async ({page, settingsPage, browserName}) => {
  test.skip(browserName === 'webkit', 'Reported flakiness');

  await settingsPage.open()
  await settingsPage.numberingSetting().uncheck()

  await page.goto('/#/screenshot')

  expect(page.locator('youtube-preview').nth(0)).not.toContainText('Option 1')
  expect(page.locator('youtube-preview').nth(1)).not.toContainText('Option 2')
  expect(page.locator('youtube-preview').nth(2)).not.toContainText('Option 3')
});

test('Doesn\'t show numbers for single screenshot', async ({page, browserName, thumbshotPage}) => {
  test.skip(browserName === 'webkit', 'Reported flakiness');

  await thumbshotPage.getResetButton().click()
  await page.locator('div[data-tip="Randomize"]').click()

  await page.goto('/#/screenshot')

  expect(page.locator('youtube-preview').nth(0)).not.toContainText('Option 1')
});