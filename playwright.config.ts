import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Determine which env file to load based on E2E_ENV environment variable
// Defaults to .env.e2e.local for local development
const envFile = process.env.E2E_ENV === 'demo'
  ? '.env.e2e.demo'
  : '.env.e2e.local'

// Load environment variables from the selected file
dotenv.config({ path: path.resolve(__dirname, envFile) })

/**
 * Playwright Configuration for Better Call Buffet E2E Tests
 *
 * Supports multiple environments:
 * - Local: yarn test:e2e (uses .env.e2e.local)
 * - Demo: E2E_ENV=demo yarn test:e2e (uses .env.e2e.demo)
 *
 * See tests/e2e/README.md for detailed usage instructions
 */
export default defineConfig({
  // Test directory location
  testDir: './tests/e2e/tests',

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI for stability
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['html'], // HTML report for local viewing
    ['list'], // Console output during test run
    ...(process.env.CI ? [['github'] as any] : []), // GitHub Actions annotations in CI
  ],

  // Shared settings for all the projects below
  use: {
    // Base URL from environment variable
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',

    // Collect trace on first retry for debugging
    trace: 'on-first-retry',

    // Screenshot only on failure
    screenshot: 'only-on-failure',

    // Video only when test fails
    video: 'retain-on-failure',

    // Maximum time for each action (e.g., click, fill)
    actionTimeout: 10000,

    // Maximum time to wait for navigation
    navigationTimeout: 30000,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Uncomment for mobile testing
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // Run local dev server before starting tests (only in local development)
  webServer: process.env.CI ? undefined : {
    command: 'yarn dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true, // Don't restart if already running
    timeout: 120000, // 2 minutes to start
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
