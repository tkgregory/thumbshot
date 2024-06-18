import { test, expect } from './pages/fixtures';

test.beforeEach(async ({ page }) => {
    await page.goto('/')
});

test('Sign in with existing user', async ({ createAccountPage }) => {
    await expect(createAccountPage.signOutButton()).toHaveCount(1)
});

test('Sign out with existing user', async ({ createAccountPage }) => {
    await createAccountPage.signOutButton().click()
    await expect(createAccountPage.signInButton()).toHaveCount(1)
});