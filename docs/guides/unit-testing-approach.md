# Testing Strategy: Component vs. Unit

## Executive Summary

This document outlines the strategic testing approach for Better Call Buffet. We adhere to a strict distinction between **Component Tests** and **Unit Tests** to maximize confidence and maintainability.

**Status:** Implemented

## Core Value: The Separation of Concerns

We do not lump everything under "Unit Testing". We distinctly categorize tests based on what they validate and how they handle dependencies.

### 1. Component Tests (The Standard)

- **Target:** React Components, Pages, and Layouts.
- **Philosophy:** "Integration-lite". We test behavior, not implementation.
- **Tooling:** **MSW (Mock Service Worker)** + React Testing Library.
- **Rule:** **Never mock the data fetching layer** (e.g., `vi.mock('axios')` or `vi.mock('@tanstack/react-query')`). Let the component make "real" network requests that are intercepted by MSW.
- **Why:** This decouples tests from implementation details. Switching from `axios` to `fetch` should not break your tests.

### 2. Unit Tests (The Logic)

- **Target:** Helper functions (`utils/*.ts`), complex hooks (`hooks/*.ts`), and non-UI business logic.
- **Philosophy:** Pure isolation. Input -> Output.
- **Tooling:** Vitest native assertions.
- **Rule:** `vi.mock()` is permitted here to isolate complex dependencies, but pure functions should ideally require no mocking.

---

## Technology Stack

| Role                  | Tool                          | Status       |
| --------------------- | ----------------------------- | ------------ |
| **Runner**            | **Vitest**                    | ✅ Installed |
| **Component Testing** | **React Testing Library**     | ✅ Installed |
| **API Mocking**       | **MSW (Mock Service Worker)** | ✅ Installed |
| **DOM Environment**   | **jsdom**                     | ✅ Installed |

## Testing Strategies

### 1. Component Tests (UI & Flows)

- **Location:** Colocated with source (`Profile.tsx` -> `Profile.test.tsx`).
- **Data Fetching:** Handled exclusively via **MSW**.
  - _Scenario:_ Render component -> MSW intercepts GET request -> Return mock JSON -> Assert UI updates.
- **Interactions:** Use `userEvent` to simulate real browser behavior.
- **Queries:** Priority: `getByRole` > `getByText`. Avoid `getByTestId` unless necessary.

### 2. Unit Tests (Pure Logic)

- **Location:** Colocated with source (`currency.ts` -> `currency.test.ts`).
- **Focus:** Edge cases, mathematical logic, data transformation.
- **Mocking:** `vi.mock()` allowed for non-network dependencies (e.g., creating a spy for `localStorage`).

### 3. Accessibility (A11y)

- All component tests must implicitly test accessibility by using semantic queries (`getByRole`).

# Testing Standards & Patterns

## Core Frameworks

- **Runner:** Vitest
- **Components:** React Testing Library (`@testing-library/react`)
- **Environment:** `jsdom`

## File Location & Naming

- **Location:** Co-located with the source file.
  - `src/domains/accounts/components/UserProfile.tsx` -> `src/domains/accounts/components/UserProfile.test.tsx`
- **Extensions:**
  - Components: `.test.tsx`
  - Hooks/Utils: `.test.ts`

## Imports & Setup

**Always** use the project's custom test utilities. Do not import directly from `@testing-library/react` unless strictly necessary and unavailable in the custom utils.

```typescript
// PREFERRED: Import from testing domain index or specific utils
import { render, screen, renderHook, act } from '@testing/index';
// OR
import { render, screen } from '@testing/render-utils';
import { createMockUser } from '@testing/test-data';
import { vi } from 'vitest';
```

## Mocking

Use `vi.mock` for module mocking.

```typescript
vi.mock('./api', () => ({
  fetchUserData: vi.fn(),
}));
```

## Data Generators

Use the helper functions in `@testing/test-data` instead of manual object literals whenever possible.

```typescript
const user = createMockUser({ name: 'Custom Name' });
```

## Testing Patterns

### Thick Component Tests (The Standard)

Never settle for checking `isLoading`. Assert the data.

