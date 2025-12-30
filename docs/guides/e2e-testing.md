# E2E Testing Strategy & Architecture Guide

## 🎓 End-to-End (E2E) Testing - Educational Deep Dive

### What We're Implementing:
A comprehensive strategy for testing the entire application flow—from the user interface through the API and down to the database.

### Why This Matters:
While Unit and Integration tests verify that individual parts of the system work in isolation, **E2E tests verify that the system works as a whole**. It's the ultimate safety net for catching issues that occur between layers (e.g., a frontend change that expects a field name that the backend changed).

### The Testing Pyramid vs. The E2E Reality:

In a traditional Testing Pyramid, E2E tests are at the top because they are slower and more expensive to maintain. However, they provide the highest **Confidence per Line of Code**.

| Layer | Speed | Cost | Scope | Confidence |
|-------|-------|------|-------|------------|
| **Unit** | ⚡⚡⚡ | $ | Single Function | Low |
| **Integration**| ⚡⚡ | $$ | Two+ Modules | Medium |
| **E2E** | 🐌 | $$$ | Entire System | **Highest** |

### Key Benefits:
- **Catches "Glue" Bugs:** Errors that happen when connecting frontend, backend, and DB.
- **Validates User Journeys:** Ensures users can actually complete their tasks.
- **Safe Refactoring:** Gives confidence to refactor large parts of the system.
- **Cross-Browser Verification:** Ensures CSS and JS work in Safari, Chrome, and Firefox.

---

## E2E Architecture for Better Call Buffet

### 1. Test Environment
Tests will run against:
- **Local:** `http://localhost:3000` (Frontend) + `http://localhost:8000` (Backend).
- **Staging/Beta:** `https://better-call-buffet.mariobrusarosco.com/`.

### 2. Folder Structure
We will organize tests by user journey and domain:
```
financial-app/
├── e2e/
│   ├── auth/                # Login, Signup, Logout
│   ├── transactions/        # Adding, Editing, Deleting transactions
│   ├── accounts/            # Bank and Credit Card management
│   ├── dashboard/           # Financial summaries and charts
│   └── utils/               # E2E helpers (authentication, data cleanup)
```

### 3. Strategy: Critical Path Testing
We won't test every edge case in E2E (that's for unit tests). We focus on **Happy Paths** and **Critical Failures**:
1. **Auth:** User can log in and stay logged in.
2. **Onboarding:** New user can create their first account.
3. **Core Value:** User can add an expense and see it reflected in the dashboard.
4. **Resilience:** User gets a clear error message if the backend is down.

### 4. Authentication Strategy (The "Storage State" Pattern)
Instead of logging in before every single test (which is slow), we:
1. Log in once in a `global-setup.ts`.
2. Save the cookies and localStorage to a `storageState.json`.
3. Load this state in all other tests to start already authenticated.

### 5. Data Management: "Seed and Clean"
- **Seed:** Before tests, we can use a "Test Seed" script on the backend to create a consistent set of data (e.g., a "Test User" with 5 transactions).
- **Cleanup:** We aim for tests that are **Indempotent** (can be run multiple times without failure) or we clean up data after specific tests.

---

## How It Works: Playwright Data Flow

1.  **Test Script:** Playwright commands (e.g., `page.click()`) are sent to the browser.
2.  **Browser:** Renders the React app (TanStack Start).
3.  **App:** Makes actual API requests to the FastAPI backend.
4.  **Backend:** Processes requests and interacts with the PostgreSQL DB.
5.  **Database:** Updates state.
6.  **Assertion:** Playwright checks if the UI reflects the change (e.g., "Is the balance now $1,200?").

## Related Concepts:
- **Visual Regression Testing:** Comparing screenshots to detect UI changes.
- **Synthetic Monitoring:** Running E2E tests on a schedule against production to ensure it's still "alive".
- **CI/CD Pipelines:** Automatically blocking deployments if E2E tests fail.

## Production Considerations:
- **Do not run destructive E2E tests against production!** Use a staging environment or dedicated test users.
- **Sensitive Data:** Never hardcode passwords in test scripts; use Environment Variables.
- **Flakiness:** Treat flaky tests as bugs. If a test fails 1/10 times for no reason, it loses its value.

