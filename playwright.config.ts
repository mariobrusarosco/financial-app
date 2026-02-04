import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Determine which environment file to use
const environment = process.env.E2E_ENV || 'local';
const envFile = `.env.e2e.${environment}`;

// Load environment-specific config
dotenv.config({ path: resolve(__dirname, envFile) });

// Fallback to .env.e2e.local if file doesn't exist
if (!process.env.PLAYWRIGHT_BASE_URL) {
  dotenv.config({ path: resolve(__dirname, '.env.e2e.local') });
}

export default defineConfig({
  // Test directory pattern - looks for test/e2e folders in each domain
  testDir: './src/domains',
  testMatch: '**/test/e2e/**/*.spec.ts',

  // Timeouts
  timeout: 30000,
  expect: { timeout: 5000 },

  // Parallel execution
  fullyParallel: !process.env.CI, // Sequential on CI for stability
  forbidOnly: !!process.env.CI,

  // Retries
  retries: process.env.CI ? 2 : 0,

  // Workers
  workers: process.env.CI ? 1 : undefined,

  // Reporter
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'], // Shows progress in terminal
    ...(process.env.CI ? [['github' as const]] : []),
  ],

  use: {
    // Base URL - can be overridden by PLAYWRIGHT_BASE_URL env var
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:2000',

    // Tracing
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',

    // Screenshots
    screenshot: 'only-on-failure',

    // Videos
    video: process.env.CI ? 'retain-on-failure' : 'off',

    // Browser context
    headless: process.env.PLAYWRIGHT_HEADLESS !== 'false',

    // Slow motion (for debugging)
    launchOptions: {
      slowMo: parseInt(process.env.PLAYWRIGHT_SLOW_MO || '0'),
    },

    // Navigation timeout
    navigationTimeout: 15000,
    actionTimeout: 10000,
  },

  projects: [
    // Setup project - runs ONCE to authenticate and save state
    {
      name: 'setup',
      testMatch: '**/test/e2e/setup/**/*.setup.ts',
    },

    // Desktop browsers - all use saved auth state
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Use saved authentication state
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Commented out for faster local development - uncomment for full cross-browser testing
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     storageState: 'playwright/.auth/user.json',
    //   },
    //   dependencies: ['setup'],
    // },

    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     storageState: 'playwright/.auth/user.json',
    //   },
    //   dependencies: ['setup'],
    // },

    // Mobile browsers (commented out for now - enable when needed)
    // {
    //   name: 'mobile-chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    //   dependencies: ['setup'],
    // },
    // {
    //   name: 'mobile-safari',
    //   use: {
    //     ...devices['iPhone 12'],
    //   },
    //   dependencies: ['setup'],
    // },
  ],

  // Web Server - only start for local testing
  webServer: process.env.PLAYWRIGHT_BASE_URL?.includes('localhost')
    ? {
        command: 'yarn dev',
        url: 'http://localhost:2000',
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
        stdout: 'pipe',
        stderr: 'pipe',
      }
    : undefined,
});
