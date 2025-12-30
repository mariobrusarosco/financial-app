# User Journeys Documentation

This directory contains detailed documentation of all user journeys in the Better Call Buffet financial management application.

## Overview

User journeys document the complete flow of how users interact with the application, from entry points through all steps and interactions. These documents serve as:

- **E2E Test Planning:** Foundation for writing comprehensive end-to-end tests
- **Feature Documentation:** Reference for understanding application functionality
- **UX Reference:** Guide for user experience and interface design
- **Development Guide:** Specification for implementing and maintaining features

## Documented Journeys

### 1. [Authentication](./01-authentication.md)

Complete authentication flow including login, signup, session management, and error handling.

**Key Features:**

- Login with email and password
- "Remember me" functionality
- Session persistence
- Error handling

### 2. [Dashboard Overview](./02-dashboard-overview.md)

Main landing page providing financial overview and navigation to all features.

**Key Features:**

- Financial summary cards
- Date range selection (Today, 30d, 3M, 6M, YTD, Custom)
- Navigation menu
- Personalized greeting

### 3. [Account Management](./03-account-management.md)

Complete account lifecycle: creating, viewing, and managing bank and investment accounts.

**Key Features:**

- Account list view
- Account detail pages with tabs (Overview, Statements, Expenses, Income, Credit Cards)
- Balance history charts
- Account transactions
- Create new accounts

### 4. [Transaction Management](./04-transaction-management.md)

Comprehensive transaction tracking: creating, editing, deleting, and categorizing transactions.

**Key Features:**

- Transaction list with filtering
- Create new transactions
- Edit existing transactions
- Delete transactions
- Bulk operations
- Category assignment

### 5. [Broker Management](./05-broker-management.md)

Managing investment brokers that hold investment accounts.

**Key Features:**

- Broker list view
- Create new brokers
- Edit brokers
- Delete brokers
- Broker-account relationships

### 6. [Vendor Management](./06-vendor-management.md)

Managing vendors (merchants, service providers) for expense tracking and categorization.

**Key Features:**

- Vendor list view
- Create new vendors
- Edit vendors
- Delete vendors
- Vendor-transaction relationships

### 7. [Subscription Management](./07-subscription-management.md)

Tracking and managing recurring subscriptions with automatic transaction generation.

**Key Features:**

- Subscription list view
- Create subscriptions with billing frequency
- Pause, cancel, resume subscriptions
- Automatic transaction generation
- Payment history tracking

### 8. [Category Management](./08-category-management.md)

Organizing transactions through categories for budgeting and analysis.

**Key Features:**

- Category list view
- Create custom categories
- Edit categories
- Delete categories
- Category assignment to transactions
- Category statistics

## Journey Relationships

```
Authentication
    ↓
Dashboard Overview
    ├──→ Account Management
    │       ├──→ Transaction Management
    │       └──→ Category Management
    ├──→ Transaction Management
    │       ├──→ Category Management
    │       └──→ Vendor Management
    ├──→ Broker Management
    │       └──→ Account Management
    ├──→ Vendor Management
    │       └──→ Transaction Management
    ├──→ Subscription Management
    │       ├──→ Vendor Management
    │       └──→ Transaction Management
    └──→ Category Management
            └──→ Transaction Management
```

## Using These Documents for E2E Testing

Each journey document provides:

1. **Entry Points:** Where the journey starts
2. **Step-by-Step Flow:** Detailed interaction steps
3. **UI Elements:** Specific buttons, forms, and components
4. **URL Patterns:** Routes and query parameters
5. **User Interactions:** Click actions, form submissions, navigation
6. **Success/Error States:** Expected outcomes

### Example: Creating E2E Test from Journey

From `03-account-management.md`:

```typescript
test('should create new account and view details', async ({ page }) => {
  // Step 1: Navigate to accounts
  await page.goto('/accounts');
  await expect(page.getByRole('heading', { name: 'Accounts' })).toBeVisible();

  // Step 2: Click Add button
  await page.getByRole('button', { name: 'Add' }).click();

  // Step 3: Fill form (based on journey documentation)
  await page.getByLabel('Account Name').fill('Test Account');
  // ... fill other fields

  // Step 4: Submit
  await page.getByRole('button', { name: 'Save' }).click();

  // Step 5: Verify success (based on journey documentation)
  await expect(page.getByText('Account created successfully')).toBeVisible();
});
```

## Maintenance

These documents should be updated when:

- New features are added
- UI/UX changes are made
- User flows are modified
- New interactions are introduced

## Related Documentation

- [E2E Testing Strategy](../guides/e2e-testing.md)
- [Testing Architecture](../../better-call-buffet/docs/guides/testing-architecture.md)
- [ADR: Playwright for E2E Testing](../decisions/015-adr-playwright-e2e.md)
