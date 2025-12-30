# User Journey: Account Management

## Overview
Users manage their financial accounts (bank accounts, investment accounts) through the Accounts section. This journey covers viewing, creating, and managing accounts.

## Journey Flow

### 1. Access Accounts Section
- **Entry Point:** User clicks "Accounts" in navigation menu
- **URL:** `/accounts?from=2025-12-01&to=2025-12-31`
- **Page Title:** "Accounts"

### 2. Accounts List View

#### 2.1 Page Header
- **Title:** "Accounts" with icon
- **Action Button:** "Add" button (top right) to create new account

#### 2.2 Accounts Display
- List of user's accounts displayed as cards
- Each account card shows:
  - **Account Name** (e.g., "Chase Cash", "Wells Fargo Investments")
  - **Balance** (e.g., "-$23.00") with currency indicator
  - **Clickable Area:** Entire card is clickable to view account details

### 3. View Account Details

#### 3.1 Navigate to Account
- User clicks on an account card
- Navigates to: `/accounts/{account-id}?from=2025-12-01&to=2025-12-31`

#### 3.2 Account Detail Page Layout

**Header Section:**
- **Account Type Badge:** "Bank Account" or "Investment Account"
- **Account Name:** Large heading (e.g., "Chase Cash")
- **Back Button:** "Back to Accounts" link to return to list

**Tab Navigation:**
- **Overview** (default/selected) - Account summary and balance
- **Statements** - Account statements
- **Expenses** - Expenses linked to this account
- **Income** - Income linked to this account
- **Credit Cards** - Credit cards associated with this account

#### 3.3 Overview Tab Content

**Balance Section:**
- **Balance Label:** "Balance"
- **Current Balance:** Large display (e.g., "R$18,363.15")
- **Currency Indicator:** Shows account currency
- **Transaction Button:** "Transaction" button to add new transaction

**Balance History Chart:**
- **Section Title:** "Balance History"
- **Chart Display:** Line chart showing balance over time
- **X-Axis:** Date labels (e.g., Dec 3, Dec 9, Dec 15, Dec 22, Dec 30)
- **Y-Axis:** Balance range (e.g., R$-17.850,00 to R$-18.450,00)
- **Tooltip:** Shows balance value on hover (e.g., "R$-17.850,00")

**Account Transactions Section:**
- **Section Title:** "Account Transactions"
- **Description:** "Account and credit card transactions for this account"
- **Loading State:** "Loading transactions..." with spinner
- **Transaction List:** (Populated when data loads)

### 4. Create New Account

#### 4.1 Initiate Account Creation
- User clicks "Add" button on accounts list page
- *(Drawer or modal opens - to be documented based on actual implementation)*

#### 4.2 Account Creation Form
*(To be populated based on actual form fields - likely includes:)*
- Account name
- Account type (Bank Account, Investment Account)
- Broker selection (for investment accounts)
- Initial balance
- Currency
- Account number (optional)

#### 4.3 Save Account
- User fills form and submits
- Account is created
- User is redirected to new account detail page or accounts list
- Success notification appears

### 5. Other Tab Views

#### 5.1 Statements Tab
- **URL:** `/accounts/{account-id}/statements`
- View and manage account statements
- Upload new statements
- View statement history

#### 5.2 Expenses Tab
- **URL:** `/accounts/{account-id}/expenses`
- Filtered view of expenses linked to this account
- Transaction list showing only expenses

#### 5.3 Income Tab
- **URL:** `/accounts/{account-id}/income`
- Filtered view of income linked to this account
- Transaction list showing only income

#### 5.4 Credit Cards Tab
- **URL:** `/accounts/{account-id}/credit-card`
- Credit cards associated with this account
- Manage credit card relationships

## User Interactions

### Filtering by Date Range
- Date range selector (from dashboard) affects account data
- Balance history chart updates based on selected range
- Transactions filtered by date range

### Adding Transaction from Account
1. User clicks "Transaction" button on account detail page
2. Transaction creation form opens
3. Account is pre-selected
4. User completes transaction details
5. Transaction is created and linked to account
6. Account balance updates automatically

### Navigation Between Accounts
1. User clicks "Back to Accounts" button
2. Returns to accounts list view
3. Can select different account to view

## Technical Details

### Account Data Structure
- Account ID (UUID format)
- Account name
- Account type
- Balance (with currency)
- Associated broker (for investment accounts)
- Date range filtering support

### Balance Calculation
- Balance updates automatically when transactions are added
- Balance history tracked over time
- Chart visualization of balance trends

## User Experience Considerations
- Clear visual hierarchy with account cards
- Easy navigation between list and detail views
- Tabbed interface for organized account information
- Visual balance history for trend analysis
- Quick access to add transactions from account view
- Consistent date range filtering across views

## Related Features
- Transaction management (linked to accounts)
- Broker management (for investment accounts)
- Statement management
- Credit card management

