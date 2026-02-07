# Phase 1: E2E Test Implementation for Remaining Domains

## Goal

The goal of this plan is to implement E2E tests for all the domains that currently lack them. This will ensure better test coverage and application stability.

## Plan

The implementation will be done domain by domain. We will start with the `dashboard` domain, as it is a critical part of the application.

---

# Phase 1: Cleanup and Plan Creation

## Goal

Ensure a clean slate for E2E test implementation and create the detailed plan.

## Tasks

### Task 1 - Delete eisting dashboard E2E test file (if any) [x]

Delete `src/domains/dashboard/test/e2e/dashboard.spec.ts` if it eists.

### Task 2 - Create the test directories for dashboard [x]

Create the `src/domains/dashboard/test/e2e` directories.

---

# Phase 2: Dashboard E2E Tests

## Goal

Implement E2E tests for the `dashboard` domain.

## Tasks

### Task 1 - Create the initial test file [x]

Create a new file `src/domains/dashboard/test/e2e/dashboard.spec.ts` with basic setup.

### Task 2 - Write the first test for main components []

Write a simple test to check if the dashboard page loads correctly and displays the main components (user greeting, subscriptions heading).

#### Task 2.1 - Navigate to the dashboard page [x]

#### Task 2.2 - Assert that the user greeting is visible [x]

> Note: User greeting is not currently implemented in the UI.

#### Task 2.3 - Assert that the "Subscriptions" heading is visible [x]

### Task 3 - Write tests for dashboard interactions [ ]

#### Task 3.1 - Write a test for the date range filter [ ]

#### Task 3.2 - Write a test for the "add new transaction" button [ ]

## Dependencies

- Playwright should be properly configured.
- The development server should be running.

## Epected Result

A new E2E test file for the `dashboard` domain with basic tests and interaction tests.

## Net Steps

Once the `dashboard` domain has E2E tests, we will move to the net domain in the list.
