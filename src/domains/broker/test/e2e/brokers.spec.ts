import { test, expect } from '@playwright/test';
import { BrokersPage } from '@/domains/testing/test/e2e/page-objects/brokers-page';

/**
 * Brokers E2E Tests
 * Tests broker management functionality
 */

test.describe('Brokers - List View', () => {
  let brokersPage: BrokersPage;

  test.beforeEach(async ({ page }) => {
    // Already authenticated via global setup - just navigate to brokers page
    brokersPage = new BrokersPage(page);
    await brokersPage.goto();

    // Wait for loading indicator to disappear (Priority 1 - page has loader)
    await expect(page.getByTestId('brokers-loading')).toBeHidden({ timeout: 10000 });
  });

  /**
   * @smoke @critical
   * Verify brokers page loads and displays brokers
   */
  test('@smoke @critical should display brokers list', async ({ page }) => {
    // Should show either brokers list or empty state (already waited in beforeEach)
    const hasBrokers = await brokersPage.isBrokersListVisible();
    const isEmpty = await brokersPage.isBrokersEmpty();

    expect(hasBrokers || isEmpty).toBe(true);
  });

  /**
   * @smoke
   * Verify add button is visible when brokers loaded
   */
  test('@smoke should show add broker button', async ({ page }) => {
    // Add button should be visible (unless error state)
    const isError = await brokersPage.isBrokersError();
    if (!isError) {
      await expect(page.getByTestId('brokers-add-button')).toBeVisible();
    }
  });

  /**
   * @smoke
   * Verify broker cards show required information
   */
  test('@smoke should display broker card details', async ({ page }) => {
    // Skip if empty
    if (await brokersPage.isBrokersEmpty()) {
      test.skip();
    }

    // Wait for at least one broker card to appear
    await expect(page.getByTestId('broker-card').first()).toBeVisible({ timeout: 5000 });

    // Get first broker card
    const firstCard = page.getByTestId('broker-card').first();

    // Verify card has name and description
    await expect(firstCard.getByTestId('broker-card-name')).toBeVisible();
    await expect(firstCard.getByTestId('broker-card-description')).toBeVisible();
  });

  /**
   * @smoke
   * Verify brokers are displayed in grid layout
   */
  test('@smoke should display brokers in grid layout', async ({ page }) => {
    // Skip if empty
    if (await brokersPage.isBrokersEmpty()) {
      test.skip();
    }

    // Wait for brokers list to be visible (already waited in beforeEach)
    await expect(page.getByTestId('brokers-list')).toBeVisible({ timeout: 5000 });

    // Check if we have broker cards
    const cards = await brokersPage.getBrokerCards();
    expect(cards.length).toBeGreaterThan(0);
  });
});

test.describe('Brokers - Actions', () => {
  let brokersPage: BrokersPage;

  test.beforeEach(async ({ page }) => {
    // Already authenticated via global setup - just navigate to brokers page
    brokersPage = new BrokersPage(page);
    await brokersPage.goto();

    // Wait for loading indicator to disappear (Priority 1 - page has loader)
    await expect(page.getByTestId('brokers-loading')).toBeHidden({ timeout: 10000 });
  });

  /**
   * @smoke
   * Verify broker card menu is accessible
   */
  test('@smoke should open broker card menu', async ({ page }) => {
    // Skip if empty
    if (await brokersPage.isBrokersEmpty()) {
      test.skip();
    }

    // Get first broker card
    const firstCard = page.getByTestId('broker-card').first();

    // Click menu button
    await firstCard.getByTestId('broker-card-menu').click();

    // Verify delete option is visible
    await expect(page.getByTestId('broker-delete-button')).toBeVisible();
  });
});
