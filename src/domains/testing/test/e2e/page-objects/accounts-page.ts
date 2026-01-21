import type { Page } from '@playwright/test';
import { waitForPageLoad } from '../fixtures/test-helpers';

/**
 * Accounts Page Object
 * Handles all accounts page interactions
 */
export class AccountsPage {
  constructor(private page: Page) {}

  // Navigation
  async goto() {
    await this.page.goto('/accounts');
    await waitForPageLoad(this.page);
  }

  // Actions - Account List
  async clickAddAccountButton() {
    await this.page.getByTestId('accounts-add-button').click();
    // Wait for drawer/modal to open
    await this.page.waitForTimeout(500);
  }

  async getAccountCards() {
    return this.page.getByTestId('account-card').all();
  }

  async getAccountCardByName(name: string) {
    return this.page
      .getByTestId('account-card')
      .filter({ has: this.page.getByTestId('account-card-name').getByText(name) });
  }

  async clickAccountCard(accountName: string) {
    const card = await this.getAccountCardByName(accountName);
    await card.getByTestId('account-card-link').click();
  }

  // Actions - Create Account Form
  async fillAccountName(name: string) {
    await this.page.getByTestId('account-name-input').fill(name);
  }

  async selectAccountType(type: 'cash' | 'savings' | 'credit' | 'investment') {
    await this.page.getByTestId('account-type-select').click();
    await this.page.waitForTimeout(500);
    // Radix UI Select - click the visible option by text
    const typeMap = {
      cash: 'Cash',
      savings: 'Savings',
      credit: 'Credit Card',
      investment: 'Investment',
    };
    await this.page.locator(`[role="option"]:has-text("${typeMap[type]}")`).last().click();
  }

  async fillInitialBalance(balance: number) {
    await this.page.getByTestId('account-balance-input').fill(balance.toString());
  }

  async fillDescription(description: string) {
    await this.page.getByTestId('account-description-input').fill(description);
  }

  async selectBroker(brokerName: string) {
    await this.page.getByTestId('account-broker-select').click();
    await this.page.waitForTimeout(500);
    // Find option that contains the broker name
    await this.page.locator(`[role="option"]:has-text("${brokerName}")`).last().click();
  }

  async selectCurrency(currency: 'BRL' | 'USD') {
    await this.page.getByTestId('account-currency-select').click();
    await this.page.waitForTimeout(500);
    await this.page.locator(`[role="option"]:has-text("${currency}")`).last().click();
  }

  async submitCreateAccount() {
    await this.page.getByTestId('account-create-submit').click();
  }

  /**
   * Complete account creation flow
   */
  async createAccount(data: {
    name: string;
    type: 'cash' | 'savings' | 'credit' | 'investment';
    balance?: number;
    description?: string;
    broker: string;
    currency?: 'BRL' | 'USD';
  }) {
    await this.fillAccountName(data.name);
    await this.selectAccountType(data.type);

    if (data.balance !== undefined) {
      await this.fillInitialBalance(data.balance);
    }

    if (data.description) {
      await this.fillDescription(data.description);
    }

    await this.selectBroker(data.broker);

    if (data.currency) {
      await this.selectCurrency(data.currency);
    }

    await this.submitCreateAccount();

    // Wait for account to be created and drawer to close
    await this.page.waitForTimeout(2000);
  }

  // Assertions helpers
  async isAccountsListVisible() {
    return this.page.getByTestId('accounts-list').isVisible();
  }

  async isAccountsLoading() {
    return this.page.getByTestId('accounts-loading').isVisible();
  }

  async isAccountsEmpty() {
    return this.page.getByTestId('accounts-empty').isVisible();
  }

  async isAccountsError() {
    return this.page.getByTestId('accounts-error').isVisible();
  }

  async isAddButtonVisible() {
    return this.page.getByTestId('accounts-add-button').isVisible();
  }

  async getAccountCardBalance(accountName: string) {
    const card = await this.getAccountCardByName(accountName);
    const balanceElement = card.getByTestId('account-card-balance');
    return balanceElement.textContent();
  }

  async getAccountCardBroker(accountName: string) {
    const card = await this.getAccountCardByName(accountName);
    const brokerElement = card.getByTestId('account-card-broker');
    return brokerElement.textContent();
  }

  async getAccountsCountByType(type: string) {
    const group = this.page.getByTestId(`accounts-group-${type}`);
    const cards = await group.getByTestId('account-card').all();
    return cards.length;
  }

  async isCreateAccountFormVisible() {
    return this.page.getByTestId('account-create-form').isVisible();
  }
}
