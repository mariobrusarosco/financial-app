import { test, expect } from '@playwright/test';
import { AccountsPage } from '@/domains/testing/test/e2e/page-objects/accounts-page';
import { generateTestData, isLocalEnvironment } from '@/domains/testing/test/e2e/fixtures/test-helpers';

/**
 * Accounts E2E Tests
 * Tests account management functionality
 */

test.describe('Accounts - List View', () => {
  let accountsPage: AccountsPage;

  test.beforeEach(async ({ page }) => {
    // Already authenticated via global setup - just navigate to accounts page
    accountsPage = new AccountsPage(page);
    await accountsPage.goto();

    // Wait for loading indicator to disappear (Priority 1 - page has loader)
    await expect(page.getByTestId('accounts-loading')).toBeHidden({ timeout: 10000 });
  });

  /**
   * @smoke @critical
   * Verify accounts page loads and displays accounts
   */
  test('@smoke @critical should display accounts list', async ({ page }) => {
    // Should show either accounts list or empty state (already waited in beforeEach)
    const hasAccounts = await accountsPage.isAccountsListVisible();
    const isEmpty = await accountsPage.isAccountsEmpty();

    expect(hasAccounts || isEmpty).toBe(true);
  });

  /**
   * @smoke
   * Verify add button is visible when accounts loaded
   */
  test('@smoke should show add account button', async ({ page }) => {
    // Add button should be visible (unless error state)
    const isError = await accountsPage.isAccountsError();
    if (!isError) {
      await expect(page.getByTestId('accounts-add-button')).toBeVisible();
    }
  });

  /**
   * @smoke
   * Verify account cards show required information
   */
  test('@smoke should display account card details', async ({ page }) => {
    // Skip if empty
    if (await accountsPage.isAccountsEmpty()) {
      test.skip();
    }

    // Wait for at least one account card to appear
    await expect(page.getByTestId('account-card').first()).toBeVisible({ timeout: 5000 });

    // Get first account card
    const firstCard = page.getByTestId('account-card').first();

    // Verify card has name, broker, and balance
    await expect(firstCard.getByTestId('account-card-name')).toBeVisible();
    await expect(firstCard.getByTestId('account-card-broker')).toBeVisible();
    await expect(firstCard.getByTestId('account-card-balance')).toBeVisible();
  });

  /**
   * @smoke
   * Verify accounts are grouped by type
   */
  test('@smoke should group accounts by type', async ({ page }) => {
    // Skip if empty
    if (await accountsPage.isAccountsEmpty()) {
      test.skip();
    }

    // Wait for accounts list to be visible (already waited in beforeEach)
    await expect(page.getByTestId('accounts-list')).toBeVisible({ timeout: 5000 });

    // Check if there are any account groups
    const cashGroup = page.getByTestId('accounts-group-cash');
    const savingsGroup = page.getByTestId('accounts-group-savings');

    // At least one group should exist
    const hasCash = await cashGroup.isVisible().catch(() => false);
    const hasSavings = await savingsGroup.isVisible().catch(() => false);

    expect(hasCash || hasSavings).toBe(true);
  });
});

test.describe('Accounts - Create Account', () => {
  let accountsPage: AccountsPage;

  test.beforeEach(async ({ page }) => {
    // Already authenticated via global setup - just navigate to accounts page
    accountsPage = new AccountsPage(page);
    await accountsPage.goto();

    // Wait for page to load - wait for add button to appear
    await expect(page.getByTestId('accounts-add-button')).toBeVisible({ timeout: 10000 });
  });

  /**
   * @local
   * Create a new cash account
   * Only runs locally - creates data
   * FIXME: Broker dropdown selection needs refinement
   */
  test.skip('@local should create new cash account successfully', async ({ page }) => {
    // Skip on non-local environments
    test.skip(!isLocalEnvironment(), 'Only run locally - creates data');

    const testData = generateTestData();

    // Click add account button
    await accountsPage.clickAddAccountButton();

    // Verify create form is visible
    expect(await accountsPage.isCreateAccountFormVisible()).toBe(true);

    // Fill form fields individually to handle broker selection
    await accountsPage.fillAccountName(testData.accountName);
    await accountsPage.selectAccountType('cash');
    await accountsPage.fillInitialBalance(1000);
    await accountsPage.fillDescription('E2E Test Account');

    // Select first available broker
    await page.getByTestId('account-broker-select').click();
    // Wait for dropdown options to appear
    const firstBroker = page.getByRole('option').first();
    await expect(firstBroker).toBeVisible({ timeout: 5000 });
    await firstBroker.click();

    await accountsPage.selectCurrency('BRL');
    await accountsPage.submitCreateAccount();

    // Verify account was created - wait for accounts list to appear
    await expect(page.getByTestId('accounts-list')).toBeVisible({ timeout: 10000 });

    // Should see accounts list (not empty anymore)
    expect(await accountsPage.isAccountsListVisible()).toBe(true);
  });

  /**
   * @local
   * Verify form validation works
   */
  test('@local should validate required fields', async ({ page }) => {
    // Skip on non-local environments
    test.skip(!isLocalEnvironment(), 'Only run locally');

    // Click add account button
    await accountsPage.clickAddAccountButton();

    // Try to submit without filling required fields
    await accountsPage.submitCreateAccount();

    // Form should still be visible (validation failed) - wait to ensure form didn't close
    await expect(page.getByTestId('account-create-form')).toBeVisible({ timeout: 2000 });
    expect(await accountsPage.isCreateAccountFormVisible()).toBe(true);
  });

  /**
   * @smoke
   * Verify create account form opens
   */
  test('@smoke should open create account form when add button clicked', async ({ page }) => {
    // Skip if there's an error loading accounts
    if (await accountsPage.isAccountsError()) {
      test.skip();
    }

    // Click add account button
    await accountsPage.clickAddAccountButton();

    // Verify form is visible
    expect(await accountsPage.isCreateAccountFormVisible()).toBe(true);

    // Verify all form fields are visible
    await expect(page.getByTestId('account-name-input')).toBeVisible();
    await expect(page.getByTestId('account-type-select')).toBeVisible();
    await expect(page.getByTestId('account-balance-input')).toBeVisible();
    await expect(page.getByTestId('account-broker-select')).toBeVisible();
    await expect(page.getByTestId('account-currency-select')).toBeVisible();
    await expect(page.getByTestId('account-create-submit')).toBeVisible();
  });
});

test.describe('Accounts - Navigation', () => {
  let accountsPage: AccountsPage;

  test.beforeEach(async ({ page }) => {
    // Already authenticated via global setup - just navigate to accounts page
    accountsPage = new AccountsPage(page);
    await accountsPage.goto();

    // Wait for loading indicator to disappear (Priority 1 - page has loader)
    await expect(page.getByTestId('accounts-loading')).toBeHidden({ timeout: 10000 });
  });

  /**
   * @smoke
   * Verify clicking account card navigates to details
   */
  test('@smoke should navigate to account details when card clicked', async ({ page }) => {
    // Skip if empty
    if (await accountsPage.isAccountsEmpty()) {
      test.skip();
    }

    // Get first account card
    const cards = await accountsPage.getAccountCards();
    if (cards.length > 0) {
      const firstCard = cards[0];

      // Click the account link
      await firstCard.getByTestId('account-card-link').click();

      // Should navigate to account details page
      await page.waitForURL(/\/accounts\/.+/);
      expect(page.url()).toMatch(/\/accounts\/.+/);
    }
  });
});
