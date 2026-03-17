# E2E Testing Environment Setup Guide

**Purpose:** Configure Playwright to run tests against different environments (local, staging, production)

---

## Quick Start

### Test Against Localhost (Default)
```bash
# Uses .env.e2e.local (http://localhost:2000)
yarn test:e2e
```

### Test Against Staging/Demo URL
```bash
# Override with environment variable
PLAYWRIGHT_BASE_URL=https://better-call-buffet.mario.productions yarn test:e2e
```

### Test Against Production (Smoke Tests Only)
```bash
# Use production environment
PLAYWRIGHT_BASE_URL=https://app.bettercallbuffet.com yarn test:e2e --grep @smoke
```

---

## Environment Files

### 1. Local Development (Default)

**File:** `.env.e2e.local`

```bash
# Local Development Environment
# This file is used by default when running tests locally

# Playwright Configuration
PLAYWRIGHT_BASE_URL=http://localhost:2000

# API Configuration (your local backend)
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Test User Credentials (local test user)
E2E_TEST_EMAIL=test@local.com
E2E_TEST_PASSWORD=TestPassword123!

# Browser Configuration
PLAYWRIGHT_HEADLESS=false  # Show browser during development
PLAYWRIGHT_SLOW_MO=0       # No slow motion

# Optional: MSW for API mocking
E2E_USE_MSW=false
```

**Gitignore:** ✅ Already in `.gitignore`

---

### 2. Staging/Demo Environment

**File:** `.env.e2e.staging`

```bash
# Staging/Demo Environment
# Use: yarn test:e2e:staging

# Playwright Configuration
PLAYWRIGHT_BASE_URL=https://better-call-buffet.mario.productions

# API Configuration (staging backend)
VITE_API_BASE_URL=https://api-better-call-buffet.mariobrusarosco.com/api/v1

# Test User Credentials (demo credentials)
E2E_TEST_EMAIL=user@example.com
E2E_TEST_PASSWORD=password123

# Browser Configuration
PLAYWRIGHT_HEADLESS=true   # Run headless on CI
PLAYWRIGHT_SLOW_MO=0       # No slow motion

# Optional
E2E_USE_MSW=false
```

**Gitignore:** ✅ Add to `.gitignore` (contains credentials)

---

### 3. Production Environment (Smoke Tests Only)

**File:** `.env.e2e.production`

```bash
# Production Environment
# Use: yarn test:e2e:production
# WARNING: Only run smoke tests against production!

# Playwright Configuration
PLAYWRIGHT_BASE_URL=https://app.bettercallbuffet.com

# API Configuration (production backend)
VITE_API_BASE_URL=https://api.bettercallbuffet.com/api/v1

# Test User Credentials (read-only test account)
E2E_TEST_EMAIL=readonly-test@example.com
E2E_TEST_PASSWORD=SecureProductionPassword123!

# Browser Configuration
PLAYWRIGHT_HEADLESS=true
PLAYWRIGHT_SLOW_MO=0

# Safety: Only run smoke tests
E2E_SMOKE_ONLY=true
```

**Gitignore:** ✅ Add to `.gitignore` (contains production credentials)

---

## NPM Scripts

Add these to `package.json`:

```json
{
  "scripts": {
    "// E2E Testing": "",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "PLAYWRIGHT_HEADLESS=false playwright test",
    "test:e2e:debug": "playwright test --debug",

    "// Environment-specific": "",
    "test:e2e:local": "dotenv -e .env.e2e.local -- playwright test",
    "test:e2e:staging": "dotenv -e .env.e2e.staging -- playwright test",
    "test:e2e:production": "dotenv -e .env.e2e.production -- playwright test --grep @smoke",

    "// Specific test suites": "",
    "test:e2e:auth": "playwright test tests/e2e/auth",
    "test:e2e:smoke": "playwright test --grep @smoke",
    "test:e2e:critical": "playwright test --grep @critical",

    "// Reporting": "",
    "test:e2e:report": "playwright show-report",
    "test:e2e:codegen": "playwright codegen"
  }
}
```

