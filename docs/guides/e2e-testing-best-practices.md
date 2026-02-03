# E2E Testing Best Practices

**For:** Developers & AI Assistants (Claude Code)
**Purpose:** Guidelines for writing maintainable, reliable E2E tests with Playwright

---

## ⚠️ #1 CRITICAL Rule: NEVER Use `waitForTimeout()` as a Workaround

### ❌ The Worst Anti-Pattern in E2E Testing

```typescript
// ❌ ABSOLUTELY NEVER DO THIS
await page.waitForTimeout(2000); // Arbitrary wait
await page.click('button');

// ❌ NEVER - Hoping element loads in 5 seconds
await page.waitForTimeout(5000);
expect(await page.textContent('.result')).toBe('Success');

// ❌ NEVER - "Fixing" flaky tests with longer waits
await page.waitForTimeout(10000); // This doesn't fix anything!
```

**Why this is terrible:**
- **Flaky:** Sometimes too short (test fails), sometimes too long (wastes time)
- **Slow:** Wastes time waiting when element is already ready
- **Hides bugs:** Masks race conditions instead of fixing them
- **Unreliable:** Doesn't guarantee element is actually ready
- **Breaks on slower machines/CI:** What works locally fails in CI

### ✅ The Correct Approach: Wait for Specific Conditions

```typescript
// ✅ GOOD - Wait for element to be visible
await expect(page.getByTestId('account-card')).toBeVisible();
await page.getByTestId('account-card').click();

// ✅ GOOD - Playwright actions auto-wait
await page.getByTestId('submit-button').click(); // Auto-waits for actionable state

// ✅ GOOD - Wait for specific network response
const responsePromise = page.waitForResponse(
  response => response.url().includes('/api/accounts') && response.status() === 200
);
await page.getByTestId('refresh-button').click();
await responsePromise;

// ✅ GOOD - Wait for URL change
await page.getByTestId('login-button').click();
await page.waitForURL(/\/dashboard/);
```

### Test-Level Timeouts vs Arbitrary Waits

```typescript
// ❌ BAD - Arbitrary timeout workaround
test('should load accounts', async ({ page }) => {
  await page.goto('/accounts');
  await page.waitForTimeout(3000); // Hope it loads in 3s
  expect(await page.isVisible('[data-testid="accounts-list"]')).toBe(true);
});

// ✅ GOOD - Set test timeout, wait for specific element
test('should load accounts', async ({ page }) => {
  test.setTimeout(30000); // Allow 30s for this specific test

  await page.goto('/accounts');

  // Wait for specific element with explicit timeout
  await expect(page.getByTestId('accounts-list')).toBeVisible({ timeout: 10000 });
});
```

---

## 🎯 #2 Rule: Use `data-testid` - Don't Struggle with CSS Selectors

### ⚠️ The Problem with CSS Selectors

**DON'T do this:**

```typescript
// ❌ BAD - Fragile CSS selectors
await page.click('div.flex.items-center > button.bg-primary');
await expect(page.locator('ul > li:nth-child(3) > span.text-sm')).toBeVisible();
await page.fill('form > div:nth-child(2) > input[type="text"]');
```

**Why it's bad:**
- ❌ Breaks when styles change
- ❌ Breaks when HTML structure changes
- ❌ Hard to read and maintain
- ❌ Not semantic (doesn't tell you WHAT you're clicking)
- ❌ Wastes time debugging selector issues

---

### ✅ The Solution: Add `data-testid` Attributes

**Instead, add `data-testid` to the component:**

**Step 1:** Open the component file (you have access to the codebase!)

```tsx
// src/domains/accounts/components/account-card.tsx

export function AccountCard({ account }) {
  return (
    <div className="flex items-center justify-between p-4">
      <div>
        <h3>{account.name}</h3>
        <p>{account.type}</p>
      </div>
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
```

**Step 2:** Add `data-testid` attributes

