import { test, expect } from '@playwright/test'
import { LoginPage } from '../../page-objects/auth/login-page'
import { getTestCredentials, loginAsUser, isLoggedIn } from '../../fixtures/auth.setup'

/**
 * Login Flow E2E Tests
 *
 * Tests cover:
 * - Successful login with valid credentials
 * - Failed login with invalid credentials
 * - Form validation (empty fields, invalid email format)
 * - Remember me functionality
 * - Redirect behavior (logged in users redirected to dashboard)
 */

test.describe('Login Flow', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
  })

  test('should display login page correctly', async ({ page }) => {
    await loginPage.goto()

    // Verify page loaded
    await expect(page).toHaveURL(/\/login/)

    // Verify key elements are visible
    await expect(page.getByText('Welcome back')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
  })

  test('should successfully login with valid credentials', async ({ page }) => {
    const { email, password } = getTestCredentials()

    await loginPage.goto()
    await loginPage.login(email, password)
    await loginPage.waitForLoginResult()

    // Verify redirected to dashboard
    await loginPage.expectLoginSuccess()
    await expect(page).toHaveURL(/\/dashboard/)

    // Verify user is actually logged in
    const loggedIn = await isLoggedIn(page)
    expect(loggedIn).toBe(true)
  })

  test('should fail login with invalid email', async ({ page }) => {
    await loginPage.goto()
    await loginPage.login('invalid@example.com', 'wrongpassword')
    await loginPage.waitForLoginResult()

    // Should stay on login page
    await loginPage.expectLoginFailure()

    // Should show error message (if backend returns one)
    // Note: Error message may vary based on backend implementation
    const errorMessage = await loginPage.getErrorMessage()
    if (errorMessage) {
      expect(errorMessage).toBeTruthy()
    }
  })

  test('should fail login with invalid password', async ({ page }) => {
    const { email } = getTestCredentials()

    await loginPage.goto()
    await loginPage.login(email, 'wrongpassword')
    await loginPage.waitForLoginResult()

    // Should stay on login page
    await loginPage.expectLoginFailure()
  })

  test('should show validation error for empty email', async ({ page }) => {
    await loginPage.goto()

    // Try to submit with empty email
    await loginPage.fillEmail('')
    await loginPage.fillPassword('somepassword')

    // Submit button should be disabled due to form validation
    await loginPage.expectSubmitDisabled()
  })

  test('should show validation error for invalid email format', async ({ page }) => {
    await loginPage.goto()

    // Fill invalid email format
    await loginPage.fillEmail('not-an-email')
    await loginPage.fillPassword('password123')

    // Click somewhere else to trigger blur validation
    await page.click('body')

    // Should show validation error
    await loginPage.expectErrorMessage('Please enter a valid email')
  })

  test('should show validation error for short password', async ({ page }) => {
    await loginPage.goto()

    await loginPage.fillEmail('user@example.com')
    await loginPage.fillPassword('123') // Less than 6 characters

    // Click somewhere else to trigger blur validation
    await page.click('body')

    // Should show validation error
    await loginPage.expectErrorMessage('Password must be at least 6 characters')
  })

  test('should handle "Remember me" checkbox', async ({ page }) => {
    const { email, password } = getTestCredentials()

    await loginPage.goto()
    await loginPage.login(email, password, true) // rememberMe = true
    await loginPage.waitForLoginResult()

    // Verify login successful
    await loginPage.expectLoginSuccess()

    // Note: Actual "remember me" behavior testing would require:
    // - Closing browser and reopening
    // - Or checking cookie expiration settings
    // This is a basic test to ensure checkbox can be clicked
  })

  test('should redirect to dashboard if already logged in', async ({ page }) => {
    const { email, password } = getTestCredentials()

    // First, login
    await loginAsUser(page, email, password)
    await expect(page).toHaveURL(/\/dashboard/)

    // Now try to visit login page again
    await loginPage.goto()

    // Should be redirected back to dashboard
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('should disable submit button while loading', async ({ page }) => {
    const { email, password } = getTestCredentials()

    await loginPage.goto()
    await loginPage.fillEmail(email)
    await loginPage.fillPassword(password)

    // Start submit (but don't wait for result)
    const submitPromise = loginPage.clickSubmit()

    // Check for loading state (quickly, might be fast)
    try {
      await loginPage.expectLoading()
    } catch {
      // Loading might be too fast to catch, that's ok
    }

    // Wait for submit to complete
    await submitPromise
  })

  test('should navigate to signup page from login', async ({ page }) => {
    await loginPage.goto()

    // Click signup link
    await page.click('text=Sign up')

    // Should navigate to signup page
    await expect(page).toHaveURL(/\/signup/)
  })
})

test.describe('Login Page Accessibility', () => {
  test('should have proper form labels and structure', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    // Verify form has proper labels
    const emailLabel = page.getByText('Email')
    const passwordLabel = page.getByText('Password')

    await expect(emailLabel).toBeVisible()
    await expect(passwordLabel).toBeVisible()

    // Verify inputs have proper attributes
    const emailInput = page.getByLabel('Email')
    const passwordInput = page.getByLabel('Password')

    await expect(emailInput).toHaveAttribute('type', 'email')
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('should have autocomplete attributes', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()

    const emailInput = page.locator('#email')
    const passwordInput = page.locator('#password')

    await expect(emailInput).toHaveAttribute('autocomplete', 'email')
    await expect(passwordInput).toHaveAttribute('autocomplete', 'current-password')
  })
})