**Install dotenv-cli:**
```bash
yarn add -D dotenv-cli
```

---

## Updated Playwright Config

**File:** `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Determine which environment file to use
const environment = process.env.E2E_ENV || 'local';
const envFile = `.env.e2e.${environment}`;

// Load environment-specific config
dotenv.config({ path: path.resolve(__dirname, envFile) });

// Fallback to .env.e2e.local if file doesn't exist
if (!process.env.PLAYWRIGHT_BASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '.env.e2e.local') });
}

export default defineConfig({
  testDir: './tests/e2e',

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
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
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
```

---

## Usage Examples

### Local Development (Default)

```bash
# Start your local dev server
yarn dev

# In another terminal, run tests against localhost
yarn test:e2e

# Or run with UI
yarn test:e2e:ui

# Or run in headed mode (see the browser)
yarn test:e2e:headed
```

**What happens:**
- Uses `.env.e2e.local`
- Points to `http://localhost:2000`
- Playwright auto-starts dev server if not running
- Runs against local backend API
- Browser visible (headless=false)

---

### Staging/Demo Environment

```bash
# Option 1: Use npm script
yarn test:e2e:staging

# Option 2: Set environment variable inline
E2E_ENV=staging yarn test:e2e

# Option 3: Override URL directly
PLAYWRIGHT_BASE_URL=https://better-call-buffet.mario.productions yarn test:e2e

# Run specific test against staging
PLAYWRIGHT_BASE_URL=https://better-call-buffet.mario.productions \
  yarn test:e2e tests/e2e/auth/login.spec.ts
```

**What happens:**
- Uses `.env.e2e.staging`
- Points to `https://better-call-buffet.mario.productions`
- Uses demo credentials (user@example.com)
- No local server started
- Runs headless

---

### Production (Smoke Tests Only)

```bash
# Only run smoke tests (tagged with @smoke)
yarn test:e2e:production

# Or manually with URL override
PLAYWRIGHT_BASE_URL=https://app.bettercallbuffet.com \
  yarn test:e2e --grep @smoke
```

**What happens:**
- Uses `.env.e2e.production`
- Points to production URL
- Uses read-only test account
- **ONLY runs tests tagged @smoke**
- Runs headless
- Extra careful (no data mutations)

---

## Test Tags for Environment Safety

Use tags to control which tests run in which environment:

**File:** `tests/e2e/auth/login.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  // ✅ Safe for all environments (read-only)
  test('@smoke @critical should login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', process.env.E2E_TEST_EMAIL!);
    await page.fill('[name="password"]', process.env.E2E_TEST_PASSWORD!);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/dashboard/);
  });

  // ⚠️ Local/Staging only (creates data)
  test('@local @staging should create new account', async ({ page }) => {
    // Skip on production
    test.skip(process.env.E2E_SMOKE_ONLY === 'true', 'Production: No data mutations');

    await page.goto('/accounts');
    await page.click('button:has-text("Add")');
    // ... create account
  });

  // 🔴 Local only (destructive)
  test('@local should delete account', async ({ page }) => {
    // Only run locally
    test.skip(
      !process.env.PLAYWRIGHT_BASE_URL?.includes('localhost'),
      'Only run locally - destructive operation'
    );

    await page.goto('/accounts');
    // ... delete account
  });
});
```

**Tag Categories:**
- `@smoke` - Read-only, safe for production
- `@critical` - Must pass for deployment
- `@local` - Only run on localhost
- `@staging` - Safe for staging
- `@production` - Explicitly allowed on production
- `@destructive` - Never run on staging/production

---

## CI/CD Configuration

### GitHub Actions (Multiple Environments)

**File:** `.github/workflows/e2e-tests.yml`

