# Testing Strategy: Component vs. Unit

## Executive Summary

This document outlines the strategic testing approach for Better Call Buffet. We adhere to a strict distinction between **Component Tests** and **Unit Tests** to maximize confidence and maintainability.

**Status:** Target State (Gap Analysis included below)

## Core Value: The Separation of Concerns

We do not lump everything under "Unit Testing". We distinctly categorize tests based on what they validate and how they handle dependencies.

### 1. Component Tests (The Standard)
*   **Target:** React Components, Pages, and Layouts.
*   **Philosophy:** "Integration-lite". We test behavior, not implementation.
*   **Tooling:** **MSW (Mock Service Worker)** + React Testing Library.
*   **Rule:** **Never mock the data fetching layer** (e.g., `vi.mock('axios')` or `vi.mock('@tanstack/react-query')`). Let the component make "real" network requests that are intercepted by MSW.
*   **Why:** This decouples tests from implementation details. Switching from `axios` to `fetch` should not break your tests.

### 2. Unit Tests (The Logic)
*   **Target:** Helper functions (`utils/*.ts`), complex hooks (`hooks/*.ts`), and non-UI business logic.
*   **Philosophy:** Pure isolation. Input -> Output.
*   **Tooling:** Vitest native assertions.
*   **Rule:** `vi.mock()` is permitted here to isolate complex dependencies, but pure functions should ideally require no mocking.

---

## Technology Stack

| Role | Tool | Status |
|------|------|--------|
| **Runner** | **Vitest** | ✅ Installed |
| **Component Testing** | **React Testing Library** | ✅ Installed |
| **API Mocking** | **MSW (Mock Service Worker)** | ❌ Missing (See ADR 009) |
| **DOM Environment** | **jsdom** | ✅ Installed |

## Testing Strategies

### 1. Component Tests (UI & Flows)
- **Location:** Colocated with source (`Profile.tsx` -> `Profile.test.tsx`).
- **Data Fetching:** Handled exclusively via **MSW**.
    - *Scenario:* Render component -> MSW intercepts GET request -> Return mock JSON -> Assert UI updates.
- **Interactions:** Use `userEvent` to simulate real browser behavior.
- **Queries:** Priority: `getByRole` > `getByText`. Avoid `getByTestId` unless necessary.

### 2. Unit Tests (Pure Logic)
- **Location:** Colocated with source (`currency.ts` -> `currency.test.ts`).
- **Focus:** Edge cases, mathematical logic, data transformation.
- **Mocking:** `vi.mock()` allowed for non-network dependencies (e.g., creating a spy for `localStorage`).

### 3. Accessibility (A11y)
- All component tests must implicitly test accessibility by using semantic queries (`getByRole`).

## Gap Analysis & Immediate Actions

Current codebase analysis reveals a discrepancy between documentation and reality:

1.  **Missing Infrastructure:** `src/domains/testing/setup.ts`, `render-utils.tsx`, and `index.ts` are missing.
2.  **Missing MSW:** Despite ADR 009 being "Accepted", MSW is not in `package.json`.

## Recommendations for Next Sprint

1.  **Restore Testing Infrastructure:** Re-create `src/domains/testing/` utilities.
2.  **Install MSW:** Add `msw` and configure handlers for the current domains.
