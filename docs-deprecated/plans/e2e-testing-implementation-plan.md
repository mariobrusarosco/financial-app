# E2E Testing Implementation Plan - Better Call Buffet

**Date:** January 20, 2026
**Based on:** Product Exploration Report (2026-01-20)
**Framework:** Playwright
**Status:** Planning Phase

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Prerequisites](#prerequisites)
3. [Project Setup](#project-setup)
4. [Testing Architecture](#testing-architecture)
5. [Test Scenarios by Priority](#test-scenarios-by-priority)
6. [Page Object Models](#page-object-models)
7. [Test Data Strategy](#test-data-strategy)
8. [Implementation Roadmap](#implementation-roadmap)
9. [CI/CD Integration](#cicd-integration)
10. [Success Metrics](#success-metrics)

---

## Executive Summary

### Goal
Implement comprehensive E2E testing infrastructure for Better Call Buffet using Playwright to ensure product quality, catch regressions, and enable confident deployments.

### Scope
- **Phase 1:** Critical path testing (Authentication, Accounts, Transactions)
- **Phase 2:** Feature coverage (Cashflow, Installments, Subscriptions)
- **Phase 3:** Advanced scenarios (PDF upload, Vendors, Investments)
- **Phase 4:** Edge cases, performance, visual regression

### Timeline
- **Phase 1:** Week 1-2 (2 weeks)
- **Phase 2:** Week 3-4 (2 weeks)
- **Phase 3:** Week 5-6 (2 weeks)
- **Phase 4:** Week 7-8 (2 weeks)

### Resources Required
- 1 Developer (full-time)
- Playwright license (free, open-source)
- CI/CD credits (Netlify/GitHub Actions)
- Test environment (staging)

---

## Prerequisites

### Current State (From Exploration)
✅ Playwright installed (`@playwright/test` v1.57.0)
✅ Demo environment accessible
✅ Demo credentials available
✅ E2E environment config (`.env.e2e.local`)
❌ Playwright config missing
❌ No test files exist
❌ No page object models

### Requirements
- Node.js 22.17.0
- Yarn 3.8.7
- Browsers installed (Chromium, Firefox, WebKit)
- Access to staging environment
- Demo user credentials

---

## Project Setup

### Step 1: Initialize Playwright Configuration

**File:** `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load E2E environment variables
dotenv.config({ path: '.env.e2e.local' });

export default defineConfig({
  testDir: './tests/e2e',

  // Test timeout
  timeout: 30000,

  // Expect timeout
  expect: {
    timeout: 5000,
  },

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Workers
  workers: process.env.CI ? 1 : undefined,

  // Reporter
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  use: {
    // Base URL
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:2000',

    // Collect trace on failure
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Navigation timeout
    navigationTimeout: 15000,
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
    // Mobile viewports
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Run local dev server before tests
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:2000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

### Step 2: Directory Structure

```
tests/
├── e2e/
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── logout.spec.ts
│   ├── accounts/
│   │   ├── account-list.spec.ts
│   │   ├── account-detail.spec.ts
│   │   └── account-transactions.spec.ts
│   ├── transactions/
│   │   ├── transaction-list.spec.ts
│   │   ├── transaction-crud.spec.ts
│   │   └── transaction-filtering.spec.ts
│   ├── credit-cards/
│   │   ├── credit-card-management.spec.ts
│   │   └── invoice-upload.spec.ts
│   ├── cashflow/
│   │   └── cashflow-analytics.spec.ts
│   ├── installments/
│   │   └── installment-tracking.spec.ts
│   ├── subscriptions/
│   │   └── subscription-management.spec.ts
│   ├── vendors/
│   │   └── vendor-management.spec.ts
│   ├── investments/
│   │   └── investment-tracking.spec.ts
│   └── settings/
│       └── user-settings.spec.ts
├── fixtures/
│   ├── auth.fixture.ts
│   ├── test-data.ts
│   └── pdf-samples/
│       ├── sample-invoice-1.pdf
│       └── sample-invoice-2.pdf
└── page-objects/
    ├── base.page.ts
    ├── login.page.ts
    ├── dashboard.page.ts
    ├── accounts.page.ts
    ├── account-detail.page.ts
    ├── transactions.page.ts
    ├── cashflow.page.ts
    ├── installments.page.ts
    ├── subscriptions.page.ts
    ├── credit-card.page.ts
    ├── vendors.page.ts
    ├── investments.page.ts
    └── settings.page.ts
```

### Step 3: Base Test Setup

**File:** `tests/fixtures/auth.fixture.ts`

```typescript
import { test as base } from '@playwright/test';
import { LoginPage } from '../page-objects/login.page';

type AuthFixtures = {
  authenticatedPage: any;
  loginPage: LoginPage;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Navigate to login
    await page.goto('/login');

    // Login with demo credentials
    await page.fill('[name="email"]', process.env.E2E_TEST_EMAIL!);
    await page.fill('[name="password"]', process.env.E2E_TEST_PASSWORD!);
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard
    await page.waitForURL(/dashboard/);

    // Use the authenticated page
    await use(page);

    // Logout after test
    await page.click('[title="Settings"]');
    await page.click('button:has-text("Sign Out")');
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

export { expect } from '@playwright/test';
```

---

## Testing Architecture

### Design Principles

1. **Page Object Model (POM)**
   - Encapsulate page interactions
   - Reusable page methods
   - Maintainable test code

2. **Test Isolation**
   - Each test independent
   - Fresh state per test
   - No shared test data

3. **Data-Driven Testing**
   - External test data
   - Multiple scenarios from one test
   - CSV/JSON data sources

4. **Fixtures & Helpers**
   - Authenticated sessions
   - Test data generators
   - Common assertions

5. **Parallel Execution**
   - Tests run in parallel
   - Faster feedback
   - Proper test isolation required

---

## Test Scenarios by Priority

### Priority 1: Critical Path (Must Have) 🔴

#### 1.1 Authentication
**File:** `tests/e2e/auth/login.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');

    // Verify login page
    await expect(page.locator('h1')).toContainText('Better Call Buffet');
    await expect(page.locator('text=Demo Credentials')).toBeVisible();

    // Login
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Verify redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('h1')).toContainText('Hello, John Doe');
  });

  test('should fail login with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'invalid@example.com');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL(/login/);
  });

  test('should persist session with "Remember me"', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.check('input[type="checkbox"]'); // Remember me
    await page.click('button[type="submit"]');

    // Reload page
    await page.reload();

    // Should still be logged in
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/);

    // Logout
    await page.click('[title="Settings"]');
    await page.click('button:has-text("Sign Out")');

    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });
});
```

#### 1.2 Account Management
**File:** `tests/e2e/accounts/account-list.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Account List', () => {
  test('should display all account types', async ({ authenticatedPage: page }) => {
    await page.click('[title="Accounts"]');
    await expect(page).toHaveURL(/accounts/);

    // Verify account type groupings
    await expect(page.locator('h2:has-text("cash")')).toBeVisible();
    await expect(page.locator('h2:has-text("investment")')).toBeVisible();
    await expect(page.locator('h2:has-text("savings")')).toBeVisible();

    // Verify accounts
    await expect(page.locator('text=Chase Cash')).toBeVisible();
    await expect(page.locator('text=Wells Fargo Investments')).toBeVisible();
    await expect(page.locator('text=Citi Savings')).toBeVisible();
  });

  test('should navigate to account detail', async ({ authenticatedPage: page }) => {
    await page.goto('/accounts');

    await page.click('text=Chase Cash');

    await expect(page).toHaveURL(/accounts\/[a-f0-9-]+/);
    await expect(page.locator('h1')).toContainText('Chase Cash');
    await expect(page.locator('text=Balance')).toBeVisible();
  });
});
```

#### 1.3 Transaction Management
**File:** `tests/e2e/transactions/transaction-crud.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Transaction CRUD', () => {
  test('should add new transaction', async ({ authenticatedPage: page }) => {
    await page.goto('/transactions');

    // Click Add Transaction
    await page.click('button:has-text("Add Transaction")');

    // Fill form in drawer
    await page.fill('[name="description"]', 'E2E Test Transaction');
    await page.fill('[name="amount"]', '100.00');
    await page.selectOption('[name="category"]', 'General');
    await page.fill('[name="date"]', '2026-01-20');
    await page.click('button:has-text("Save")');

    // Verify transaction appears
    await expect(page.locator('text=E2E Test Transaction')).toBeVisible();
    await expect(page.locator('text=-$100.00')).toBeVisible();
  });

  test('should edit existing transaction', async ({ authenticatedPage: page }) => {
    await page.goto('/transactions');

    // Find and edit first transaction
    await page.locator('button[aria-label="Edit"]').first().click();

    // Change description
    await page.fill('[name="description"]', 'Updated Transaction');
    await page.click('button:has-text("Save")');

    // Verify update
    await expect(page.locator('text=Updated Transaction')).toBeVisible();
  });

  test('should delete transaction', async ({ authenticatedPage: page }) => {
    await page.goto('/transactions');

    // Get initial count
    const initialCount = await page.locator('text=/\\d+ transactions/').textContent();

    // Delete first transaction
    await page.locator('button[aria-label="Delete"]').first().click();
    await page.click('button:has-text("Confirm")');

    // Verify count decreased
    const newCount = await page.locator('text=/\\d+ transactions/').textContent();
    expect(parseInt(newCount!)).toBeLessThan(parseInt(initialCount!));
  });

  test('should filter transactions', async ({ authenticatedPage: page }) => {
    await page.goto('/transactions');

    // Open filters
    await page.click('button:has-text("Filters")');

    // Apply category filter
    await page.click('text=Category');
    await page.check('input[value="Fun"]');
    await page.click('button:has-text("Apply")');

    // Verify only Fun category transactions shown
    const transactions = await page.locator('[data-testid="transaction-item"]').all();
    for (const transaction of transactions) {
      await expect(transaction.locator('text=Fun')).toBeVisible();
    }
  });
});
```

### Priority 2: Core Features (Should Have) 🟡

#### 2.1 Cashflow Analytics
**File:** `tests/e2e/cashflow/cashflow-analytics.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Cashflow Analytics', () => {
  test('should display all cashflow metrics', async ({ authenticatedPage: page }) => {
    await page.click('[title="Cashflow"]');
    await expect(page).toHaveURL(/cashflow/);

    // Verify 4 metric cards
    await expect(page.locator('text=Total Income')).toBeVisible();
    await expect(page.locator('text=Total Expenses')).toBeVisible();
    await expect(page.locator('text=Net Cashflow')).toBeVisible();
    await expect(page.locator('text=Savings Rate')).toBeVisible();

    // Verify chart exists
    await expect(page.locator('text=Income vs Expenses')).toBeVisible();
  });

  test('should update metrics when date range changes', async ({ authenticatedPage: page }) => {
    await page.goto('/cashflow');

    // Get initial expense value
    const initialExpenses = await page.locator('text=Total Expenses').locator('..').locator('[class*="text"]').last().textContent();

    // Change date range to 30d
    await page.click('button:has-text("30d")');

    // Wait for update
    await page.waitForTimeout(1000);

    // Expenses may change
    const newExpenses = await page.locator('text=Total Expenses').locator('..').locator('[class*="text"]').last().textContent();

    // Verify URL updated
    await expect(page).toHaveURL(/from=.*&to=.*/);
  });

  test('should navigate to expense analysis', async ({ authenticatedPage: page }) => {
    await page.goto('/cashflow');

    await page.click('button:has-text("Analyze Expenses")');

    await expect(page).toHaveURL(/cashflow\/expenses/);
  });
});
```

#### 2.2 Installment Tracking
**File:** `tests/e2e/installments/installment-tracking.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Installment Tracking', () => {
  test('should display installment dashboard', async ({ authenticatedPage: page }) => {
    await page.click('[title="Installments"]');

    // Verify metrics
    await expect(page.locator('text=Due This Month')).toBeVisible();
    await expect(page.locator('text=Due Next Month')).toBeVisible();
    await expect(page.locator('text=Total Outstanding')).toBeVisible();
    await expect(page.locator('text=Active Plans')).toBeVisible();

    // Verify charts
    await expect(page.locator('text=Debt Burndown Forecast')).toBeVisible();
    await expect(page.locator('text=Spending by Category')).toBeVisible();
  });

  test('should display active installment plans', async ({ authenticatedPage: page }) => {
    await page.goto('/installments');

    // Verify plans exist
    await expect(page.locator('text=Mackbook')).toBeVisible();
    await expect(page.locator('text=Progress: 1/9')).toBeVisible();
    await expect(page.locator('text=11%')).toBeVisible();
  });

  test('should add new installment plan', async ({ authenticatedPage: page }) => {
    await page.goto('/installments');

    await page.click('button:has-text("Add Plan")');

    // Fill form
    await page.fill('[name="name"]', 'New iPhone');
    await page.fill('[name="totalAmount"]', '1200.00');
    await page.fill('[name="installments"]', '12');
    await page.selectOption('[name="category"]', 'Fun');
    await page.click('button:has-text("Save")');

    // Verify plan created
    await expect(page.locator('text=New iPhone')).toBeVisible();
    await expect(page.locator('text=0/12')).toBeVisible();
  });

  test('should expand installment plan details', async ({ authenticatedPage: page }) => {
    await page.goto('/installments');

    // Click to expand first plan
    await page.locator('[data-testid="installment-card"]').first().click();

    // Verify expanded view shows details
    await expect(page.locator('text=Payment History')).toBeVisible();
    await expect(page.locator('text=Next Payment')).toBeVisible();
  });
});
```

#### 2.3 Subscription Management
**File:** `tests/e2e/subscriptions/subscription-management.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Subscription Management', () => {
  test('should display subscription dashboard', async ({ authenticatedPage: page }) => {
    await page.click('[title="Subscriptions"]');

    // Verify metrics
    await expect(page.locator('text=Monthly Burn Rate')).toBeVisible();
    await expect(page.locator('text=Yearly Projection')).toBeVisible();
    await expect(page.locator('text=Due Next 30 Days')).toBeVisible();
    await expect(page.locator('text=Active Subscriptions')).toBeVisible();
  });

  test('should show empty state when no subscriptions', async ({ authenticatedPage: page }) => {
    await page.goto('/subscriptions');

    await expect(page.locator('text=No subscriptions found')).toBeVisible();
    await expect(page.locator('button:has-text("Add Subscription")')).toBeVisible();
  });

  test('should add new subscription', async ({ authenticatedPage: page }) => {
    await page.goto('/subscriptions');

    await page.click('button:has-text("Add Subscription")');

    // Fill form
    await page.fill('[name="name"]', 'Netflix');
    await page.fill('[name="amount"]', '15.99');
    await page.selectOption('[name="frequency"]', 'Monthly');
    await page.selectOption('[name="category"]', 'Entertainment');
    await page.fill('[name="nextBillingDate"]', '2026-02-01');
    await page.click('button:has-text("Save")');

    // Verify subscription created
    await expect(page.locator('text=Netflix')).toBeVisible();
    await expect(page.locator('text=$15.99')).toBeVisible();
  });
});
```

### Priority 3: Advanced Features (Could Have) 🟢

#### 3.1 Credit Card Invoice Upload
**File:** `tests/e2e/credit-cards/invoice-upload.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth.fixture';
import path from 'path';

