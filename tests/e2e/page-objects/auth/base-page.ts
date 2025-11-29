import type { Page } from '@playwright/test'

/**
 * BasePage - Base class for all Page Objects
 *
 * Provides common functionality that all page objects can inherit:
 * - Navigation helpers
 * - Common element interaction methods
 * - Wait utilities
 * - URL validation
 *
 * Usage:
 * ```typescript
 * export class LoginPage extends BasePage {
 *   constructor(page: Page) {
 *     super(page)
 *   }
 *
 *   async login(email: string, password: string) {
 *     await this.goto('/login')
 *     // ... login logic
 *   }
 * }
 * ```
 */
export class BasePage {
  constructor(protected page: Page) {}

  /**
   * Navigate to a specific path relative to baseURL
   * @param path - Path to navigate to (e.g., '/login', '/dashboard')
   */
  async goto(path: string) {
    await this.page.goto(path)
  }

  /**
   * Get the current URL
   */
  async getUrl(): Promise<string> {
    return this.page.url()
  }

  /**
   * Wait for a specific URL pattern
   * @param urlPattern - URL pattern to wait for (string or regex)
   */
  async waitForUrl(urlPattern: string | RegExp) {
    await this.page.waitForURL(urlPattern)
  }

  /**
   * Wait for the page to be fully loaded
   */
  async waitForLoad() {
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title()
  }

  /**
   * Reload the current page
   */
  async reload() {
    await this.page.reload()
  }

  /**
   * Go back in browser history
   */
  async goBack() {
    await this.page.goBack()
  }

  /**
   * Take a screenshot
   * @param name - Name for the screenshot file
   */
  async screenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true })
  }
}
