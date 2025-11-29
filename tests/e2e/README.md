# E2E Testing Guide

This directory contains End-to-End (E2E) tests for Better Call Buffet using Playwright.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Running Tests](#running-tests)
- [Environment Configuration](#environment-configuration)
- [Writing Tests](#writing-tests)
- [Page Object Pattern](#page-object-pattern)
- [Debugging Tests](#debugging-tests)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Overview

Our E2E testing strategy follows a simple, pragmatic approach:

1. **Local Testing**: Engineers run tests against any backend of their choice
2. **Daily Validation**: Automated tests run against demo environment via GitHub Actions

### Test Architecture

```
tests/e2e/
├── fixtures/          # Reusable test fixtures (auth helpers, etc.)
├── page-objects/      # Page Object Model implementations
│   └── auth/          # Authentication-related page objects
├── tests/             # Actual test files
│   └── auth/          # Authentication tests
└── README.md          # This file
```

## Quick Start

### 1. Install Playwright Browsers

```bash
npx playwright install --with-deps chromium
```

This installs Chromium browser (default for local development). For all browsers:

```bash
npx playwright install --with-deps
```

### 2. Configure Environment

Create or verify `.env.e2e.local`:

```bash
# .env.e2e.local
PLAYWRIGHT_BASE_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:8000/api/v1
E2E_TEST_EMAIL=test@local.com
E2E_TEST_PASSWORD=TestPassword123!
```

### 3. Start Your Backend

```bash
# In your backend directory
yarn dev  # or however you start your local backend
```

### 4. Run Tests

```bash
# From the frontend directory
yarn test:e2e
```

That's it! Tests will automatically start the frontend dev server.

## Running Tests

### All Available Commands

```bash
# Run all tests (headless mode, auto-starts frontend)
yarn test:e2e

# Run tests in UI mode (interactive, great for development)
yarn test:e2e:ui

# Run tests in debug mode (step through tests)
yarn test:e2e:debug

# Run tests in headed mode (see browser while running)
yarn test:e2e:headed

# View last test report
yarn test:e2e:report

# Run against demo environment
yarn test:e2e:demo
```

### Run Specific Tests

```bash
# Run only login tests
yarn test:e2e tests/e2e/tests/auth/login.spec.ts

# Run tests matching a pattern
yarn test:e2e --grep "should successfully login"

# Run tests in a specific browser
yarn test:e2e --project=firefox
```

### Run Tests in Watch Mode

```bash
# Watch mode (re-run on file changes)
yarn test:e2e --ui
```

## Environment Configuration

### Local Development (Default)

File: `.env.e2e.local` (gitignored)

```bash
PLAYWRIGHT_BASE_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:8000/api/v1
E2E_TEST_EMAIL=test@local.com
E2E_TEST_PASSWORD=TestPassword123!
```

**Use case**: Testing against your local backend

### Remote Backend Branch

Modify `.env.e2e.local` to point to remote backend:

```bash
PLAYWRIGHT_BASE_URL=http://localhost:5173
VITE_API_BASE_URL=https://api-staging-feature-xyz.com/api/v1  # Remote API
E2E_TEST_EMAIL=test@staging.com
E2E_TEST_PASSWORD=StagingPassword123!
```

**Use case**: Testing your frontend changes against a specific backend branch

### Demo Environment

File: `.env.e2e.demo` (gitignored, copy from `.env.e2e.demo.example`)

```bash
PLAYWRIGHT_BASE_URL=https://demo.better-call-buffet.com
VITE_API_BASE_URL=https://api-demo.better-call-buffet.com/api/v1
E2E_TEST_EMAIL=e2e-test@demo.com
E2E_TEST_PASSWORD=<from password manager>
```

**Use case**: Testing against production-like demo environment

## Writing Tests

### Test Structure

Follow this structure for new tests:

```typescript
import { test, expect } from '@playwright/test'
import { SomePage } from '../../page-objects/domain/some-page'

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Arrange - Setup test data and navigate
    const somePage = new SomePage(page)
    await somePage.goto()

    // Act - Perform actions
    await somePage.doSomething()

    // Assert - Verify expectations
    await somePage.expectSomething()
    await expect(page).toHaveURL(/expected-url/)
  })
})
```

### Using Authentication Fixtures

```typescript
import { test, expect } from '../../fixtures/auth.setup'

// This test starts with user already logged in
test('should view dashboard', async ({ authenticatedPage }) => {
  await expect(authenticatedPage).toHaveURL(/\/dashboard/)
  // ... rest of test
})
```

### Test Naming Convention

- Use descriptive names that explain the user journey
- Start with "should" for better readability
- Group related tests in `test.describe()` blocks

```typescript
test.describe('Account Creation', () => {
  test('should create checking account successfully', async ({ page }) => {
    // ...
  })

  test('should show validation error for empty account name', async ({ page }) => {
    // ...
  })
})
```

## Page Object Pattern

All page interactions should be encapsulated in Page Objects.

### Creating a New Page Object

```typescript
// page-objects/accounts/account-create-page.ts
import { expect, type Page } from '@playwright/test'
import { BasePage } from '../auth/base-page'

export class AccountCreatePage extends BasePage {
  private readonly path = '/accounts/create'

  private readonly selectors = {
    nameInput: '#account-name',
    typeSelect: '#account-type',
    submitButton: 'button[type="submit"]',
  }

  constructor(page: Page) {
    super(page)
  }

  async goto() {
    await super.goto(this.path)
  }

  async createAccount(name: string, type: 'CHECKING' | 'SAVINGS') {
    await this.page.fill(this.selectors.nameInput, name)
    await this.page.selectOption(this.selectors.typeSelect, type)
    await this.page.click(this.selectors.submitButton)
  }

  async expectSuccess() {
    await expect(this.page.getByText('Account created successfully')).toBeVisible()
  }
}
```

### Page Object Guidelines

1. **Inherit from BasePage**: Provides common functionality
2. **Define selectors at top**: Centralize locators for easy maintenance
3. **Action methods**: Methods that perform actions (fill, click, etc.)
4. **Assertion methods**: Methods that verify state (start with `expect`)
5. **Keep focused**: One page object per page/component

## Debugging Tests

### Debug Mode

```bash
yarn test:e2e:debug
```

- Opens Playwright Inspector
- Step through tests line by line
- Inspect page state at each step

### UI Mode (Recommended)

```bash
yarn test:e2e:ui
```

- Interactive test runner
- See tests run in real-time
- Time travel through test execution
- Inspect DOM and network calls

### Headed Mode

```bash
yarn test:e2e:headed
```

- Watch browser execute tests
- Useful for understanding flow
- Slower than headless mode

### Screenshots and Videos

On test failure, Playwright automatically captures:
- Screenshot of the failing moment
- Video recording of the test
- Trace file for detailed debugging

View artifacts:

```bash
yarn test:e2e:report
```

### Console Logging

Add debug logging in tests:

```typescript
test('debug example', async ({ page }) => {
  console.log('Current URL:', page.url())

  const text = await page.locator('.some-element').textContent()
  console.log('Element text:', text)
})
```

View logs in test output or HTML report.

## CI/CD Integration

### Daily Cron Job

Tests run automatically at 2 AM daily against demo environment via GitHub Actions.

**Workflow**: `.github/workflows/e2e-daily.yml`

**Environment Variables** (from GitHub Secrets):
- `E2E_DEMO_USER_EMAIL`
- `E2E_DEMO_USER_PASSWORD`
- `SLACK_WEBHOOK_URL`

### Viewing Test Results in CI

1. Go to GitHub Actions tab
2. Find "Daily E2E Tests" workflow
3. Click on latest run
4. Download "playwright-report" artifact
5. Extract and open `index.html` for detailed results

### Slack Notifications

On test failure, automated Slack notification sent to #engineering channel with link to results.

## Troubleshooting

### Tests failing locally but pass in CI

**Problem**: Environment differences

**Solution**:
- Check `.env.e2e.local` matches expected backend
- Ensure backend is running and accessible
- Verify test data exists in local database

### Browser not found error

**Problem**: Playwright browsers not installed

**Solution**:
```bash
npx playwright install --with-deps chromium
```

### Tests timeout waiting for elements

**Problem**: Selectors changed or page loading slowly

**Solution**:
- Check if page HTML structure changed (update page objects)
- Increase timeout in specific test: `{ timeout: 30000 }`
- Check network tab for slow API calls

### Cannot connect to backend

**Problem**: Backend not running or wrong URL

**Solution**:
- Start backend: `cd ../backend && yarn dev`
- Verify `VITE_API_BASE_URL` in `.env.e2e.local`
- Check backend is on correct port (default 8000)

### Authentication tests failing

**Problem**: Test user doesn't exist or wrong credentials

**Solution**:
- Create test user in local database
- Verify `E2E_TEST_EMAIL` and `E2E_TEST_PASSWORD` in `.env.e2e.local`
- Check backend authentication is working

### Flaky tests (pass sometimes, fail others)

**Problem**: Race conditions or timing issues

**Solution**:
- Use Playwright's auto-wait: `page.locator().click()` instead of manual waits
- Check for network requests completing: `await page.waitForResponse()`
- Use stable selectors (IDs, test-ids) instead of text or CSS classes

### Port already in use

**Problem**: Dev server already running or port conflict

**Solution**:
- Playwright config has `reuseExistingServer: true` - it will use existing server
- Or kill existing process on port 5173: `lsof -ti:5173 | xargs kill -9`

## Best Practices

### ✅ DO

- Use Page Object Model for all page interactions
- Write descriptive test names
- Test user flows, not implementation details
- Use Playwright's auto-wait features
- Run tests before committing changes
- Keep tests focused and independent

### ❌ DON'T

- Hardcode credentials or sensitive data
- Use `wait(1000)` - use proper waits instead
- Test every edge case in E2E (that's for unit tests)
- Make tests depend on each other
- Use overly specific CSS selectors (use test IDs when needed)

## Getting Help

- **Playwright Docs**: https://playwright.dev
- **Team Channel**: #engineering on Slack
- **ADR**: See `docs/decisions/015-adr-e2e-testing-architecture.md`

## Next Steps

After Phase 1 (current state):

**Phase 2**: Add more page objects and tests
- Account creation and management
- Transaction flows
- Statement upload
- Invoice management

**Phase 3**: GitHub Actions daily cron
- Set up demo environment
- Configure GitHub Secrets
- Slack notifications

**Phase 4**: Advanced features
- Visual regression testing
- Accessibility testing
- Performance monitoring
