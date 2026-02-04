import type { Page } from '@playwright/test';
import { waitForPageLoad } from '../fixtures/test-helpers';

/**
 * Brokers Page Object
 * Handles all brokers page interactions
 */
export class BrokersPage {
  constructor(private page: Page) {}

  // Navigation
  async goto() {
    await this.page.goto('/brokers');
    await waitForPageLoad(this.page);
  }

  // Actions
  async clickAddBrokerButton() {
    await this.page.getByTestId('brokers-add-button').click();
  }

  async getBrokerCards() {
    return this.page.getByTestId('broker-card').all();
  }

  async getBrokerCardByName(name: string) {
    return this.page
      .getByTestId('broker-card')
      .filter({ has: this.page.getByTestId('broker-card-name').getByText(name) });
  }

  async deleteBroker(brokerName: string) {
    const card = await this.getBrokerCardByName(brokerName);
    await card.getByTestId('broker-card-menu').click();
    await this.page.getByTestId('broker-delete-button').click();
  }

  // Assertions helpers
  async isBrokersListVisible() {
    return this.page.getByTestId('brokers-list').isVisible();
  }

  async isBrokersLoading() {
    return this.page.getByTestId('brokers-loading').isVisible();
  }

  async isBrokersEmpty() {
    return this.page.getByTestId('brokers-empty').isVisible();
  }

  async isBrokersError() {
    return this.page.getByTestId('brokers-error').isVisible();
  }

  async isAddButtonVisible() {
    return this.page.getByTestId('brokers-add-button').isVisible();
  }

  async getBrokerCardName(brokerName: string) {
    const card = await this.getBrokerCardByName(brokerName);
    const nameElement = card.getByTestId('broker-card-name');
    return nameElement.textContent();
  }

  async getBrokerCardDescription(brokerName: string) {
    const card = await this.getBrokerCardByName(brokerName);
    const descElement = card.getByTestId('broker-card-description');
    return descElement.textContent();
  }
}