```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # Test against staging on PRs
  test-staging:
    name: E2E Tests (Staging)
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22.17.0

      - name: Enable Corepack
        run: corepack enable

      - name: Install dependencies
        run: yarn install

      - name: Install Playwright
        run: npx playwright install --with-deps chromium

      - name: Run E2E tests against Staging
        run: yarn test:e2e --project=chromium
        env:
          PLAYWRIGHT_BASE_URL: https://better-call-buffet.mario.productions
          E2E_TEST_EMAIL: ${{ secrets.STAGING_TEST_EMAIL }}
          E2E_TEST_PASSWORD: ${{ secrets.STAGING_TEST_PASSWORD }}
          CI: true

      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-staging
          path: playwright-report/

  # Smoke tests against production on main branch
  test-production-smoke:
    name: Smoke Tests (Production)
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22.17.0

      - name: Enable Corepack
        run: corepack enable

      - name: Install dependencies
        run: yarn install

      - name: Install Playwright
        run: npx playwright install --with-deps chromium

      - name: Run Smoke Tests against Production
        run: yarn test:e2e --project=chromium --grep @smoke
        env:
          PLAYWRIGHT_BASE_URL: https://app.bettercallbuffet.com
          E2E_TEST_EMAIL: ${{ secrets.PRODUCTION_TEST_EMAIL }}
          E2E_TEST_PASSWORD: ${{ secrets.PRODUCTION_TEST_PASSWORD }}
          E2E_SMOKE_ONLY: true
          CI: true

      - name: Upload test report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-production
          path: playwright-report/
```

### Netlify Deploy Preview

**File:** `netlify.toml`

```toml
[build]
  command = "yarn build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22.17.0"

# Run E2E tests on deploy previews
[context.deploy-preview]
  command = "yarn build"

[[plugins]]
  package = "@netlify/plugin-playwright"

  [plugins.inputs]
    # Run tests against the deploy preview URL
    baseURL = "$DEPLOY_PRIME_URL"

    # Only run critical tests on deploy previews
    grep = "@critical"

    # Test credentials
    [plugins.inputs.env]
      E2E_TEST_EMAIL = "user@example.com"
      E2E_TEST_PASSWORD = "password123"

# Production deploy - run smoke tests
[context.production]
  command = "yarn build && yarn test:e2e:production"

  [context.production.environment]
    E2E_TEST_EMAIL = "readonly-test@example.com"
    E2E_TEST_PASSWORD = "ProductionPassword"
    E2E_SMOKE_ONLY = "true"
```

---

## Environment-Specific Test Data

Create different test data per environment:

**File:** `tests/fixtures/test-data.ts`

```typescript
export function getTestData() {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:2000';

  // Local environment - use generated data
  if (baseURL.includes('localhost')) {
    return {
      user: {
        email: `test-${Date.now()}@local.com`,
        password: 'TestPassword123!',
      },
      account: {
        name: `Test Account ${Date.now()}`,
        initialBalance: '1000.00',
      },
    };
  }

  // Staging - use demo credentials
  if (baseURL.includes('mario.productions')) {
    return {
      user: {
        email: 'user@example.com',
        password: 'password123',
      },
      account: {
        name: 'Existing Demo Account',
        initialBalance: null, // Don't create new accounts
      },
    };
  }

  // Production - read-only
  return {
    user: {
      email: process.env.E2E_TEST_EMAIL!,
      password: process.env.E2E_TEST_PASSWORD!,
    },
    account: null, // Don't create accounts on production
  };
}
```

---

## Best Practices

### ✅ DO

1. **Use environment files** for different URLs
   ```bash
   yarn test:e2e:staging  # Uses .env.e2e.staging
   ```

2. **Tag tests appropriately**
   ```typescript
   test('@smoke @critical should login', ...)
   ```

3. **Skip destructive tests on staging/production**
   ```typescript
   test.skip(isProduction, 'Production: No mutations');
   ```

4. **Use different credentials per environment**
   - Local: test@local.com (auto-created)
   - Staging: user@example.com (demo account)
   - Production: readonly@example.com (read-only)

5. **Override URL on-the-fly when needed**
   ```bash
   PLAYWRIGHT_BASE_URL=https://new-feature.netlify.app yarn test:e2e
   ```

### ❌ DON'T

1. **Don't hardcode URLs in tests**
   ```typescript
   // ❌ Bad
   await page.goto('http://localhost:2000/login');

   // ✅ Good
   await page.goto('/login'); // Uses baseURL from config
   ```

