// e2e/utils/page-helpers.ts
import { Page, expect } from '@playwright/test';

/**
 * Wait for the page to finish loading
 * Useful for pages that have loading states
 */
export const waitForPageLoad = async (page: Page) => {
  // Wait for the main content to be visible (not "Loading...")
  await page.waitForSelector('text=/Loading/i', { state: 'hidden', timeout: 10000 }).catch(() => {
    // If no loading state, that's fine
  });
};

/**
 * Wait for toast notification to appear
 */
export const waitForToast = async (page: Page, text: string | RegExp, timeout = 5000) => {
  const toast = page.getByText(text).first();
  await expect(toast).toBeVisible({ timeout });
  return toast;
};

/**
 * Navigate to a route and wait for it to load
 */
export const navigateAndWait = async (page: Page, route: string) => {
  await page.goto(route);
  await waitForPageLoad(page);
};

/**
 * Get the current date range from URL or page
 */
export const getDateRange = async (page: Page) => {
  const url = page.url();
  const fromMatch = url.match(/from=(\d{4}-\d{2}-\d{2})/);
  const toMatch = url.match(/to=(\d{4}-\d{2}-\d{2})/);
  
  return {
    from: fromMatch ? fromMatch[1] : null,
    to: toMatch ? toMatch[1] : null,
  };
};

/**
 * Wait for drawer/modal to open
 */
export const waitForDrawer = async (page: Page, timeout = 5000) => {
  // Wait for drawer to appear (common drawer selectors)
  await page.waitForSelector('[role="dialog"], [data-state="open"]', { timeout });
};

/**
 * Close drawer/modal
 */
export const closeDrawer = async (page: Page) => {
  // Try common close patterns
  await page.keyboard.press('Escape').catch(() => {});
  // Or click outside/close button if needed
};