test.describe('Credit Card Invoice Upload', () => {
  test('should upload PDF invoice successfully', async ({ authenticatedPage: page }) => {
    // Navigate to credit card invoices
    await page.goto('/accounts');
    await page.click('text=Chase Cash');
    await page.click('tab:has-text("Credit Cards")');
    await page.click('text=asdasdsa 2332');
    await page.click('tab:has-text("Invoices")');

    // Upload PDF
    const filePath = path.join(__dirname, '../fixtures/pdf-samples/sample-invoice-1.pdf');
    await page.setInputFiles('input[type="file"]', filePath);

    // Wait for processing
    await expect(page.locator('text=Processing')).toBeVisible();
    await expect(page.locator('text=Processing')).not.toBeVisible({ timeout: 30000 });

    // Verify success
    await expect(page.locator('text=Invoice uploaded successfully')).toBeVisible();

    // Verify invoice appears in history
    await expect(page.locator('text=sample-invoice-1.pdf')).toBeVisible();
  });

  test('should handle invalid PDF upload', async ({ authenticatedPage: page }) => {
    await page.goto('/accounts/[account-id]/credit-card/[card-id]/invoices');

    // Upload invalid file
    const filePath = path.join(__dirname, '../fixtures/invalid-file.txt');
    await page.setInputFiles('input[type="file"]', filePath);

    // Should show error
    await expect(page.locator('text=File must be a PDF')).toBeVisible();
  });
});
```

#### 3.2 Vendor Management
**File:** `tests/e2e/vendors/vendor-management.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Vendor Management', () => {
  test('should display vendor list', async ({ authenticatedPage: page }) => {
    await page.goto('/vendors');

    await expect(page.locator('h1')).toContainText('Vendors');
    await expect(page.locator('text=1 vendors found')).toBeVisible();
    await expect(page.locator('text=Apple')).toBeVisible();
  });

  test('should add new vendor', async ({ authenticatedPage: page }) => {
    await page.goto('/vendors');

    await page.click('button:has-text("Add Vendor")');

    await page.fill('[name="name"]', 'Amazon');
    await page.click('button:has-text("Save")');

    await expect(page.locator('text=Amazon')).toBeVisible();
    await expect(page.locator('text=2 vendors found')).toBeVisible();
  });

  test('should edit vendor', async ({ authenticatedPage: page }) => {
    await page.goto('/vendors');

    await page.click('button[aria-label="Edit"]').first();

    await page.fill('[name="name"]', 'Apple Inc.');
    await page.click('button:has-text("Save")');

    await expect(page.locator('text=Apple Inc.')).toBeVisible();
  });

  test('should delete vendor', async ({ authenticatedPage: page }) => {
    await page.goto('/vendors');

    await page.click('button[aria-label="Delete"]').first();
    await page.click('button:has-text("Confirm")');

    await expect(page.locator('text=Apple')).not.toBeVisible();
  });
});
```

#### 3.3 Investment Tracking
**File:** `tests/e2e/investments/investment-tracking.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Investment Tracking', () => {
  test('should display investment tabs', async ({ authenticatedPage: page }) => {
    await page.click('[title="Investments"]');

    await expect(page.locator('tab:has-text("Investment Accounts")')).toBeVisible();
    await expect(page.locator('tab:has-text("Portfolio Overview")')).toBeVisible();
    await expect(page.locator('tab:has-text("Balance History")')).toBeVisible();
    await expect(page.locator('tab:has-text("Data Input")')).toBeVisible();
  });

  test('should display investment accounts', async ({ authenticatedPage: page }) => {
    await page.goto('/investments');

    await expect(page.locator('text=Wells Fargo Investments')).toBeVisible();
    await expect(page.locator('text=$0.00')).toBeVisible();
  });

  test('should navigate to portfolio overview', async ({ authenticatedPage: page }) => {
    await page.goto('/investments');

    await page.click('tab:has-text("Portfolio Overview")');

    // Verify tab content
    await expect(page.locator('text=Asset Allocation')).toBeVisible();
  });
});
```

### Priority 4: Edge Cases & Visual (Nice to Have) ⚪

#### 4.1 Visual Regression
**File:** `tests/e2e/visual/visual-regression.spec.ts`

```typescript
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Visual Regression', () => {
  test('should match dashboard screenshot', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveScreenshot('dashboard.png');
  });

  test('should match accounts page screenshot', async ({ authenticatedPage: page }) => {
    await page.goto('/accounts');
    await expect(page).toHaveScreenshot('accounts.png');
  });

  test('should match dark theme screenshot', async ({ authenticatedPage: page }) => {
    await page.goto('/settings');
    await page.click('button:has-text("Toggle theme")');
    await page.goto('/dashboard');
    await expect(page).toHaveScreenshot('dashboard-dark.png');
  });
});
```

#### 4.2 Accessibility
**File:** `tests/e2e/accessibility/a11y.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('should have no accessibility violations on login', async ({ page }) => {
    await page.goto('/login');

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('should have no accessibility violations on dashboard', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/dashboard/);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
```

---

## Page Object Models

### Base Page Object

**File:** `tests/page-objects/base.page.ts`

```typescript
import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string) {
    await this.page.goto(path);
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async clickNavigation(section: string) {
    await this.page.click(`[title="${section}"]`);
  }

  async selectDateRange(range: 'Today' | '30d' | '3M' | '6M' | 'YTD') {
    await this.page.click(`button:has-text("${range}")`);
  }

  async openCustomDatePicker() {
    await this.page.click('button:has-text("Jan")'); // Date range button
  }
}
```

### Login Page Object

**File:** `tests/page-objects/login.page.ts`

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly signInButton: Locator;
  readonly signUpLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('[name="email"]');
    this.passwordInput = page.locator('[name="password"]');
    this.rememberMeCheckbox = page.locator('input[type="checkbox"]');
    this.signInButton = page.locator('button[type="submit"]');
    this.signUpLink = page.locator('a:has-text("Sign up")');
  }

  async login(email: string, password: string, rememberMe = false) {
    await this.goto('/login');
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    if (rememberMe) {
      await this.rememberMeCheckbox.check();
    }

    await this.signInButton.click();
    await this.page.waitForURL(/dashboard/);
  }

  async expectLoginPage() {
    await this.page.waitForURL(/login/);
  }
}
```

### Accounts Page Object

**File:** `tests/page-objects/accounts.page.ts`

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class AccountsPage extends BasePage {
  readonly addAccountButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addAccountButton = page.locator('button:has-text("Add")');
  }

  async gotoAccounts() {
    await this.goto('/accounts');
    await this.waitForPageLoad();
  }

  async getAccountsByType(type: 'cash' | 'investment' | 'savings') {
    const section = this.page.locator(`h2:has-text("${type}")`).locator('..');
    return section.locator('[data-testid="account-card"]');
  }

  async clickAccount(accountName: string) {
    await this.page.click(`text=${accountName}`);
  }

  async addAccount(name: string, type: string, initialBalance: string) {
    await this.addAccountButton.click();

    await this.page.fill('[name="name"]', name);
    await this.page.selectOption('[name="type"]', type);
    await this.page.fill('[name="initialBalance"]', initialBalance);
    await this.page.click('button:has-text("Save")');
  }
}
```

### Transactions Page Object

**File:** `tests/page-objects/transactions.page.ts`

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class TransactionsPage extends BasePage {
  readonly addTransactionButton: Locator;
  readonly manageCategoriesButton: Locator;
  readonly filtersButton: Locator;
  readonly clearFiltersButton: Locator;
  readonly selectAllCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    this.addTransactionButton = page.locator('button:has-text("Add Transaction")');
    this.manageCategoriesButton = page.locator('button:has-text("Manage Categories")');
    this.filtersButton = page.locator('button:has-text("Filters")');
    this.clearFiltersButton = page.locator('button:has-text("Clear filters")');
    this.selectAllCheckbox = page.locator('button:has-text("Select All")');
  }

  async gotoTransactions() {
    await this.goto('/transactions');
    await this.waitForPageLoad();
  }

  async getTransactionCount() {
    const text = await this.page.locator('text=/\\d+ transactions/').textContent();
    return parseInt(text!.match(/\d+/)![0]);
  }

  async addTransaction(description: string, amount: string, category: string, date: string) {
    await this.addTransactionButton.click();

    await this.page.fill('[name="description"]', description);
    await this.page.fill('[name="amount"]', amount);
    await this.page.selectOption('[name="category"]', category);
    await this.page.fill('[name="date"]', date);
    await this.page.click('button:has-text("Save")');
  }

  async filterByCategory(category: string) {
    await this.filtersButton.click();
    await this.page.click('text=Category');
    await this.page.check(`input[value="${category}"]`);
    await this.page.click('button:has-text("Apply")');
  }

  async getTransactionByDescription(description: string) {
    return this.page.locator(`text=${description}`).locator('..');
  }

  async editTransaction(description: string, newDescription: string) {
    const transaction = await this.getTransactionByDescription(description);
    await transaction.locator('button[aria-label="Edit"]').click();

    await this.page.fill('[name="description"]', newDescription);
    await this.page.click('button:has-text("Save")');
  }

  async deleteTransaction(description: string) {
    const transaction = await this.getTransactionByDescription(description);
    await transaction.locator('button[aria-label="Delete"]').click();
    await this.page.click('button:has-text("Confirm")');
  }
}
```

