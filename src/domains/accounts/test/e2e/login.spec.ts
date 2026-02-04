import { test, expect } from '@playwright/test';
import { LoginPage } from '@/domains/testing/test/e2e/page-objects/login-page';
import { getTestCredentials } from '@/domains/testing/test/e2e/fixtures/test-helpers';

/**
 * Authentication E2E Tests
 * Tests login functionality across different environments
 *
 * IMPORTANT: These tests do NOT use stored auth state
 * They test the login flow itself, so they must start unauthenticated
 */

test.describe('Authentication - Login', () => {
  let loginPage: LoginPage;

  // Clear storage state for login tests - we need to test login from scratch
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  /**
   * @smoke @critical
   * Most important test - validates basic login flow
   * Safe to run on all environments (including production)
   */
  test('@smoke @critical should successfully login with valid credentials', async ({
    page,
  }) => {
    // Perform login
    await loginPage.login();

    // Verify redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);

    // Verify user is authenticated (check for user greeting)
    const userGreeting = page.getByTestId('user-greeting');
    await expect(userGreeting).toBeVisible();
    await expect(userGreeting).toContainText('Hello');
  });

  /**
   * @smoke
   * Test invalid login - read-only operation, safe for all environments
   */
  test('@smoke should show error message with invalid credentials', async ({ page }) => {
    // Attempt login with invalid credentials
    await loginPage.loginWithError('invalid@example.com', 'wrongpassword');

    // Verify we're still on login page (not redirected to dashboard)
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });

    // Verify login form is still visible - use auto-retrying assertion
    await expect(page.getByTestId('login-form')).toBeVisible();
  });

  /**
   * @smoke
   * Test empty form submission
   */
  test('@smoke should require email and password fields', async ({ page }) => {
    // Try to submit without filling fields
    await page.getByTestId('login-submit-button').click();

    // Should still be on login page (form validation prevents submission)
    await expect(page).toHaveURL(/\//);
    await expect(page.getByTestId('login-form')).toBeVisible();
  });

  /**
   * @smoke
   * Verify all login form elements are visible
   */
  test('@smoke should display all login form elements', async ({ page }) => {
    // Verify form elements - use auto-retrying assertions
    await expect(page.getByTestId('login-email-input')).toBeVisible();
    await expect(page.getByTestId('login-password-input')).toBeVisible();
    await expect(page.getByTestId('login-submit-button')).toBeVisible();
  });

  /**
   * @critical
   * Test login with environment-specific credentials
   */
  test('@critical should login with environment-specific test user', async ({
    page,
  }) => {
    const credentials = getTestCredentials();

    // Login with credentials from environment
    await loginPage.login(credentials.email, credentials.password);

    // Verify successful login
    await expect(page).toHaveURL(/dashboard/);
  });
});
