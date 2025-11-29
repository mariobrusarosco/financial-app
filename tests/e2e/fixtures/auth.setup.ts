import { test as base, type Page } from '@playwright/test'
import { LoginPage } from '../page-objects/auth/login-page'

/**
 * Authentication Fixtures
 *
 * Provides reusable authentication helpers for E2E tests:
 * - authenticatedPage: Fixture that provides a page already logged in
 * - loginAs: Helper function to login with specific credentials
 *
 * Usage:
 * ```typescript
 * // Use pre-authenticated page
 * test('View dashboard', async ({ authenticatedPage }) => {
 *   // Already logged in, start testing from dashboard
 *   await expect(authenticatedPage).toHaveURL(/\/dashboard/)
 * })
 *
 * // Login with specific user
 * test('Login as specific user', async ({ page }) => {
 *   await loginAsUser(page, 'user@example.com', 'password123')
 * })
 * ```
 */

// Test credentials from environment variables
const TEST_EMAIL = process.env.E2E_TEST_EMAIL || 'test@local.com'
const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD || 'TestPassword123!'

/**
 * Helper function to perform login
 * @param page - Playwright page object
 * @param email - User email
 * @param password - User password
 * @param rememberMe - Whether to check "Remember me"
 */
export async function loginAsUser(
  page: Page,
  email: string,
  password: string,
  rememberMe = false
): Promise<void> {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.login(email, password, rememberMe)
  await loginPage.waitForLoginResult()
  await loginPage.expectLoginSuccess()
}

/**
 * Extended test with authentication fixtures
 */
type AuthFixtures = {
  /**
   * Page that is already authenticated with test user credentials
   * Automatically logs in before each test
   */
  authenticatedPage: Page
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Setup: Login before test
    await loginAsUser(page, TEST_EMAIL, TEST_PASSWORD)

    // Provide authenticated page to test
    await use(page)

    // Teardown: Logout after test (optional - could also clear cookies)
    // For now, each test gets a fresh browser context so no explicit logout needed
  },
})

export { expect } from '@playwright/test'

/**
 * Get test credentials from environment
 */
export function getTestCredentials() {
  return {
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  }
}

/**
 * Check if user is logged in by checking for auth-related cookies or localStorage
 * @param page - Playwright page object
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  // Check if auth token exists in localStorage
  const accessToken = await page.evaluate(() => {
    return localStorage.getItem('accessToken')
  })

  return !!accessToken
}

/**
 * Logout user by clearing auth state
 * @param page - Playwright page object
 */
export async function logout(page: Page): Promise<void> {
  // Clear localStorage and sessionStorage
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  // Navigate to login page
  await page.goto('/login')
}