---

## Test Data Strategy

### Environment Variables

**File:** `.env.e2e.local`

```bash
# Playwright Configuration
PLAYWRIGHT_BASE_URL=http://localhost:2000

# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Test User Credentials
E2E_TEST_EMAIL=user@example.com
E2E_TEST_PASSWORD=password123

# Optional: Use MSW for API mocking
E2E_USE_MSW=false
```

### Test Data Generators

**File:** `tests/fixtures/test-data.ts`

```typescript
export const testData = {
  users: {
    demo: {
      email: 'user@example.com',
      password: 'password123',
      name: 'John Doe',
    },
  },

  accounts: {
    cash: {
      name: 'Test Cash Account',
      type: 'cash',
      initialBalance: '1000.00',
      currency: 'USD',
    },
    savings: {
      name: 'Test Savings Account',
      type: 'savings',
      initialBalance: '5000.00',
      currency: 'USD',
    },
  },

  transactions: {
    expense: {
      description: 'Test Expense',
      amount: '-50.00',
      category: 'General',
      date: '2026-01-20',
    },
    income: {
      description: 'Test Income',
      amount: '1000.00',
      category: 'Salary',
      date: '2026-01-20',
    },
  },

  subscriptions: {
    monthly: {
      name: 'Test Subscription',
      amount: '9.99',
      frequency: 'Monthly',
      category: 'Entertainment',
      nextBillingDate: '2026-02-01',
    },
  },

  installments: {
    laptop: {
      name: 'MacBook Pro',
      totalAmount: '2400.00',
      installments: '12',
      category: 'Technology',
      startDate: '2026-01-15',
    },
  },
};

export function generateRandomEmail() {
  return `test-${Date.now()}@example.com`;
}

export function generateRandomTransaction() {
  return {
    description: `Transaction ${Date.now()}`,
    amount: (Math.random() * 1000).toFixed(2),
    category: 'General',
    date: new Date().toISOString().split('T')[0],
  };
}
```