```tsx
// src/domains/accounts/components/account-card.tsx

export function AccountCard({ account }) {
  return (
    <div
      className="flex items-center justify-between p-4"
      data-testid="account-card"
    >
      <div>
        <h3 data-testid="account-name">{account.name}</h3>
        <p data-testid="account-type">{account.type}</p>
      </div>
      <button
        onClick={handleEdit}
        data-testid="account-edit-button"
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        data-testid="account-delete-button"
      >
        Delete
      </button>
    </div>
  );
}
```

**Step 3:** Use in tests

```typescript
// tests/e2e/accounts/account-card.spec.ts

// ✅ GOOD - Clear, semantic, reliable
await page.click('[data-testid="account-edit-button"]');
await expect(page.locator('[data-testid="account-name"]')).toHaveText('Chase Cash');
await page.click('[data-testid="account-delete-button"]');
```

---

## 🔄 Hot Reload Workflow (Local Testing)

This approach is **especially powerful** when testing locally:

### The Workflow

1. **Write test with missing testid**
   ```typescript
   // Test fails: Can't find element
   await page.click('[data-testid="add-transaction-button"]');
   ```

2. **Open component, add testid**
   ```tsx
   // src/domains/transactions/components/transaction-header.tsx
   <button data-testid="add-transaction-button">Add Transaction</button>
   ```

3. **Hot reload updates DOM automatically** ⚡
   - No need to restart dev server
   - No need to refresh browser manually
   - Component updates instantly in your running test browser

4. **Re-run test - now it passes!** ✅
   ```bash
   yarn test:e2e tests/e2e/transactions/add-transaction.spec.ts
   ```

### Real Example

```typescript
// 1. Write test first
test('should add new transaction', async ({ page }) => {
  await page.goto('/transactions');

  // This will fail initially - element not found
  await page.click('[data-testid="add-transaction-button"]');

  await page.fill('[data-testid="transaction-description"]', 'Test');
  await page.fill('[data-testid="transaction-amount"]', '100');
  await page.click('[data-testid="save-transaction-button"]');

  await expect(page.locator('[data-testid="transaction-list"]'))
    .toContainText('Test');
});

// 2. Open components and add data-testid attributes
// 3. Hot reload kicks in
// 4. Re-run test - passes!
```

---

## 🎨 Naming Conventions for `data-testid`

### Format: `{component}-{element}-{type}`

**Examples:**

```tsx
// Buttons
data-testid="add-account-button"
data-testid="save-transaction-button"
data-testid="delete-subscription-button"

// Form inputs
data-testid="email-input"
data-testid="password-input"
data-testid="account-name-input"

// Display elements
data-testid="account-balance"
data-testid="transaction-list"
data-testid="cashflow-chart"

// Cards/containers
data-testid="account-card"
data-testid="transaction-item"
data-testid="installment-plan-card"

// Navigation
data-testid="nav-accounts"
data-testid="nav-transactions"
data-testid="settings-menu"
```

### Naming Rules

1. **Lowercase with hyphens** (kebab-case)
   - ✅ `add-transaction-button`
   - ❌ `addTransactionButton`
   - ❌ `AddTransactionButton`

2. **Descriptive and specific**
   - ✅ `email-input`
   - ❌ `input1`
   - ❌ `field`

3. **Include element type when ambiguous**
   - ✅ `save-button`
   - ✅ `save-link`
   - ✅ `save-icon`

4. **For lists, use singular for items**
   - ✅ Container: `transaction-list`
   - ✅ Item: `transaction-item`
   - ✅ Or: `transaction-item-${id}`

---

## 📝 Where to Add `data-testid`

### ✅ Always Add to:

1. **Interactive elements**
   - Buttons
   - Links
   - Form inputs
   - Dropdowns/selects
   - Checkboxes/radios

2. **Critical display elements**
   - Main headings
   - Important data (balances, totals)
   - Status indicators
   - Error messages

3. **List items and cards**
   - Account cards
   - Transaction rows
   - Installment plans
   - Subscription items

4. **Navigation elements**
   - Sidebar links
   - Tab buttons
   - Breadcrumbs

