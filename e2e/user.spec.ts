import { test, expect } from './pages/fixtures';

test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.locator('button:has-text("Don\'t show again")').click()
});

test('Sign in with existing user', async ({ createAccountPage }) => {
    await createAccountPage.useExistingUser()
    await createAccountPage.signIn()
    await createAccountPage.changePassword()

    await expect(createAccountPage.signOutButton()).toHaveCount(1)
});

test('Sign out with existing user', async ({ createAccountPage }) => {
    await createAccountPage.useExistingUser()
    await createAccountPage.signIn()
    await createAccountPage.changePassword()

    await createAccountPage.signOutButton().click()
    await expect(createAccountPage.signInButton()).toHaveCount(1)
});