### PDF Sample Files

Create sample PDF files for testing:

- `tests/fixtures/pdf-samples/sample-invoice-1.pdf` - Valid credit card invoice
- `tests/fixtures/pdf-samples/sample-invoice-2.pdf` - Another valid invoice
- `tests/fixtures/pdf-samples/invalid-format.pdf` - Malformed PDF
- `tests/fixtures/invalid-file.txt` - Non-PDF file

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

**Week 1: Setup**
- [ ] Create `playwright.config.ts`
- [ ] Set up directory structure
- [ ] Create base page object
- [ ] Set up authentication fixture
- [ ] Configure CI/CD environment variables
- [ ] Install browser dependencies

**Week 2: Critical Path Tests**
- [ ] Write authentication tests (login, logout)
- [ ] Write account list tests
- [ ] Write account detail tests
- [ ] Write transaction CRUD tests
- [ ] Set up test data generators
- [ ] Create first test report

**Deliverables:**
- ✅ Playwright fully configured
- ✅ 10+ critical path tests passing
- ✅ CI/CD running tests on every PR
- ✅ Test coverage report

---

### Phase 2: Core Features (Week 3-4)

**Week 3: Analytics & Tracking**
- [ ] Write cashflow analytics tests
- [ ] Write installment tracking tests
- [ ] Create cashflow page object
- [ ] Create installments page object
- [ ] Add visual snapshot tests