```typescript
it('renders data from the server', async () => {
  render(<UserList />);

  // 1. Wait for loading to finish
  await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());

  // 2. ASSERT DATA (The 'Front' part of Frontend)
  // If MSW returns { name: 'John Doe' }, verify it:
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

### Hooks

Use `renderHook` and `act`.

```typescript
describe('useCounter', () => {
  it('increments', () => {
    const { result } = renderHook(() => useCounter());
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });
});
```

## Async & Loading States

When testing asynchronous behavior (like data fetching), prefer `findBy*` queries over `waitFor` + `getBy*`.

- **Why:** `findBy*` queries have built-in retry mechanisms that wait for the element to appear.
- **Microtasks:** In simulated environments, loading states might not appear synchronously. `findBy` handles this gracefully.

```typescript
// ✅ PREFERRED
expect(await screen.findByTestId('loading-spinner')).toBeInTheDocument();

// ❌ AVOID (unless necessary for complex conditions)
await waitFor(() => {
  expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
});
```

See [Testing Library - Async Methods](https://testing-library.com/docs/dom-testing-library/api-async/) for more details.

## Testing with Providers (Router, Query)

The custom `render` function automatically wraps your component with necessary providers:

- **TanStack Query:** New `QueryClient` for isolation (retries disabled).
- **TanStack Router:** `createMemoryHistory` for isolated navigation testing.

### Interacting with the Router

You can access the `router` instance returned by `render` to assert on navigation state.

```typescript
const { router } = render(<MyComponent />);

// Trigger action
await userEvent.click(screen.getByRole('link'));

// Assert URL match
await waitFor(() => {
  expect(router.state.location.pathname).toBe('/new-page');
});
```

## Coverage Goals

- 80% statement coverage.
- Focus on happy paths and critical error states.

# MSW Architecture & Domain Organization

To ensure scalability and maintainability, test mocks are organized by domain.

## Architecture Layers

1.  **Backend Routes (`src/domains/{domain}/api/backend-routes.ts`)**
    - Single source of truth for API URL strings.
    - Used by both the Application Code (API clients) and Test Code (MSW handlers).

2.  **Domain Handlers (`src/domains/{domain}/testing/handlers.ts`)**
    - Exports **Default Handlers**: Happy path responses for the domain.
    - Exports **Factories**: Functions to create overrides for specific test cases (e.g., `mockActiveAccounts([])` or `mockActiveAccounts(HttpResponse.error())`).

3.  **Global Server (`src/domains/testing/msw/handlers.ts`)**
    - Aggregates all default domain handlers.
    - Ensures the test server starts with a fully functioning happy-path state.

## How to Add a New Integration Test

1.  **Define Routes**: Ensure API paths are constants in `backend-routes.ts`.
2.  **Create Handlers**: In `src/domains/{domain}/testing/handlers.ts`, add default handlers and factory functions using `http` and `HttpResponse`.
3.  **Register Global**: Add your new domain handlers to the global `handlers.ts`.
4.  **Write Test**:
    - Import `mockFactory` from your domain testing folder.
    - Use `server.use(mockFactory(...))` to override defaults ONLY for edge cases (Loading, Error, Empty).
    - For Happy Path, rely on the defaults!

```typescript
// src/domains/accounts/screens/main.test.tsx

it('shows list of accounts', async () => {
  // RELY ON DEFAULT HANDLERS - No server.use() needed!
  render(<AccountMainScreen />);
  expect(await screen.findByText('Checking Account')).toBeInTheDocument();
});

it('shows error state', async () => {
   // OVERRIDE for this specific test
   server.use(mockActiveAccounts(HttpResponse.error()));

   render(<AccountMainScreen />);
   expect(await screen.findByTestId('error-state')).toBeInTheDocument();
});
```

### Best Practices

- **Don't hardcode URLs** in tests. Use `ACCOUNTS_ROUTES.LIST`.
- **Don't mock global state** (like `useGlobalUIState`) unless strictly necessary. Test the real integration (e.g., changes in Router state).
- **Use `findBy*`** for anything that depends on async data fetching.