### ⚠️ Don't Overdo It

**You DON'T need testid on every single element:**

```tsx
// ❌ Too much
<div data-testid="container">
  <div data-testid="wrapper">
    <div data-testid="inner-wrapper">
      <span data-testid="label">Name:</span>
      <span data-testid="value">{name}</span>
    </div>
  </div>
</div>

// ✅ Just right
<div>
  <div>
    <div data-testid="account-name">
      <span>Name:</span>
      <span>{name}</span>
    </div>
  </div>
</div>
```

**Rule of thumb:** Add `data-testid` to elements you'll interact with or assert on in tests.

---

## 🔍 Finding Elements in Tests

### Option 1: `getByTestId` (Recommended)

```typescript
// Best practice - built-in Playwright method
await page.getByTestId('add-transaction-button').click();
await expect(page.getByTestId('account-balance')).toHaveText('$1,000.00');
```

### Option 2: Attribute selector

```typescript
// Also fine - explicit selector
await page.locator('[data-testid="add-transaction-button"]').click();
await expect(page.locator('[data-testid="account-balance"]')).toHaveText('$1,000.00');
```

### Option 3: Helper function (for consistency)

```typescript
// tests/helpers/selectors.ts
export function testId(id: string) {
  return `[data-testid="${id}"]`;
}

// In tests
await page.click(testId('add-transaction-button'));
await expect(page.locator(testId('account-balance'))).toHaveText('$1,000.00');
```

---

## 🛠️ When CSS Selectors ARE Okay

Sometimes you **should** use other selectors:

### 1. **Semantic HTML / ARIA roles** (Preferred when available)

```typescript
// ✅ Great for accessibility testing
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByRole('heading', { name: 'Dashboard' }).isVisible();
await page.getByLabel('Email').fill('user@example.com');
```

### 2. **Text content** (for user-facing text)

```typescript
// ✅ Good for checking visible text
await expect(page.getByText('Welcome back, John')).toBeVisible();
await page.click('text=Add Transaction');
```

### 3. **Placeholder text** (for form inputs)

```typescript
// ✅ Fine for simple forms
await page.fill('input[placeholder="Enter amount"]', '100');
```

### Decision Tree

```
Need to select an element?
│
├─ Is it a standard HTML element with clear semantics?
│  └─ YES → Use getByRole(), getByLabel(), or getByText()
│
├─ Is it a custom component or complex element?
│  └─ YES → Add data-testid
│
└─ Is the CSS selector stable and semantic?
   └─ MAYBE → Use CSS, but data-testid is safer
```

---

## 🚀 Advanced Patterns

### Dynamic Test IDs for List Items

```tsx
// For lists with many items
export function TransactionRow({ transaction }) {
  return (
    <tr data-testid={`transaction-item-${transaction.id}`}>
      <td data-testid={`transaction-description-${transaction.id}`}>
        {transaction.description}
      </td>
      <td data-testid={`transaction-amount-${transaction.id}`}>
        {transaction.amount}
      </td>
      <button
        data-testid={`transaction-delete-${transaction.id}`}
        onClick={() => handleDelete(transaction.id)}
      >
        Delete
      </button>
    </tr>
  );
}
```

```typescript
// In tests - target specific transaction
const transactionId = 'abc123';
await page.click(`[data-testid="transaction-delete-${transactionId}"]`);
await expect(page.locator(`[data-testid="transaction-item-${transactionId}"]`))
  .not.toBeVisible();
```

### Conditional Test IDs

```tsx
// Add testid only in test environments
export function Button({ children, ...props }) {
  const testId = process.env.NODE_ENV === 'test'
    ? { 'data-testid': props['data-testid'] }
    : {};

  return <button {...props} {...testId}>{children}</button>;
}
```

*Note: Usually not necessary - data-testid in production is fine and harmless*

### Scoped Queries