**Week 4: Subscriptions & Filtering**
- [ ] Write subscription management tests
- [ ] Write advanced filtering tests
- [ ] Write bulk operations tests
- [ ] Create subscriptions page object
- [ ] Add date range filtering tests

**Deliverables:**
- ✅ 20+ feature tests passing
- ✅ Page objects for all main sections
- ✅ Visual regression baseline established
- ✅ Test coverage > 60%

---

### Phase 3: Advanced Features (Week 5-6)

**Week 5: File Upload & Vendors**
- [ ] Write PDF invoice upload tests
- [ ] Write vendor management tests
- [ ] Create sample PDF fixtures
- [ ] Create credit card page object
- [ ] Create vendors page object

**Week 6: Investments & Settings**
- [ ] Write investment tracking tests
- [ ] Write settings management tests
- [ ] Write theme toggle tests
- [ ] Create investments page object
- [ ] Create settings page object

**Deliverables:**
- ✅ 30+ tests covering advanced features
- ✅ File upload testing working
- ✅ Complete page object coverage
- ✅ Test coverage > 75%

---

### Phase 4: Edge Cases & Polish (Week 7-8)

**Week 7: Edge Cases**
- [ ] Write error handling tests
- [ ] Write boundary condition tests
- [ ] Write negative scenario tests
- [ ] Add network failure simulations
- [ ] Add slow connection tests

