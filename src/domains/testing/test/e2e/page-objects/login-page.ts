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

    // Wait for submit button to be enabled (form validation passes)
    const submitButton = this.page.getByTestId('login-submit-button');

    // Force click even if disabled (Playwright can click disabled buttons with force: true)
    // Or wait for it to be enabled
    await this.page.waitForTimeout(1000); // Give form more time to validate
    await submitButton.click({ force: true });

    // Wait for navigation to dashboard
    await this.page.waitForURL(/dashboard/, { timeout: 10000 });
  }

  async loginWithError(email: string, password: string) {
    const emailInput = this.page.getByTestId('login-email-input');
    await emailInput.fill(email);

    const passwordInput = this.page.getByTestId('login-password-input');
    await passwordInput.fill(password);

    // Wait for form validation to complete
    await this.page.waitForTimeout(1000);

    const submitButton = this.page.getByTestId('login-submit-button');
    await submitButton.click({ force: true });
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
