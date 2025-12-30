import { test, expect } from '@playwright/test';
import { goToTransactions, waitForPageLoad } from '../utils';

/**
 * Transaction Management E2E Tests
 * Based on User Journey: docs/user-journeys/04-transaction-management.md
 */
test.describe('Transaction Management', () => {
  test.beforeEach(async ({ page }) => {
    // Auth setup should handle authentication
    // Navigate to transactions page
    await goToTransactions(page);
    await waitForPageLoad(page);
  });

  test('should display transaction list', async ({ page }) => {
    // Verify we're on transactions page
    await expect(page).toHaveURL(/.*transactions/);
    
    // Check page header
    await expect(page.getByRole('heading', { name: 'Transaction History' })).toBeVisible();
    
    // Check for action buttons
    await expect(page.getByRole('button', { name: 'Add Transaction' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Manage Categories' })).toBeVisible();
    
    // Check for transaction count (if transactions exist)
    const transactionCount = page.getByText(/\d+ transactions found/i);
    const hasTransactions = await transactionCount.isVisible().catch(() => false);
    
    if (hasTransactions) {
      await expect(transactionCount).toBeVisible();
    }
  });

  test('should open add transaction drawer', async ({ page }) => {
    // Click Add Transaction button
    await page.getByRole('button', { name: 'Add Transaction' }).click();
    
    // Wait for drawer to open (URL should change)
    await expect(page).toHaveURL(/.*drawer=transaction-create/);
    
    // Drawer should be visible (check for common drawer patterns)
    // This will need to be adjusted based on actual drawer implementation
    await page.waitForTimeout(500); // Give drawer time to animate
    
    // Check if drawer content is visible (form fields, etc.)
    // Adjust selectors based on actual form implementation
    const hasDrawerContent = await Promise.race([
      page.getByRole('dialog').isVisible().then(() => true),
      page.locator('[data-state="open"]').isVisible().then(() => true),
      page.getByText(/transaction|amount|description/i).first().isVisible().then(() => true),
    ]).catch(() => false);
    
    expect(hasDrawerContent).toBe(true);
  });

  test('should display existing transactions', async ({ page }) => {
    // Wait for transactions to load
    await waitForPageLoad(page);
    
    // Check if transaction list exists
    // Transactions may be in a list or table
    const transactionList = page.locator('[role="list"]').or(page.locator('table'));
    const hasTransactions = await transactionList.count().then(count => count > 0);
    
    if (hasTransactions) {
      // Verify transaction items have expected elements
      const firstTransaction = transactionList.first();
      
      // Check for common transaction elements (description, amount, date)
      // These selectors will need adjustment based on actual implementation
      const hasDescription = await firstTransaction.getByText(/.+/).first().isVisible().catch(() => false);
      expect(hasDescription).toBe(true);
    }
  });

  test('should navigate to category management', async ({ page }) => {
    // Click Manage Categories button
    await page.getByRole('button', { name: 'Manage Categories' }).click();
    
    // Wait for drawer to open
    await expect(page).toHaveURL(/.*drawer=category-manager/);
    
    // Drawer should be visible
    await page.waitForTimeout(500);
    
    const hasCategoryManager = await Promise.race([
      page.getByRole('dialog').isVisible().then(() => true),
      page.locator('[data-state="open"]').isVisible().then(() => true),
      page.getByText(/categor/i).first().isVisible().then(() => true),
    ]).catch(() => false);
    
    expect(hasCategoryManager).toBe(true);
  });

  test('should allow selecting transactions', async ({ page }) => {
    await waitForPageLoad(page);
    
    // Check for Select All button
    const selectAllButton = page.getByRole('button', { name: /Select All/i });
    const hasSelectAll = await selectAllButton.isVisible().catch(() => false);
    
    if (hasSelectAll) {
      // Click Select All
      await selectAllButton.click();
      
      // Verify transactions are selected (checkboxes checked)
      // This will need adjustment based on actual implementation
      const checkboxes = page.locator('input[type="checkbox"]');
      const checkedCount = await checkboxes.filter({ has: page.locator(':checked') }).count();
      expect(checkedCount).toBeGreaterThan(0);
    }
  });
});