**Week 8: Performance & Accessibility**
- [ ] Write performance tests
- [ ] Write accessibility tests (axe-core)
- [ ] Add mobile viewport tests
- [ ] Add cross-browser tests
- [ ] Final test suite optimization

**Deliverables:**
- ✅ 40+ comprehensive tests
- ✅ Edge cases covered
- ✅ Accessibility compliance verified
- ✅ Test coverage > 85%
- ✅ Performance benchmarks established

---

## CI/CD Integration

### GitHub Actions Workflow

**File:** `.github/workflows/e2e-tests.yml`

```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    strategy:
      matrix:
        browser: [chromium, firefox, webkit]

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

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps ${{ matrix.browser }}

      - name: Run E2E tests
        run: npx playwright test --project=${{ matrix.browser }}
        env:
          PLAYWRIGHT_BASE_URL: ${{ secrets.STAGING_URL }}
          E2E_TEST_EMAIL: ${{ secrets.E2E_TEST_EMAIL }}
          E2E_TEST_PASSWORD: ${{ secrets.E2E_TEST_PASSWORD }}

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-${{ matrix.browser }}
          path: playwright-report/
          retention-days: 30

      - name: Upload test videos
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: test-videos-${{ matrix.browser }}
          path: test-results/
          retention-days: 7
```

