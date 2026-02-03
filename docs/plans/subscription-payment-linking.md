# Subscription Payment Linking Implementation Plan

## Overview
This plan outlines the steps to implement the feature allowing users to view payment history for a subscription and manually link existing transactions to mark a subscription as "Paid".

# Phase 1: Data Layer & API Preparation

## Goal
Ensure the frontend data layer (Types, API client, React Query hooks) is ready to support fetching subscription-filtered transactions and linking payments.

## Tasks

### Task 1 - Update API Types [x]
#### Task 1.1 - Add `subscription_id` to `I_AccountTransactionsParams` in `src/domains/transactions/types/types-and-interfaces.ts` [x]
#### Task 1.2 - Verify `subscriptionsApi.linkPayment` signature matches backend requirements [x]

### Task 2 - Create/Update Hooks [x]
#### Task 2.1 - Create/Update `useTransactions` hook to support `subscription_id` filtering [x]
#### Task 2.2 - Update `useLinkPayment` mutation hook in `src/domains/subscriptions/hooks/index.ts` [x]

## Dependencies
- Backend endpoints: `GET /transactions?subscription_id=...` and `POST /subscriptions/{id}/link-payment`

## Expected Result
- Typescript interfaces correctly reflect the API capabilities.
- Hooks are ready to be used by UI components to fetch filtered transactions and link payments.

## Next Steps
- Proceed to Phase 2: UI Components

---

# Phase 2: UI Components (History & Link Drawer)

## Goal
Build the visual components required to display payment history and the interface for selecting a payment to link.

## Tasks

### Task 1 - Subscription Payment History Component [x]
#### Task 1.1 - Create `src/domains/subscriptions/components/subscription-payment-history.tsx` [x]
#### Task 1.2 - Implement data fetching using `useTransactions` with `subscription_id` [x]
#### Task 1.3 - Render list of past payments (Date, Amount, Description) [x]
#### Task 1.4 - Implement empty state ("No payments recorded yet") [x]

### Task 2 - Link Payment Drawer Component [x]
#### Task 2.1 - Create `src/domains/subscriptions/components/link-payment-drawer.tsx` [x]
#### Task 2.2 - Implement "Search/Filter" UI (defaulting to subscription name) [x]
#### Task 2.3 - Implement "Selectable Transaction List" (fetching recent paid transactions) [x]
#### Task 2.4 - Connect "Confirm" button to `useLinkSubscriptionPayment` mutation [x]

## Dependencies
- Phase 1 completion (hooks and types).

## Expected Result
- `SubscriptionPaymentHistory` component is ready to be embedded.
- `LinkPaymentDrawer` is functional and can trigger the API call.

## Next Steps
- Proceed to Phase 3: Integration

---

# Phase 3: Integration & UI Polish

## Goal
Integrate the new components into the existing Subscription Details view and finalize the UX.

## Tasks

### Task 1 - Update Subscription Details View [x]
#### Task 1.1 - Locate `EditSubscriptionDrawer` (or relevant view) [x]
#### Task 1.2 - Embed `SubscriptionPaymentHistory` at the bottom of the view [x]
#### Task 1.3 - Add "Mark as Paid" button logic (show only if `!is_paid_this_cycle`) [x]
#### Task 1.4 - Connect "Mark as Paid" button to open `LinkPaymentDrawer` [x]

### Task 2 - Visual Status Updates [x]
#### Task 2.1 - Update Subscription Status Badge logic (Green for Paid, Yellow/Red for Due/Overdue) [x]
#### Task 2.2 - Verify UI updates correctly after a successful link (via Query Invalidation) [x]

## Dependencies
- Phase 2 completion (UI components).

## Expected Result
- Users can view history.
- Users can click "Mark as Paid", select a transaction, and see the subscription status update to "Paid".

## Next Steps
- Final manual verification.
