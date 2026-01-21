import type { Page } from '@playwright/test';

/**
 * Test Helpers - Shared E2E utilities
 */

/**
 * Get environment-specific test credentials
 */
export function getTestCredentials() {
  return {
    email: process.env.E2E_TEST_EMAIL || 'test@local.com',
    password: process.env.E2E_TEST_PASSWORD || 'TestPassword123!',
  };
}

/**
 * Get base URL from environment
 */
export function getBaseURL() {
  return process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';
}

/**
 * Check if running in local environment
 */
export function isLocalEnvironment() {
  return getBaseURL().includes('localhost');
}

/**
 * Check if running in production environment
 */
export function isProductionEnvironment() {
  return process.env.E2E_SMOKE_ONLY === 'true';
}

/**
 * Wait for navigation and ensure page is loaded
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
}

/**
 * Fill a form field by data-testid
 */
export async function fillByTestId(page: Page, testId: string, value: string) {
  await page.getByTestId(testId).fill(value);
}

/**
 * Click a button by data-testid
 */
export async function clickByTestId(page: Page, testId: string) {
  await page.getByTestId(testId).click();
}

/**
 * Wait for element to be visible by data-testid
 */
export async function waitForTestId(page: Page, testId: string) {
  await page.getByTestId(testId).waitFor({ state: 'visible' });
}

/**
 * Generate unique test data (for local testing)
 */
export function generateTestData() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);

  return {
    uniqueId: `${timestamp}-${random}`,
    email: `test-${timestamp}@local.com`,
    accountName: `Test Account ${timestamp}`,
    transactionDescription: `Test Transaction ${timestamp}`,
  };
}

/**
 * Take a screenshot with descriptive name
 */
export async function takeScreenshot(
  page: Page,
  name: string,
  options?: { fullPage?: boolean }
) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({
    path: `test-results/screenshots/${name}-${timestamp}.png`,
    fullPage: options?.fullPage ?? false,
  });
}

/**
 * Wait for API response by URL pattern
 */
export async function waitForAPIResponse(page: Page, urlPattern: string | RegExp) {
  return page.waitForResponse((response) => {
    const url = response.url();
    if (typeof urlPattern === 'string') {
      return url.includes(urlPattern);
    }
    return urlPattern.test(url);
  });
}

/**
 * Clear all inputs on the page (useful for form testing)
 */
export async function clearAllInputs(page: Page) {
  const inputs = await page.locator('input[type="text"], input[type="email"], textarea').all();
  for (const input of inputs) {
    await input.clear();
  }
}
