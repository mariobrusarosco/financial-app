# Frontend Plan: Vendors and Subscriptions Feature

This document outlines the implementation plan for integrating Vendors and Subscriptions into the "Better Call Buffet" financial application frontend. It aligns with the discussed backend plan.

## 🎯 Objective
Enable users to track recurring subscriptions and manage associated vendors through a dedicated UI, leveraging the existing architecture (TanStack Router, TanStack Query, React, TypeScript, shadcn/ui).

## 🏗️ Architecture
The implementation will follow the existing domain-driven structure (`src/domains/<feature>/`).

### Domains Created:
*   `src/domains/vendors/`: Contains types, API integration, hooks, components, and screens for Vendor management.
*   `src/domains/subscriptions/`: Contains types, API integration, hooks, components, and screens for Subscription management.

## 📅 Implementation Phases

### Phase 1: Core Data & API Layer

1.  **Define Data Models**:
    *   Create `I_Vendor` interface (e.g., `id`, `name`, `description`).
    *   Create `I_Subscription` interface (e.g., `id`, `vendor_id`, `name`, `amount`, `frequency` (monthly, yearly), `start_date`, `end_date`, `next_payment_date`, `associated_account_id`, `category_id`).
    *   Define corresponding request/response types for API payloads.
    *   **Files**:
        *   `src/domains/vendors/types/types-and-interfaces.ts`
        *   `src/domains/subscriptions/types/types-and-interfaces.ts`
2.  **API Integration**:
    *   Create new API client modules (`vendors.api.ts`, `subscriptions.api.ts`) to handle HTTP requests (GET, POST, PUT, DELETE).
    *   Define specific API keys for TanStack Query (`keys.ts` in each domain folder).
    *   **Files**:
        *   `src/domains/vendors/api/vendors.api.ts`
        *   `src/domains/vendors/api/keys.ts`
        *   `src/domains/subscriptions/api/subscriptions.api.ts`
        *   `src/domains/subscriptions/api/keys.ts`
3.  **Data Hooks**:
    *   Develop TanStack Query hooks for fetching lists (`useVendors`, `useSubscriptions`) and single items (`useVendor`, `useSubscription`).
    *   Implement mutation hooks for creating, updating, and deleting (`useCreateVendor`, `useUpdateSubscription`, etc.).
    *   **Files**:
        *   `src/domains/vendors/hooks/use-vendors.ts` (and other CRUD hooks)
        *   `src/domains/subscriptions/hooks/use-subscriptions.ts` (and other CRUD hooks)

### Phase 2: Routing & Navigation

1.  **New Routes**:
    *   Create new route files under the authenticated layout (`/(auth)`):
        *   `src/routes/(auth)/vendors/index.tsx`: List all vendors.
        *   `src/routes/(auth)/vendors/create.tsx`: Form to create a new vendor.
        *   `src/routes/(auth)/vendors/$vendorId/index.tsx`: View/edit a specific vendor.
        *   `src/routes/(auth)/subscriptions/index.tsx`: List all subscriptions.
        *   `src/routes/(auth)/subscriptions/create.tsx`: Form to create a new subscription.
        *   `src/routes/(auth)/subscriptions/$subscriptionId/index.tsx`: View/edit a specific subscription.
2.  **Update Main Navigation (`src/domains/ui-system/components/navigation.tsx`)**:
    *   Add new `Link` components for "Vendors" and "Subscriptions" to the main navigation menu.

### Phase 3: User Interface (UI) Development

1.  **Vendor UI Components (`src/domains/vendors/components/`)**:
    *   `VendorList` (e.g., a table component for displaying vendors).
    *   `VendorForm` (for creating/editing vendor details).
    *   `VendorDetail` (displays vendor info and possibly a list of associated subscriptions).
2.  **Subscription UI Components (`src/domains/subscriptions/components/`)**:
    *   `SubscriptionList` (a table or card-based list for subscriptions).
    *   `SubscriptionForm` (includes fields for amount, frequency, date pickers, and a dropdown/selector for existing Vendors and Accounts).
    *   `SubscriptionDetail`.
3.  **Screens (`src/domains/vendors/screens/`, `src/domains/subscriptions/screens/`)**:
    *   Create the main screen components that orchestrate the UI for each route (e.g., `VendorsMainScreen.tsx`, `SubscriptionsMainScreen.tsx`).

### Phase 4: Feature Integration & Enhancements

1.  **Transaction Integration**:
    *   **Transaction Create/Edit Forms**: Add an optional field to existing transaction forms to link a transaction to an existing `Subscription` (which implicitly links to a `Vendor`). This could be a `Select` component.
2.  **Global Date Filter**:
    *   Ensure any new lists or dashboards related to vendors/subscriptions have date-sensitive data (e.g., "Upcoming Subscriptions this Month") and consume the `from` and `to` global URL parameters.
3.  **Dashboard Integration**: Consider a small widget on the main Dashboard to show "Upcoming Subscriptions" or "Subscription Summary".

### Phase 5: Testing & Quality Assurance

1.  **Unit Tests**: Write `vitest` unit tests for all new hooks, utility functions, and complex component logic.
2.  **Integration Tests**: Test the flow of data from UI -> hooks -> API.
3.  **E2E Tests**: (If applicable) Develop end-to-end tests for critical user journeys (e.g., "Create new Subscription and verify it appears in the list").
4.  **Type Checking & Linting**: Ensure all new code passes `yarn typecheck` and `yarn lint`.
