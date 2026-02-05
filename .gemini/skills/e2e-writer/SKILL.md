---
name: e2e-writer
description: Expert E2E test automation with Playwright. Use when creating, modifying, or reviewing end-to-end tests, ensuring they follow project best practices and use the data-testid selector strategy.
---

# E2E Writer

## Overview

This skill enables expert-level E2E test automation using Playwright. It focuses on creating robust, maintainable tests by adhering to the project's specific standards, including the mandatory use of `data-testid` attributes and avoiding arbitrary timeouts.

## Core Mandates

1. **Selector Strategy**: Always prefer `data-testid` attributes. If an element lacks one, open the component and add it. Avoid brittle CSS or XPath selectors.
2. **No Arbitrary Waits**: NEVER use `page.waitForTimeout()`. Use web-first assertions like `expect(page).toBeVisible()` or wait for specific network responses/URL changes.
3. **Hot Reload Workflow**: Add `data-testid` to components while the test is running to see instant updates and verify selectors.
4. **Auto-Retrying Assertions**: Use `await expect(...)` instead of manual checks like `if (await page.isVisible(...))`.

## Workflow: Creating a New Test

1. **Analyze Requirements**: Identify the user flow and key interaction points.
2. **Scaffold Test**: Create a new `.spec.ts` file in the appropriate domain folder: `src/domains/<domain>/test/e2e/`.
3. **Identify Selectors**:
    - Use `getByTestId()` for interactive and critical elements.
    - If a `data-testid` is missing, find the component in `src/domains/` and add it: `data-testid="your-element-name"`.
4. **Implement Test Logic**:
    - Use `beforeEach` for setup (e.g., navigation, authentication).
    - Group tests using `test.describe`.
    - Use existing fixtures if available (e.g., `authenticatedPage`).
5. **Verify and Fix**:
    - Run the test locally using `yarn test:e2e <file-path>`.
    - If it fails due to a missing selector, add the selector to the component and re-run.

## Project Context

### Test Commands
- `yarn test:e2e`: Run all E2E tests.
- `yarn test:e2e:ui`: Run tests with the Playwright UI.
- `yarn test:e2e:debug`: Run tests in debug mode.
- `yarn test:e2e:local`: Run tests against a local environment with specific env vars.

### Naming Conventions
- `data-testid` format: `{component}-{element}-{type}` (e.g., `add-transaction-button`, `account-name-input`).
- Test files: `*.spec.ts` located in `src/domains/<domain>/test/e2e/`.

## Resources

### references/
- **[best-practices.md](references/best-practices.md)**: Comprehensive guide on E2E testing standards, including the "No waitForTimeout" rule and selector strategies.