2. **Don't run destructive tests on production**
   ```typescript
   // ❌ Bad - will delete production data!
   test('should delete account', async ({ page }) => {
     await page.goto('/accounts');
     await page.click('button[aria-label="Delete"]');
   });

   // ✅ Good - protected
   test('@local should delete account', async ({ page }) => {
     test.skip(!isLocal, 'Only run locally');
     // ...
   });
   ```

3. **Don't commit environment files with secrets**
   - ✅ `.env.e2e.local` (localhost, no secrets)
   - ❌ `.env.e2e.staging` (has demo credentials)
   - ❌ `.env.e2e.production` (has production credentials)

4. **Don't auto-start local server for remote URLs**
   ```typescript
   // Config handles this automatically
   webServer: process.env.PLAYWRIGHT_BASE_URL?.includes('localhost')
     ? { command: 'yarn dev', ... }
     : undefined
   ```

---

## Quick Reference Card

```bash
# ==========================================
# E2E Testing Environment Quick Reference
# ==========================================

# LOCAL (default)
yarn test:e2e                    # Run all tests locally
yarn test:e2e:ui                 # UI mode (interactive)
yarn test:e2e:headed             # Show browser

# STAGING
yarn test:e2e:staging            # Full suite on staging
E2E_ENV=staging yarn test:e2e    # Alternative method

# PRODUCTION (smoke only)
yarn test:e2e:production         # Smoke tests only
yarn test:e2e --grep @smoke      # Explicit smoke tests

# CUSTOM URL
PLAYWRIGHT_BASE_URL=https://my-preview.netlify.app yarn test:e2e

# SPECIFIC TESTS
yarn test:e2e tests/e2e/auth/login.spec.ts
yarn test:e2e --grep @critical
yarn test:e2e --grep @smoke

# DEBUGGING
yarn test:e2e:debug              # Debug mode
yarn test:e2e:report             # Show last report
npx playwright codegen $URL      # Record new tests

# CI/CD
# - PRs: Run against staging
# - Main: Run smoke tests on production
# - Deploy previews: Run @critical tests
```

---

## Troubleshooting

### Issue: "Cannot connect to localhost:2000"

**Solution:**
```bash
# Make sure dev server is running
yarn dev

# Or let Playwright start it automatically
yarn test:e2e  # Will auto-start if using localhost
```

---

### Issue: "Tests pass locally but fail on staging"

**Possible causes:**
1. Different test data
2. Different API responses
3. Timing issues (slower network)

**Solution:**
```bash
# Test against staging locally first
yarn test:e2e:staging

# Or override URL
PLAYWRIGHT_BASE_URL=https://better-call-buffet.mario.productions yarn test:e2e
```

---

### Issue: "Which environment am I testing against?"

**Check:**
```typescript
// In your test
console.log('Base URL:', process.env.PLAYWRIGHT_BASE_URL);
console.log('Test Email:', process.env.E2E_TEST_EMAIL);

// Or via test.use
test.use({
  baseURL: 'http://localhost:2000', // Shows in test output
});
```

---

## Summary

**Environment Setup:**
- ✅ **Local:** `.env.e2e.local` → `http://localhost:2000`
- ✅ **Staging:** `.env.e2e.staging` → `https://better-call-buffet.mario.productions`
- ✅ **Production:** `.env.e2e.production` → Production URL (smoke tests only)

**Running Tests:**
- ✅ **Default:** `yarn test:e2e` (uses local)
- ✅ **Staging:** `yarn test:e2e:staging`
- ✅ **Production:** `yarn test:e2e:production`
- ✅ **Custom:** `PLAYWRIGHT_BASE_URL=<url> yarn test:e2e`

**Safety:**
- ✅ Tag tests: `@smoke`, `@local`, `@staging`, `@critical`
- ✅ Skip destructive tests on remote environments
- ✅ Use read-only credentials on production
- ✅ Auto-start local server only for localhost

You can now run the same test suite against **any environment** with a single command! 🎉
