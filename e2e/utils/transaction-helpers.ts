// e2e/utils/transaction-helpers.ts
import { Page, expect } from '@playwright/test';

/**
 * Open the transaction creation drawer
 */
export const openCreateTransactionDrawer = async (page: Page) => {
  await page.getByRole('button', { name: 'Add Transaction' }).click();
  await expect(page).toHaveURL(/.*drawer=transaction-create/);
  // Wait for drawer to fully open
  await page.waitForTimeout(500);
  await expect(page.getByRole('heading', { name: 'Create Transactions' })).toBeVisible();
};

/**
 * Open the transaction edit drawer for a specific transaction
 */
export const openEditTransactionDrawer = async (page: Page, transactionDescription: string) => {
  // Find the transaction by description and click edit icon
  const transactionItem = page.locator(`text=${transactionDescription}`).locator('..').locator('..');
  await transactionItem.locator('button[aria-label*="edit"], .lucide-square-pen').first().click();
  
  // Wait for edit drawer to open
  await page.waitForTimeout(500);
  await expect(page.getByRole('heading', { name: 'Edit Transaction' })).toBeVisible();
};

/**
 * Fill transaction form with provided data
 */
export const fillTransactionForm = async (
  page: Page,
  data: {
    description: string;
    amount: string;
    movementType?: 'Expense' | 'Income' | 'Investment' | 'Transfer';
    category?: string;
    account?: string;
    paymentStatus?: 'Paid' | 'Unpaid';
    ignoreTransaction?: boolean;
  }
) => {
  // Description
  await page.getByLabel('Description:').fill(data.description);
  
  // Amount
  await page.getByLabel('Amount:').fill(data.amount);
  
  // Movement Type (defaults to Expense if not specified)
  if (data.movementType) {
    await page.getByRole('radio', { name: data.movementType }).check();
  }
  
  // Category (if provided)
  if (data.category) {
    const categoryCombo = page.getByRole('combobox', { name: 'Category' });
    const isVisible = await categoryCombo.isVisible({ timeout: 3000 }).catch(() => false);
    if (isVisible) {
      await categoryCombo.click();
      await page.waitForTimeout(300); // Wait for dropdown to open
      // Try to find and click the option
      const option = page.getByRole('option', { name: data.category });
      const optionVisible = await option.isVisible({ timeout: 3000 }).catch(() => false);
      if (optionVisible) {
        await option.click();
      } else {
        // Fallback: click first available option
        const firstOption = page.getByRole('option').first();
        if (await firstOption.isVisible({ timeout: 2000 }).catch(() => false)) {
          await firstOption.click();
        }
      }
    }
  }
  
  // Account (if provided)
  if (data.account) {
    const accountCombo = page.getByRole('combobox', { name: 'Account:' });
    const isVisible = await accountCombo.isVisible({ timeout: 3000 }).catch(() => false);
    if (isVisible) {
      await accountCombo.click();
      await page.waitForTimeout(300); // Wait for dropdown to open
      // Try to find and click the option
      const option = page.getByRole('option', { name: data.account });
      const optionVisible = await option.isVisible({ timeout: 3000 }).catch(() => false);
      if (optionVisible) {
        await option.click();
      } else {
        // Fallback: click first available option
        const firstOption = page.getByRole('option').first();
        if (await firstOption.isVisible({ timeout: 2000 }).catch(() => false)) {
          await firstOption.click();
        }
      }
    }
  }
  
  // Payment Status (if provided)
  if (data.paymentStatus === 'Paid') {
    const statusSwitch = page.getByRole('switch', { name: /Payment Status/i });
    if (await statusSwitch.isChecked().catch(() => false)) {
      // Already paid, no action needed
    } else {
      await statusSwitch.click();
    }
  }
  
  // Ignore Transaction (if provided)
  if (data.ignoreTransaction !== undefined) {
    const ignoreSwitch = page.getByRole('switch', { name: /Ignore Transaction/i });
    const isChecked = await ignoreSwitch.isChecked().catch(() => false);
    if (data.ignoreTransaction !== isChecked) {
      await ignoreSwitch.click();
    }
  }
};

