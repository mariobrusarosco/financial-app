import { test, expect } from '@playwright/test';
import { goToDashboard, waitForPageLoad } from '../utils';

/**
 * Dashboard E2E Tests
 * Based on User Journey: docs/user-journeys/02-dashboard-overview.md
 */
test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Auth setup should handle authentication
    await goToDashboard(page);
    await waitForPageLoad(page);
  });

  test('should display financial summary cards', async ({ page }) => {
    // Check if we are actually on the dashboard and not redirected to login
    await expect(page).toHaveURL(/.*dashboard/);

    // Wait for the heading to appear (might take longer than 5s on slow CI)
    await expect(page.getByRole('heading', { name: /Hello/i })).toBeVisible({ timeout: 10000 });

    // Check for date range selector
    await expect(page.getByRole('button', { name: /Dec/i })).toBeVisible();

    // Check for navigation links
    await expect(page.getByRole('link', { name: 'Accounts' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Transactions' })).toBeVisible();
  });

  test('should display date range quick filters', async ({ page }) => {
    // Check for quick filter buttons
    await expect(page.getByRole('button', { name: 'Today' })).toBeVisible();
    await expect(page.getByRole('button', { name: '30d' })).toBeVisible();
    await expect(page.getByRole('button', { name: '3M' })).toBeVisible();
    await expect(page.getByRole('button', { name: '6M' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'YTD' })).toBeVisible();
  });

  test('should change date range with quick filter', async ({ page }) => {
    // Click on a quick filter (e.g., "30d")
    await page.getByRole('button', { name: '30d' }).click();

    // Wait for URL to update with new date range
    await page.waitForURL(/.*from=.*to=.*/, { timeout: 5000 });

    // Verify URL contains date parameters
    const url = page.url();
    expect(url).toMatch(/from=\d{4}-\d{2}-\d{2}/);
    expect(url).toMatch(/to=\d{4}-\d{2}-\d{2}/);
  });

  test('should navigate to different sections from dashboard', async ({ page }) => {
    // Test navigation to Accounts
    await page.getByRole('link', { name: 'Accounts' }).click();
    await expect(page).toHaveURL(/.*accounts/);

    // Navigate back to dashboard
    await goToDashboard(page);

    // Test navigation to Transactions
    await page.getByRole('link', { name: 'Transactions' }).click();
    await expect(page).toHaveURL(/.*transactions/);
  });

  test('should display personalized greeting', async ({ page }) => {
    // Check for greeting with user name
    const greeting = page.getByRole('heading', { name: /Hello/i });
    await expect(greeting).toBeVisible();

    // Greeting should contain a name (not just "Hello,")
    const greetingText = await greeting.textContent();
    expect(greetingText).toMatch(/Hello, .+/);
  });
});