```typescript
// Find element within a specific container
const accountCard = page.locator('[data-testid="account-card"]').first();
await accountCard.getByTestId('edit-button').click();

// Or with getByTestId directly
await page
  .getByTestId('account-card')
  .first()
  .getByTestId('edit-button')
  .click();
```

---

## 📋 Checklist for Writing Tests

When writing a new E2E test:

- [ ] **First:** Try using semantic selectors (getByRole, getByLabel, getByText)
- [ ] **If semantic fails:** Check if component has data-testid
- [ ] **If no testid:** Open the component file and add data-testid
- [ ] **Naming:** Use clear, descriptive testid names (e.g., `add-account-button`)
- [ ] **Test:** Run test locally - hot reload updates DOM automatically
- [ ] **Verify:** Test passes and is readable
- [ ] **Commit:** Include both component changes (testid) and test file

---

## 🎓 Examples from Better Call Buffet

### Example 1: Account Card Component

**Component:**
```tsx
// src/domains/accounts/components/account-card.tsx

interface AccountCardProps {
  account: {
    id: string;
    name: string;
    type: string;
    balance: number;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AccountCard({ account, onEdit, onDelete }: AccountCardProps) {
  return (
    <div
      data-testid="account-card"
      className="rounded-lg border p-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3
            data-testid="account-name"
            className="font-semibold"
          >
            {account.name}
          </h3>
          <p
            data-testid="account-type"
            className="text-sm text-gray-500"
          >
            {account.type}
          </p>
        </div>
        <p
          data-testid="account-balance"
          className="text-xl font-bold"
        >
          ${account.balance.toFixed(2)}
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          data-testid="account-edit-button"
          onClick={() => onEdit(account.id)}
          className="btn-secondary"
        >
          Edit
        </button>
        <button
          data-testid="account-delete-button"
          onClick={() => onDelete(account.id)}
          className="btn-danger"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
```

**Test:**
```typescript
// tests/e2e/accounts/account-card.spec.ts

import { test, expect } from '../fixtures/auth.fixture';

test.describe('Account Card', () => {
  test('should display account information', async ({ authenticatedPage: page }) => {
    await page.goto('/accounts');

    const accountCard = page.getByTestId('account-card').first();

    // Verify account details are visible
    await expect(accountCard.getByTestId('account-name')).toHaveText('Chase Cash');
    await expect(accountCard.getByTestId('account-type')).toHaveText('cash');
    await expect(accountCard.getByTestId('account-balance')).toContainText('$');
  });

  test('should edit account', async ({ authenticatedPage: page }) => {
    await page.goto('/accounts');

    const accountCard = page.getByTestId('account-card').first();
    await accountCard.getByTestId('account-edit-button').click();

    // Verify edit modal/drawer opened
    await expect(page.getByTestId('edit-account-drawer')).toBeVisible();
  });

  test('should delete account', async ({ authenticatedPage: page }) => {
    await page.goto('/accounts');

    const accountCard = page.getByTestId('account-card').first();
    const accountName = await accountCard.getByTestId('account-name').textContent();

    await accountCard.getByTestId('account-delete-button').click();
    await page.getByTestId('confirm-delete-button').click();

    // Verify account removed
    await expect(page.getByText(accountName!)).not.toBeVisible();
  });
});
```

### Example 2: Transaction List

**Component:**
```tsx
// src/domains/transactions/components/transaction-list.tsx

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div data-testid="transaction-list">
      <div className="mb-4 flex items-center justify-between">
        <h2 data-testid="transaction-count">
          {transactions.length} transactions found
        </h2>
        <button
          data-testid="add-transaction-button"
          onClick={onAddTransaction}
        >
          Add Transaction
        </button>
      </div>

      <ul>
        {transactions.map((transaction) => (
          <li
            key={transaction.id}
            data-testid={`transaction-item-${transaction.id}`}
          >
            <span data-testid={`transaction-description-${transaction.id}`}>
              {transaction.description}
            </span>
            <span data-testid={`transaction-amount-${transaction.id}`}>
              {formatCurrency(transaction.amount)}
            </span>
            <button
              data-testid={`transaction-edit-${transaction.id}`}
              onClick={() => onEdit(transaction.id)}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Test:**
```typescript
// tests/e2e/transactions/transaction-list.spec.ts

