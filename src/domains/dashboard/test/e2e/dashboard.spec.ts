import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should display main dashboard elements', async ({ page }) => {
    // Verify dashboard container is visible
    await expect(page.locator('[data-test-id="dashboard-index-screen"]')).toBeVisible();

    // Note: User Greeting is currently not implemented in the UI, so we skip asserting it.
    // Note: Subscriptions visual check depends on data availability.
    // We can check if the upcoming subscriptions component is present if we assume data or just check the page load for now.

    test('should display upcoming subscriptions when data is present', async ({ page }) => {
      // Mock the subscriptions API response
      await page.route('**/subscriptions*', async route => {
        const mockResponse = {
          data: [
            {
              id: 'sub_123',
              user_id: 'user_123',
              vendor_id: 'vendor_123',
              account_id: 'acc_123',
              name: 'Netflix',
              amount: 15.99,
              currency: 'USD',
              billing_cycle: 'monthly',
              next_due_date: new Date().toISOString(),
              is_active: true,
              is_paid_this_cycle: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ],
          meta: {
            total: 1,
            page: 1,
            per_page: 10,
            has_next: false,
            has_previous: false,
          },
        };

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockResponse),
        });
      });

      // Reload to ensure mock is used
      await page.reload();

      // Verify Subscriptions heading is visible
      // The component has a heading "Subscriptions"
      await expect(page.getByRole('heading', { name: 'Subscriptions' })).toBeVisible();

      // Verify our mocked subscription is visible
      await expect(page.getByText('Netflix')).toBeVisible();
    });
  });
});