### Netlify Deploy Preview Integration

**File:** `netlify.toml`

```toml
[build]
  command = "yarn build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22.17.0"

[[plugins]]
  package = "@netlify/plugin-playwright"

[context.deploy-preview]
  command = "yarn build && yarn playwright test"

[context.deploy-preview.environment]
  PLAYWRIGHT_BASE_URL = "$DEPLOY_PRIME_URL"
```

### Test Reporting

**Install:**
```bash
yarn add -D @playwright/test playwright-html-reporter
```

**Configure reporter in `playwright.config.ts`:**
```typescript
reporter: [
  ['html', { outputFolder: 'playwright-report' }],
  ['json', { outputFile: 'test-results/results.json' }],
  ['junit', { outputFile: 'test-results/junit.xml' }],
  ['github'], // GitHub Actions annotations
],
```

---

## Success Metrics

### Coverage Goals

| Phase | Test Count | Coverage % | Time to Run |
|-------|-----------|-----------|-------------|
| Phase 1 | 10+ | 40% | < 5 min |
| Phase 2 | 20+ | 60% | < 10 min |
| Phase 3 | 30+ | 75% | < 15 min |
| Phase 4 | 40+ | 85% | < 20 min |

### Quality Metrics

**Flakiness:**
- Target: < 5% flaky tests
- Measure: Retries needed / Total runs
- Action: Investigate and fix flaky tests weekly

**Execution Time:**
- Target: < 20 minutes for full suite
- Measure: Total test duration
- Action: Parallelize and optimize slow tests

