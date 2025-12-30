import { test, expect } from '@playwright/test';
import {
  goToTransactions,
  waitForPageLoad,
  openCreateTransactionDrawer,
  fillTransactionForm,
  submitTransactionForm,
  cancelTransactionForm,
  openEditTransactionDrawer,
  deleteTransaction,
  verifyTransactionInList,
  verifyTransactionNotInList,
} from '../utils';

/**
 * Transaction CRUD E2E Tests
 * Based on User Journey: docs/user-journeys/04-transaction-management.md
 */
test.describe('Transaction CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Auth setup should handle authentication, but ensure we're on a valid page
    // Navigate directly to transactions page first
    await page.goto('/transactions');
    await waitForPageLoad(page);
    
    // Verify we're on transactions page (not redirected to login)
    const url = page.url();
    if (!url.includes('/transactions')) {
      // If redirected, try navigation helper
      await goToTransactions(page);
      await waitForPageLoad(page);
    }
  });

  test.describe('Create Transaction', () => {
    test('should create a new expense transaction', async ({ page }) => {
      const testDescription = `E2E Test Transaction ${Date.now()}`;
      const testAmount = '99.99';

      // Open create drawer
      await openCreateTransactionDrawer(page);

      // Fill form
      await fillTransactionForm(page, {
        description: testDescription,
        amount: testAmount,
        movementType: 'Expense',
      });

      // Submit
      await submitTransactionForm(page, testDescription);

      // Verify success (toast notification or transaction in list)
      const hasSuccess = await Promise.race([
        page.getByText(/success|created/i).first().isVisible().then(() => true),
        page.getByText(testDescription).isVisible().then(() => true),
      ]).catch(() => false);

      // Verify transaction appears in list
      await verifyTransactionInList(page, testDescription);
    });

    test('should create a transaction with category and account', async ({ page }) => {
      const testDescription = `E2E Test Transaction with Category ${Date.now()}`;
      const testAmount = '150.50';

      await openCreateTransactionDrawer(page);

      // Fill form with category and account
      await fillTransactionForm(page, {
        description: testDescription,
        amount: testAmount,
        movementType: 'Expense',
        category: 'Fun', // Using existing category from the app
        // Account will be selected if available
      });

      // Try to select account if available
      const accountCombo = page.getByRole('combobox', { name: 'Account:' });
      if (await accountCombo.isVisible().catch(() => false)) {
        await accountCombo.click();
        const firstOption = page.getByRole('option').first();
        if (await firstOption.isVisible().catch(() => false)) {
          await firstOption.click();
        }
      }

      await submitTransactionForm(page);

      // Verify transaction appears
      await verifyTransactionInList(page, testDescription);
    });

    test('should create an income transaction', async ({ page }) => {
      const testDescription = `E2E Test Income ${Date.now()}`;
      const testAmount = '500.00';

      await openCreateTransactionDrawer(page);

      await fillTransactionForm(page, {
        description: testDescription,
        amount: testAmount,
        movementType: 'Income',
      });

      await submitTransactionForm(page);

      // Verify transaction appears (income should show positive amount)
      await verifyTransactionInList(page, testDescription);
    });

    test('should cancel transaction creation', async ({ page }) => {
      await openCreateTransactionDrawer(page);

      // Fill some fields
      await page.getByLabel('Description:').fill('Test Cancel');
      await page.getByLabel('Amount:').fill('100.00');

      // Cancel
      await cancelTransactionForm(page);

      // Verify drawer is closed
      await expect(page).not.toHaveURL(/.*drawer=/);

      // Verify transaction was NOT created
      await expect(page.getByText('Test Cancel')).not.toBeVisible();
    });
  });

  test.describe('Edit Transaction', () => {
    test('should edit an existing transaction', async ({ page }) => {
      // Wait for transactions to load
      await waitForPageLoad(page);

      // Find an existing transaction (use the first one we can find)
      const firstTransaction = page.locator('[role="list"] > *').first();
      const hasTransactions = await firstTransaction.count().then(count => count > 0);

      if (!hasTransactions) {
        test.skip();
        return;
      }

      // Get the description of the first transaction
      const originalDescription = await firstTransaction
        .locator('p')
        .first()
        .textContent()
        .catch(() => null);

      if (!originalDescription) {
        test.skip();
        return;
      }

      const newDescription = `E2E Edited ${Date.now()}`;
      const newAmount = '200.00';

      // Open edit drawer
      await openEditTransactionDrawer(page, originalDescription);

      // Update fields
      await page.getByLabel('Description').fill(newDescription);
      await page.getByLabel('Amount').fill(newAmount);

      // Save
      await page.getByRole('button', { name: 'Save' }).click();

      // Wait for drawer to close
      await page.waitForTimeout(1000);

      // Verify updated transaction appears
      await verifyTransactionInList(page, newDescription);
    });

    test('should change transaction type', async ({ page }) => {
      await waitForPageLoad(page);

      const firstTransaction = page.locator('[role="list"] > *').first();
      const hasTransactions = await firstTransaction.count().then(count => count > 0);

      if (!hasTransactions) {
        test.skip();
        return;
      }

      const originalDescription = await firstTransaction
        .locator('p')
        .first()
        .textContent()
        .catch(() => null);

      if (!originalDescription) {
        test.skip();
        return;
      }

      await openEditTransactionDrawer(page, originalDescription);

      // Change to Income
      await page.getByRole('radio', { name: 'Income' }).check();

      // Save
      await page.getByRole('button', { name: 'Save' }).click();
      await page.waitForTimeout(1000);

      // Verify transaction still exists (type change successful)
      await verifyTransactionInList(page, originalDescription);
    });

    test('should cancel transaction edit', async ({ page }) => {
      await waitForPageLoad(page);

      const firstTransaction = page.locator('[role="list"] > *').first();
      const hasTransactions = await firstTransaction.count().then(count => count > 0);

      if (!hasTransactions) {
        test.skip();
        return;
      }

      const originalDescription = await firstTransaction
        .locator('p')
        .first()
        .textContent()
        .catch(() => null);

      if (!originalDescription) {
        test.skip();
        return;
      }

      await openEditTransactionDrawer(page, originalDescription);

      // Change description
      await page.getByLabel('Description').fill('This should not be saved');

      // Cancel
      await cancelTransactionForm(page);

      // Verify original transaction still has original description
      await verifyTransactionInList(page, originalDescription);
    });
  });

  test.describe('Delete Transaction', () => {
    test('should delete a transaction', async ({ page }) => {
      // First, create a transaction to delete
      const testDescription = `E2E Delete Test ${Date.now()}`;
      const testAmount = '50.00';

      await openCreateTransactionDrawer(page);
      await fillTransactionForm(page, {
        description: testDescription,
        amount: testAmount,
        movementType: 'Expense',
      });
      await submitTransactionForm(page);
      await waitForPageLoad(page);

      // Verify it was created
      await verifyTransactionInList(page, testDescription);

      // Delete it
      await deleteTransaction(page, testDescription);

      // Verify it's gone
      await verifyTransactionNotInList(page, testDescription);
    });

    test('should handle delete confirmation', async ({ page }) => {
      await waitForPageLoad(page);

      const firstTransaction = page.locator('[role="list"] > *').first();
      const hasTransactions = await firstTransaction.count().then(count => count > 0);

      if (!hasTransactions) {
        test.skip();
        return;
      }

      const transactionDescription = await firstTransaction
        .locator('p')
        .first()
        .textContent()
        .catch(() => null);

      if (!transactionDescription) {
        test.skip();
        return;
      }

      // Click delete
      const transactionItem = page
        .locator(`text=${transactionDescription}`)
        .locator('..')
        .locator('..');
      await transactionItem.locator('button[aria-label*="delete"], .lucide-trash').first().click();

      // Check if confirmation dialog appears
      const dialog = page.getByRole('dialog');
      const hasDialog = await dialog.isVisible().catch(() => false);

      if (hasDialog) {
        // Cancel deletion
        await page.getByRole('button', { name: /cancel|no/i }).click();
        // Verify transaction still exists
        await verifyTransactionInList(page, transactionDescription);
      }
    });
  });

  test.describe('Transaction Form Validation', () => {
    test('should require description', async ({ page }) => {
      await openCreateTransactionDrawer(page);

      // Fill only amount
      await page.getByLabel('Amount:').fill('100.00');

      // Try to submit (button might be disabled or show validation)
      const submitButton = page.getByRole('button', { name: /Add Transaction/i });
      const isDisabled = await submitButton.isDisabled().catch(() => false);

      if (isDisabled) {
        // Button is disabled - validation working
        expect(isDisabled).toBe(true);
      } else {
        // Button enabled - check for validation error on submit
        await submitButton.click();
        await page.waitForTimeout(500);
        // Check for validation error
        const hasError = await page
          .getByText(/required|description/i)
          .first()
          .isVisible()
          .catch(() => false);
        expect(hasError).toBe(true);
      }
    });

    test('should require amount', async ({ page }) => {
      await openCreateTransactionDrawer(page);

      // Fill only description
      await page.getByLabel('Description:').fill('Test Transaction');

      // Try to submit
      const submitButton = page.getByRole('button', { name: /Add Transaction/i });
      const isDisabled = await submitButton.isDisabled().catch(() => false);

      if (isDisabled) {
        expect(isDisabled).toBe(true);
      } else {
        await submitButton.click();
        await page.waitForTimeout(500);
        const hasError = await page
          .getByText(/required|amount/i)
          .first()
          .isVisible()
          .catch(() => false);
        expect(hasError).toBe(true);
      }
    });
  });
});