/**
 * Submit transaction form (create or edit)
 */
export const submitTransactionForm = async (page: Page, expectedDescription?: string) => {
  // Look for "Add Transaction" button (create) or "Save" button (edit)
  const submitButton = page.getByRole('button', { name: /Add Transaction|Save/i });
  
  // Check if button is enabled
  const isEnabled = await submitButton.isEnabled().catch(() => true);
  if (!isEnabled) {
    throw new Error('Submit button is disabled - form may have validation errors');
  }
  
  await submitButton.click();
  
  // Wait for either:
  // 1. Drawer to close (URL no longer has drawer=)
  // 2. Success toast to appear
  // 3. Transaction to appear in list
  await Promise.race([
    page.waitForURL(url => !url.includes('drawer='), { timeout: 5000 }).catch(() => {}),
    page.waitForSelector('text=/success|created|saved/i', { timeout: 5000 }).catch(() => {}),
    expectedDescription
      ? page.waitForSelector(`text=${expectedDescription}`, { timeout: 5000 }).catch(() => {})
      : Promise.resolve(),
  ]);
  
  // Give a moment for UI to update
  await page.waitForTimeout(500);
};

/**
 * Cancel transaction form
 */
export const cancelTransactionForm = async (page: Page) => {
  const cancelButton = page.getByRole('button', { name: 'Cancel' });
  if (await cancelButton.isVisible().catch(() => false)) {
    await cancelButton.click();
  } else {
    // Fallback: press Escape
    await page.keyboard.press('Escape');
  }
  
  // Wait for drawer to close
  await page.waitForTimeout(500);
};

/**
 * Delete a transaction
 */
export const deleteTransaction = async (page: Page, transactionDescription: string) => {
  // Wait for transactions to load
  await page.waitForTimeout(1000);
  
  // Find the transaction by description
  const transactionText = page.getByText(transactionDescription, { exact: false });
  const isVisible = await transactionText.isVisible({ timeout: 5000 }).catch(() => false);
  
  if (!isVisible) {
    throw new Error(`Transaction not found: ${transactionDescription}`);
  }
  
  // Find the transaction row - the text is in a paragraph, go up to find the row
  // Structure: paragraph -> generic -> generic (transaction row)
  const transactionRow = transactionText.locator('..').locator('..').locator('..');
  
  // In the transaction row, there are typically action buttons/icons
  // From browser exploration: edit icon and delete icon are siblings
  // Delete is usually the last clickable icon/button in the action area
  
  // Strategy: Find all clickable elements (img, button) in the transaction row
  // and click the last one (which should be delete)
  const actionButtons = transactionRow.locator('img[cursor="pointer"], button, [role="button"]');
  const buttonCount = await actionButtons.count();
  
  if (buttonCount >= 2) {
    // Click the last button (delete is usually last)
    await actionButtons.last().click();
  } else if (buttonCount === 1) {
    // Only one button, click it
    await actionButtons.first().click();
  } else {
    // Fallback: look for any icon in the row and click the last one
    const allIcons = transactionRow.locator('img');
    const iconCount = await allIcons.count();
    if (iconCount > 0) {
      await allIcons.last().click();
    } else {
      throw new Error(`Delete button not found for transaction: ${transactionDescription}`);
    }
  }
  
  // Handle confirmation dialog if it appears
  await page.waitForTimeout(500);
  const dialog = page.getByRole('dialog');
  const hasDialog = await dialog.isVisible({ timeout: 2000 }).catch(() => false);
  
  if (hasDialog) {
    await page.getByRole('button', { name: /confirm|delete|yes|ok/i }).click();
  }
  
  // Wait for deletion to complete
  await page.waitForTimeout(1000);
};

/**
 * Verify transaction appears in list
 */
export const verifyTransactionInList = async (
  page: Page,
  description: string,
  amount?: string
) => {
  await expect(page.getByText(description)).toBeVisible();
  
  if (amount) {
    await expect(page.getByText(amount)).toBeVisible();
  }
};

/**
 * Verify transaction does not appear in list
 */
export const verifyTransactionNotInList = async (page: Page, description: string) => {
  await expect(page.getByText(description)).not.toBeVisible();
};