**Maintenance:**
- Target: < 2 hours/week on test maintenance
- Measure: Time spent fixing broken tests
- Action: Improve page objects and fixtures

**Bug Detection:**
- Target: Catch 90% of bugs before production
- Measure: Bugs found in E2E vs production
- Action: Add tests for every production bug

### ROI Metrics

**Time Saved:**
- Manual testing time: 4 hours per release
- Automated testing time: 20 minutes per release
- Savings: 3.67 hours per release
- Releases per month: 8
- **Total savings: ~30 hours/month**

**Quality Improvement:**
- Production bugs before E2E: ~10 per month
- Production bugs after E2E: ~3 per month
- **Bug reduction: 70%**

**Confidence:**
- Deployment anxiety: High → Low
- Refactoring confidence: Low → High
- Feature velocity: +25%

---

## Maintenance Plan

### Weekly Tasks
- [ ] Review failed tests in CI
- [ ] Fix any flaky tests
- [ ] Update test data if needed
- [ ] Review test execution times

### Monthly Tasks
- [ ] Review test coverage gaps
- [ ] Add tests for new features
- [ ] Refactor page objects
- [ ] Update dependencies
- [ ] Review visual baselines

### Quarterly Tasks
- [ ] Full test suite audit
- [ ] Performance optimization
- [ ] Documentation updates
- [ ] Team training session

---

## Training & Documentation

### Developer Onboarding

**Day 1: Setup**
- Install Playwright
- Run existing tests
- Understand page objects
- Review test patterns

**Day 2: Writing Tests**
- Write first test
- Use page objects
- Add test data
- Debug failing test

**Day 3: Advanced Topics**
- Visual testing
- Accessibility testing
- Performance testing
- CI/CD integration

### Documentation

**Required Docs:**
1. **E2E Testing Guide** - How to write tests
2. **Page Object Guide** - How to create page objects
3. **Debugging Guide** - How to debug failing tests
4. **CI/CD Guide** - How tests run in CI
5. **Troubleshooting Guide** - Common issues and solutions

---

## Appendix A: Quick Reference

### Common Commands

```bash
# Run all tests
yarn test:e2e

# Run in UI mode
yarn test:e2e:ui

# Run specific test file
npx playwright test tests/e2e/auth/login.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Generate tests with Codegen
npx playwright codegen http://localhost:2000

# Show test report
npx playwright show-report

# Update visual snapshots
npx playwright test --update-snapshots

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Useful Playwright Methods

```typescript
// Navigation
await page.goto('/path');
await page.waitForURL(/pattern/);
await page.reload();

// Interaction
await page.click('button');
await page.fill('input', 'value');
await page.check('checkbox');
await page.selectOption('select', 'value');

// Assertions
await expect(page).toHaveURL(/pattern/);
await expect(locator).toBeVisible();
await expect(locator).toContainText('text');
await expect(locator).toHaveCount(5);

// Waiting
await page.waitForSelector('selector');
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1000);

// Screenshots
await page.screenshot({ path: 'screenshot.png' });
await expect(page).toHaveScreenshot('name.png');
```

---

## Appendix B: Troubleshooting

### Common Issues

**Issue:** Tests fail in CI but pass locally
- **Cause:** Timing issues, different environment
- **Solution:** Add proper waits, check environment variables

**Issue:** Flaky tests
- **Cause:** Race conditions, external dependencies
- **Solution:** Use explicit waits, mock external APIs

**Issue:** Slow tests
- **Cause:** Too many tests running sequentially, slow selectors
- **Solution:** Parallelize, optimize selectors, reduce waits

**Issue:** Element not found
- **Cause:** Wrong selector, element not rendered yet
- **Solution:** Check selector, add wait for element

**Issue:** Screenshot differences
- **Cause:** Font rendering, timing, dynamic content
- **Solution:** Mask dynamic content, increase threshold

---

## Appendix C: Resources

### Official Documentation
- [Playwright Docs](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)

### Community Resources
- [Playwright Discord](https://discord.com/invite/playwright-807756831384403968)
- [GitHub Discussions](https://github.com/microsoft/playwright/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/playwright)

### Internal Resources
- [Product Exploration Report](./product-exploration-report-2026-01-20.md)
- [Testing Guide](../guides/testing.md)
- [TanStack Start Guide](../guides/tanstack-start.md)

---

**Plan End**

*This E2E testing implementation plan is based on the comprehensive product exploration conducted on January 20, 2026. The plan provides a structured approach to implementing Playwright E2E tests for Better Call Buffet, with clear priorities, timelines, and success metrics.*

*For questions or updates, please refer to the product exploration report or contact the development team.*
