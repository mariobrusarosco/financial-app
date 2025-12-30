// e2e/utils/auth-helpers.ts
import { Page, expect } from '@playwright/test';

const DEMO_CREDENTIALS = {
  email: 'user@example.com',
  password: 'password123',
};

/**
 * Login with demo credentials
 */
export const login = async (page: Page, rememberMe = true) => {
  await page.goto('/login');
  
  // Wait for login form to be visible
  await expect(page.getByRole('heading', { name: 'Better Call Buffet' })).toBeVisible();
  
  // Fill credentials
  await page.getByPlaceholder('user@example.com').fill(DEMO_CREDENTIALS.email);
  await page.getByPlaceholder('Enter your password').fill(DEMO_CREDENTIALS.password);
  
  if (rememberMe) {
    await page.getByLabel(/Remember me/i).check();
  }
  
  // Submit
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Wait for redirect to dashboard
  await expect(page).toHaveURL(/.*dashboard/);
  
  // Wait for welcome toast
  await expect(page.getByText(/Welcome back/i)).toBeVisible();
};

/**
 * Login with invalid credentials (for error testing)
 */
export const loginWithInvalidCredentials = async (page: Page) => {
  await page.goto('/login');
  
  await expect(page.getByRole('heading', { name: 'Better Call Buffet' })).toBeVisible();
  
  await page.getByPlaceholder('user@example.com').fill('wrong@example.com');
  await page.getByPlaceholder('Enter your password').fill('wrongpassword');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Should stay on login page or show error
  // Note: Error handling may vary - adjust based on actual implementation
};

/**
 * Check if user is authenticated (on dashboard or authenticated page)
 */
export const isAuthenticated = async (page: Page): Promise<boolean> => {
  const url = page.url();
  return !url.includes('/login') && !url.includes('/signup');
};

/**
 * Logout (if logout functionality exists)
 */
export const logout = async (page: Page) => {
  // Implementation depends on logout UI location
  // This is a placeholder
  const logoutButton = page.getByRole('button', { name: /logout|sign out/i });
  if (await logoutButton.isVisible().catch(() => false)) {
    await logoutButton.click();
    await expect(page).toHaveURL(/.*login/);
  }
};

