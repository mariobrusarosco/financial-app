import type { Page } from '@playwright/test';
import { getTestCredentials, waitForPageLoad } from '../fixtures/test-helpers';

/**
 * Login Page Object
 * Handles all login-related interactions
 */
export class LoginPage {
  constructor(private page: Page) {}

  // Navigation
  async goto() {
    await this.page.goto('/');
    await waitForPageLoad(this.page);
  }

  // Actions
  async login(email?: string, password?: string) {
    const credentials = getTestCredentials();
    const loginEmail = email || credentials.email;
    const loginPassword = password || credentials.password;

    // Fill email field
    const emailInput = this.page.getByTestId('login-email-input');
    await emailInput.fill(loginEmail);

    // Fill password field
    const passwordInput = this.page.getByTestId('login-password-input');
    await passwordInput.fill(loginPassword);

    // Click submit button - Playwright auto-waits for it to be visible, enabled, and actionable
    const submitButton = this.page.getByTestId('login-submit-button');
    await submitButton.click();

    // Wait for navigation to dashboard
    await this.page.waitForURL(/dashboard/, { timeout: 10000 });
  }

  async loginWithError(email: string, password: string) {
    const emailInput = this.page.getByTestId('login-email-input');
    await emailInput.fill(email);

    const passwordInput = this.page.getByTestId('login-password-input');
    await passwordInput.fill(password);

    // Click submit - Playwright auto-waits for button to be actionable
    const submitButton = this.page.getByTestId('login-submit-button');
    await submitButton.click();
  }

  // Assertions helpers
  async getErrorToast() {
    // Error messages are shown via toast (sonner)
    // Wait for toast to appear
    const toast = this.page.locator('[data-sonner-toast][data-type="error"]');
    await toast.waitFor({ state: 'visible', timeout: 5000 });
    return toast.textContent();
  }

  async isLoginFormVisible() {
    return this.page.getByTestId('login-form').isVisible();
  }

  async isEmailInputVisible() {
    return this.page.getByTestId('login-email-input').isVisible();
  }

  async isPasswordInputVisible() {
    return this.page.getByTestId('login-password-input').isVisible();
  }

  async isSubmitButtonVisible() {
    return this.page.getByTestId('login-submit-button').isVisible();
  }

  // Navigation to other auth pages
  async goToForgotPassword() {
    await this.page.getByTestId('forgot-password-link').click();
    await waitForPageLoad(this.page);
  }

  async goToSignUp() {
    await this.page.getByTestId('signup-link').click();
    await waitForPageLoad(this.page);
  }
}
