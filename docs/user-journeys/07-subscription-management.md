# User Journey: Subscription Management

## Overview
Users manage their recurring subscriptions (monthly services, memberships, etc.) through the Subscriptions section. This helps track recurring expenses and manage subscription budgets.

## Journey Flow

### 1. Access Subscriptions Section
- **Entry Point:** User clicks "Subscriptions" in navigation menu
- **URL:** `/subscriptions?from=2025-12-01&to=2025-12-31`
- **Page Title:** "Subscriptions"

### 2. Subscriptions List View

#### 2.1 Page Header
- **Icon and Title:** "Subscriptions" heading
- **Action Button:** "Add Subscription" button (top right) to create new subscription

#### 2.2 Loading State
- Initial state shows: "Loading subscriptions..." with spinner
- Data loads from API
- List populates when data is available

### 3. Subscriptions Display
*(To be populated based on actual implementation - likely includes:)*
- List of subscriptions as cards or table rows
- Each subscription may show:
  - Subscription name (e.g., "Netflix", "Spotify Premium")
  - Vendor name
  - Monthly/Annual cost
  - Billing frequency (Monthly, Quarterly, Annual)
  - Next billing date
  - Payment method (Account, Credit Card)
  - Status (Active, Cancelled, Paused)
  - Actions menu

### 4. Create New Subscription

#### 4.1 Initiate Subscription Creation
- User clicks "Add Subscription" button
- *(Drawer or modal opens - to be documented based on actual implementation)*

#### 4.2 Subscription Creation Form
*(To be populated based on actual form fields - likely includes:)*
- Subscription name (required)
- Vendor selection (link to existing vendor or create new)
- Amount (required)
- Billing frequency (Monthly, Quarterly, Annual)
- Start date
- Payment method (Account or Credit Card selection)
- Category (optional)
- Notes (optional)

#### 4.3 Save Subscription
- User fills form and submits
- Subscription is created
- Subscription list refreshes
- Success notification appears
- *(May automatically create recurring transactions)*

### 5. View Subscription Details

#### 5.1 Access Subscription Details
- User clicks on a subscription (if clickable)
- *(May navigate to subscription detail page or open drawer - to be documented)*

#### 5.2 Subscription Detail View
*(To be populated based on actual implementation - may include:)*
- Subscription information
- Payment history
- Upcoming payments
- Total spent
- Billing schedule
- Transaction history linked to subscription

### 6. Edit Subscription

#### 6.1 Access Edit Mode
- User clicks edit action on subscription
- Edit form opens with pre-populated data

#### 6.2 Update Subscription
- User modifies fields (amount, frequency, etc.)
- User saves changes
- Subscription updates
- List refreshes with updated data
- *(Future payments may be affected)*

### 7. Manage Subscription Status

#### 7.1 Pause Subscription
- User selects "Pause" action
- Subscription is paused
- No future transactions created
- Can be resumed later

#### 7.2 Cancel Subscription
- User selects "Cancel" action
- Confirmation dialog appears
- User confirms cancellation
- Subscription is cancelled
- No future transactions created
- Historical data preserved

#### 7.3 Resume Subscription
- User selects "Resume" on paused subscription
- Subscription becomes active again
- Future transactions resume

### 8. Subscription Transactions

#### 8.1 Automatic Transaction Creation
- Subscriptions may automatically create transactions
- Transactions created based on billing frequency
- Linked to subscription for tracking

#### 8.2 View Subscription Transactions
- User can view all transactions linked to subscription
- See payment history
- Track subscription spending over time

## User Interactions

### Subscription-Vendor Relationship
- Subscriptions can be linked to vendors
- When creating subscription, user can select or create vendor
- Vendor information displayed on subscription

### Subscription-Transaction Relationship
- Subscriptions generate recurring transactions
- Transactions automatically linked to subscription
- Can view all transactions for a subscription
- Can manually add transactions to subscription

### Date Range Filtering
- Date range selector affects subscription data
- May filter transactions or spending by date range
- Shows subscriptions active in selected period

## Technical Details

### Subscription Data Structure
- Subscription ID (UUID)
- Subscription name
- Vendor ID (optional)
- Amount
- Billing frequency (Monthly, Quarterly, Annual)
- Start date
- Next billing date
- Payment method (Account ID or Credit Card ID)
- Status (Active, Paused, Cancelled)
- Category ID (optional)
- User ID (for ownership)
- Created/updated timestamps

### Billing Frequency
- **Monthly:** Transactions created every month
- **Quarterly:** Transactions created every 3 months
- **Annual:** Transactions created every year

### Automatic Transaction Generation
- System may automatically create transactions based on billing schedule
- Transactions created on next billing date
- Linked to subscription for tracking

## User Experience Considerations
- Clear subscription list with all relevant information
- Quick access to create new subscriptions
- Easy status management (pause, cancel, resume)
- Integration with vendor management
- Automatic transaction generation for convenience
- Payment history tracking
- Upcoming payment reminders
- Date range filtering for analysis

## Related Features
- Vendor management (subscriptions linked to vendors)
- Transaction management (subscriptions generate transactions)
- Account/Credit Card management (payment methods)
- Category management (subscription categorization)

## Current Status
- Subscription management page is implemented
- API integration in progress (some 404 errors observed)
- Full functionality to be documented as features are completed

