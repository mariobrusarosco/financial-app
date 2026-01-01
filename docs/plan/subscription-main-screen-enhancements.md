# Phase 1: Subscriptions Dashboard Enhancement

## Goal
Transform the Subscriptions main screen from a simple list view into a data-rich dashboard. The new UI will mirror the **Installments** domain architecture, providing users with immediate financial insights via summary cards and analytics charts before presenting the detailed management list.

## Tasks

### Task 1 - Utilities & Data Logic implementation [x]
Implement the calculation logic required to derive dashboard metrics from raw subscription data.
#### Task 1.1 - Create calculation utilities [x]
Create `src/domains/subscriptions/utils/subscription-calculators.ts` containing:
- `calculateMonthlyBurnRate`: Normalizes different billing cycles (weekly, annual) to a monthly cost.
- `calculateYearlyProjection`: Projects the annual cost based on the monthly burn.
- `calculateDueNext30Days`: Sums up payments due in the rolling next 30 days.
- `groupSubscriptionsByMonth`: Prepares data for the Annual Cost Forecast bar chart.
- `aggregateSubscriptionsByCategory`: Prepares data for the Category Breakdown donut chart.

### Task 2 - UI Components Implementation [x]
#### Task 2.1 - Implement SubscriptionsSummary [x]
#### Task 2.2 - Implement SubscriptionsChart [x]
#### Task 2.3 - Implement SubscriptionsCategoryBreakdown [x]

### Task 3 - Screen Integration & Data Fetching []
Assemble the new dashboard in the main screen.
#### Task 3.1 - Implement "Fetch All" Hook []
Modify or extend hooks in `src/domains/subscriptions/hooks/index.ts` to support fetching *all* active subscriptions (bypassing pagination) for the analytics section.
#### Task 3.2 - Update Main Screen Layout []
Refactor `src/domains/subscriptions/screens/main.tsx`:
- Fetch all active subscriptions for the summary/charts.
- Fetch categories using `useCategories`.
- Implement the new layout: `PageHeader` -> `SubscriptionsSummary` -> `Charts Grid` -> `SubscriptionList`.

## Dependencies
- `recharts` (Project standard for charts)
- `lucide-react` (Icons)
- `useCategories` (From `domains/categories`)

## Expected Result
The Subscriptions screen will visually match the high-quality standard of the Installments screen, offering users instant visibility into their recurring expenses and category distribution.

## Next Steps
Begin implementation of Task 1.
