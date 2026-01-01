# Phase 1: Installments Dashboard Enhancement [COMPLETED]

## Goal

Transform the Installments Main Screen into a comprehensive dashboard that provides users with immediate insight into their future financial commitments ("Debt Horizon").

## Tasks

### Task 1 - Data Logic & Utilities [x]

#### Task 1.1 - Create utility to calculate "Total Outstanding Debt" from active plans [x]

#### Task 1.2 - Create utility to calculate "Next Month's Liability" [x]

#### Task 1.3 - Create utility to group future installments by month for the chart [x]

#### Task 1.4 - Create utility to calculate "Due This Month's Liability" [x]

### Task 2 - Summary Cards Component [x]

#### Task 2.1 - Create `InstallmentsSummary` component [x]

#### Task 2.2 - Implement "Total Outstanding" card [x]

#### Task 2.3 - Implement "Due Next Month" card [x]

#### Task 2.4 - Implement "Active Plans" count card [x]

#### Task 2.5 - Implement "Due This Month" card [x]

### Task 3 - Monthly Liability Chart [x]

#### Task 3.1 - Create `InstallmentsChart` component using Tremor/Recharts [x]

#### Task 3.2 - Implement bar chart showing projected payments for next 6-12 months [x]

#### Task 3.3 - Integrate chart into the main screen layout [x]

### Task 4 - Integration & Layout [x]

#### Task 4.1 - Update `InstallmentsMainScreen` to include new Summary and Chart sections [x]

#### Task 4.2 - Ensure responsive layout (Cards on top, Chart below, List at bottom) [x]

## Dependencies

- Existing `I_InstallmentPlan` data from `useInstallments`.
- `Tremor` or `Recharts` library (already present in project).

## Expected Result

 A "Dashboard-like" view for Installments where the user sees their debt summary and future projection immediately upon landing, followed by the detailed list of plans.

# Phase 2: Category Breakdown & Spending Insights [COMPLETED]

## Goal
Provide users with a clear understanding of how their future commitments are distributed across different spending categories and subcategories, enabling better future budget planning.

## Tasks

### Task 5 - Data Logic & Category Mapping [x]
#### Task 5.1 - Create utility to aggregate future installment amounts by category [x]
#### Task 5.2 - Implement logic to resolve category names from IDs using the categories tree [x]
#### Task 5.3 - Handle parent-child relationships for summarized reporting [x]

### Task 6 - Category Breakdown Component [x]
#### Task 6.1 - Create `InstallmentsCategoryBreakdown` component using Tremor/Recharts [x]
#### Task 6.2 - Implement Donut Chart showing % distribution of total outstanding debt [x]
#### Task 6.3 - Add a legend with absolute values and category names [x]

### Task 7 - Dashboard Layout Refinement [x]
#### Task 7.1 - Update `InstallmentsMainScreen` to implement the 2-column layout for charts [x]
#### Task 7.2 - Ensure responsive stacking (1 column on mobile, 2 on desktop) [x]
#### Task 7.3 - Align visual styling with existing sections (bg-section-background, rounded-3xl) [x]

## Dependencies
- `I_CategoryTreeNode` data from `useCategories`.
- `groupFutureInstallmentsByMonth` (reusing logic).
- `Tremor` DonutChart component.

## Expected Result
A dashboard row featuring a Monthly Forecast side-by-side with a Category Breakdown, providing a "Time vs. Purpose" view of all future debts.

# Phase 3: Visual Scalability Refinements [COMPLETED]

## Goal

Ensure the dashboard visualizations scale elegantly with large datasets, specifically handling 30+ categories with distinct coloring via algorithmic shade generation.

## Tasks

### Task 8 - Color System Refinement [x]

#### Task 8.1 - Create color generation utility (Hues x Shades matrix) [x]

#### Task 8.2 - Refactor `InstallmentsCategoryBreakdown` to use Recharts `PieChart` [x]

#### Task 8.3 - Implement custom scrollable/paginated Legend for high category counts [x]

## Dependencies

- `Recharts` (Pie, Cell, ResponsiveContainer).

## Expected Result

A Category Breakdown chart that remains visually distinct and readable even with 30+ active categories.

## Next Steps

- Done.
