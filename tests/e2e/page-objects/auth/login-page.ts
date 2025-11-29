import { expect, type Page } from '@playwright/test'
import { BasePage } from './base-page'

/**
 * LoginPage - Page Object for the login page
 *
 * Encapsulates all interactions with the login page including:
 * - Filling in login credentials
 * - Submitting the login form
 * - Validating login success/failure
 * - Remember me functionality
 *
 * Usage:
 * ```typescript
 * const loginPage = new LoginPage(page)
 * await loginPage.goto()
 * await loginPage.login('user@example.com', 'password123')
 * await loginPage.expectLoginSuccess()
 * ```
 */
export class LoginPage extends BasePage {
  // Page URL
  private readonly path = '/login'

  // Selectors
  private readonly selectors = {
    emailInput: '#email',
    passwordInput: '#password',
    rememberMeCheckbox: '#rememberMe',
    submitButton: 'button[type="submit"]',
    errorMessage: '.text-destructive',
    loadingIndicator: 'text=Signing in...',
  }

  constructor(page: Page) {
    super(page)
  }

  /**
   * Navigate to the login page
   */
  async goto() {
    await super.goto(this.path)
    await this.waitForPageLoad()
  }

  /**
   * Wait for the login page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForSelector(this.selectors.emailInput)
    await this.page.waitForSelector(this.selectors.passwordInput)
  }

  /**
   * Fill in the email field
   * @param email - Email address to enter
   */
  async fillEmail(email: string) {
    await this.page.fill(this.selectors.emailInput, email)
  }

  /**
   * Fill in the password field
   * @param password - Password to enter
   */
  async fillPassword(password: string) {
    await this.page.fill(this.selectors.passwordInput, password)
  }

  /**
   * Toggle the "Remember me" checkbox
   * @param checked - Whether to check or uncheck the box
   */
  async setRememberMe(checked: boolean) {
    const checkbox = this.page.locator(this.selectors.rememberMeCheckbox)
    const isChecked = await checkbox.isChecked()

    if (checked !== isChecked) {
      await checkbox.click()
    }
  }

  /**
   * Click the submit button
   */
  async clickSubmit() {
    await this.page.click(this.selectors.submitButton)
  }

  /**
   * Complete login flow with email and password
   * @param email - Email address
   * @param password - Password
   * @param rememberMe - Optional: whether to check "Remember me"
   */
  async login(email: string, password: string, rememberMe = false) {
    await this.fillEmail(email)
    await this.fillPassword(password)

    if (rememberMe) {
      await this.setRememberMe(true)
    }

    await this.clickSubmit()
  }

  /**
   * Wait for login to complete (either success or failure)
   */
  async waitForLoginResult() {
    // Wait for either navigation to dashboard (success) or error message (failure)
    await Promise.race([
      this.page.waitForURL('/dashboard', { timeout: 10000 }),
      this.page.waitForSelector(this.selectors.errorMessage, { timeout: 10000 }),
    ])
  }

  /**
   * Check if login was successful (redirected to dashboard)
   */
  async expectLoginSuccess() {
    await expect(this.page).toHaveURL(/\/dashboard/)
  }

  /**
   * Check if login failed (still on login page with error)
   */
  async expectLoginFailure() {
    await expect(this.page).toHaveURL(/\/login/)
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string | null> {
    const errorElement = this.page.locator(this.selectors.errorMessage).first()
    const isVisible = await errorElement.isVisible()

    if (!isVisible) {
      return null
    }

    return await errorElement.textContent()
  }

  /**
   * Check if error message is displayed
   * @param expectedMessage - Optional: specific error message to check for
   */
  async expectErrorMessage(expectedMessage?: string) {
    const errorElement = this.page.locator(this.selectors.errorMessage).first()
    await expect(errorElement).toBeVisible()

    if (expectedMessage) {
      await expect(errorElement).toContainText(expectedMessage)
    }
  }

  /**
   * Check if submit button is disabled
   */
  async expectSubmitDisabled() {
    const submitButton = this.page.locator(this.selectors.submitButton)
    await expect(submitButton).toBeDisabled()
  }

  /**
   * Check if submit button is enabled
   */
  async expectSubmitEnabled() {
    const submitButton = this.page.locator(this.selectors.submitButton)
    await expect(submitButton).toBeEnabled()
  }

  /**
   * Check if loading state is shown
   */
  async expectLoading() {
    await expect(this.page.locator(this.selectors.loadingIndicator)).toBeVisible()
  }
}
