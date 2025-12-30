# User Journey: Dashboard Overview

## Overview
The dashboard is the main landing page after authentication, providing users with a comprehensive financial overview and quick access to key features.

## Journey Flow

### 1. Access Dashboard
- **Entry Point:** User is redirected to dashboard after successful login
- **URL:** `/dashboard?from=2025-12-01&to=2025-12-31`
- **Default Date Range:** Current month (e.g., Dec 1, 2025 - Dec 31, 2025)

### 2. Dashboard Layout

#### 2.1 Header Section
- **Greeting:** "Hello, [User Name]" (e.g., "Hello, John Doe")
- **Date Display:** Current date formatted (e.g., "Monday Dec 29, 2025")
- **Application Logo:** Clickable logo (likely returns to dashboard)

#### 2.2 Date Range Selector
- **Quick Filters:**
  - "Today" button
  - "30d" button (last 30 days)
  - "3M" button (last 3 months)
  - "6M" button (last 6 months)
  - "YTD" button (Year to Date)
- **Custom Date Range:**
  - Button displaying current range: "Dec 1, 2025 - Dec 31, 2025"
  - Clicking opens date picker for custom range selection

#### 2.3 Navigation Menu
Sidebar navigation with links to:
- **Home** (Dashboard) - Current page
- **Accounts** - Bank and investment accounts
- **Transactions** - Transaction history
- **Brokers** - Investment brokers
- **Investments** - Investment tracking
- **Vendors** - Vendor management
- **Subscriptions** - Subscription tracking
- **Settings** - Application settings

### 3. Financial Summary Cards
*(To be populated based on actual dashboard content - may include:)*
- Total Balance
- Monthly Income
- Monthly Expenses
- Net Worth
- Budget Status

### 4. Charts and Visualizations
*(To be populated based on actual dashboard content - may include:)*
- Balance trends over time
- Income vs Expenses comparison
- Category breakdown
- Spending patterns

## User Interactions

### Changing Date Range
1. User clicks on a quick filter button (Today, 30d, 3M, 6M, YTD)
2. Dashboard updates to show data for selected period
3. URL updates with new date range parameters
4. All financial data refreshes to match new range

### Custom Date Selection
1. User clicks on date range button
2. Date picker modal/drawer opens
3. User selects start and end dates
4. Dashboard updates with custom range
5. URL updates with new parameters

### Navigation
1. User clicks any navigation link
2. Application navigates to selected section
3. Active navigation item is highlighted
4. Page content updates while maintaining navigation sidebar

## Technical Details

### URL Parameters
- `from`: Start date (format: YYYY-MM-DD)
- `to`: End date (format: YYYY-MM-DD)
- These parameters persist across navigation for consistent date filtering

### Data Loading
- Dashboard data loads based on authenticated user
- Date range filters all financial data
- Real-time updates when date range changes

## User Experience Considerations
- Personalized greeting with user's name
- Quick access to all major features via navigation
- Flexible date range selection for different analysis needs
- Consistent date filtering across the application
- Visual indicators for active navigation items

## Related Features
- All financial management features accessible from dashboard
- Date range selector affects all financial views
- Navigation provides access to all application sections