test('should display transaction list', async ({ authenticatedPage: page }) => {
  await page.goto('/transactions');

  // Check transaction count
  await expect(page.getByTestId('transaction-count')).toContainText('19 transactions');

  // Verify list is visible
  await expect(page.getByTestId('transaction-list')).toBeVisible();

  // Check first transaction
  const firstTransaction = page.getByTestId('transaction-item').first();
  await expect(firstTransaction.getByTestId('transaction-description')).toBeVisible();
  await expect(firstTransaction.getByTestId('transaction-amount')).toBeVisible();
});

test('should edit specific transaction by id', async ({ authenticatedPage: page }) => {
  await page.goto('/transactions');

  const transactionId = 'abc123'; // Get from test data

  await page.getByTestId(`transaction-edit-${transactionId}`).click();

  // Edit form opens
  await expect(page.getByTestId('edit-transaction-drawer')).toBeVisible();
});
```

---

## 🔧 Troubleshooting

### Issue: "Can't find element with data-testid"

**Solution:**
1. Check if you added the attribute to the component
2. Make sure hot reload updated the DOM (check browser DevTools)
3. Verify the testid name matches exactly (case-sensitive!)
4. Check if element is inside a conditional render or async loaded

### Issue: "Multiple elements with same data-testid"

**Solution:**
1. Use `.first()` or `.last()` if intentional
2. Add unique identifiers for list items (e.g., `data-testid="item-${id}"`)
3. Scope your query to a specific container

```typescript
// Instead of
await page.getByTestId('edit-button').click(); // Which one?

// Do this
await page.getByTestId('account-card').first().getByTestId('edit-button').click();

// Or use unique IDs
await page.getByTestId(`edit-button-${accountId}`).click();
```

### Issue: "Test works locally but fails in CI"

**Possible causes:**
1. Hot reload hasn't updated - restart dev server
2. Different test data in CI
3. Timing issues - add proper waits

**Solution:**
```typescript
// Add explicit wait for element
await page.waitForSelector('[data-testid="add-transaction-button"]');
await page.getByTestId('add-transaction-button').click();

// Or use Playwright's auto-wait (usually works)
await page.getByTestId('add-transaction-button').click(); // Auto-waits
```

---

## 📚 Resources

### Playwright Documentation
- [Locators](https://playwright.dev/docs/locators)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [getByTestId](https://playwright.dev/docs/api/class-page#page-get-by-test-id)

### Testing Library Philosophy
- [Which Query Should I Use?](https://testing-library.com/docs/queries/about/#priority)
- [data-testid](https://testing-library.com/docs/queries/bytestid/)

---

## 🎯 Summary

### The Golden Rule

**When writing E2E tests in this codebase:**

1. ✅ **First choice:** Semantic selectors (`getByRole`, `getByLabel`, `getByText`)
2. ✅ **Second choice:** Add `data-testid` to component (you have access!)
3. ⚠️ **Last resort:** Complex CSS selectors

### The Workflow

1. Write test with `data-testid`
2. Test fails (element not found)
3. Open component in codebase
4. Add `data-testid` attribute
5. Hot reload updates DOM automatically ⚡
6. Re-run test → passes! ✅
7. Commit both component and test changes

### Why This Matters

- ✅ **Reliable:** Tests don't break when styles change
- ✅ **Readable:** Clear what you're testing
- ✅ **Maintainable:** Easy to update tests
- ✅ **Fast iteration:** Hot reload speeds up test development
- ✅ **Collaborative:** Easy for other devs (and AI) to understand

---

**Remember:** You have full access to the codebase. Don't struggle with CSS selectors - just add `data-testid` attributes! 🚀

---

*This document is for developers and AI assistants (like Claude Code) working on Better Call Buffet E2E tests.*
