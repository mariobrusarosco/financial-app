import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/login-page';

const authFile = 'playwright/.auth/user.json';

/**
 * Global authentication setup
 * This runs once before all tests and saves the authenticated state
 * Other tests can reuse this state instead of logging in each time
 */
setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Navigate to login page
  await loginPage.goto();

  // Perform login
  await loginPage.login();

  // Verify successful login - should be on dashboard
  await expect(page).toHaveURL(/dashboard/);

  // Save authenticated state
  await page.context().storageState({ path: authFile });
});
