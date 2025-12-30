# User Journey: Transaction Management

## Overview
Users track and manage their financial transactions (income and expenses) through the Transactions section. This journey covers viewing, creating, editing, and deleting transactions.

## Journey Flow

### 1. Access Transactions Section
- **Entry Point:** User clicks "Transactions" in navigation menu
- **URL:** `/transactions?from=2025-12-01&to=2025-12-31`
- **Page Title:** "Transaction History"

### 2. Transactions List View

#### 2.1 Page Header
- **Icon and Title:** "Transaction History" heading
- **Transaction Count:** "X transactions found" (e.g., "2 transactions found")

#### 2.2 Action Buttons
- **Manage Categories:** Opens category management drawer
  - URL: `/transactions?drawer=category-manager`
  - Button with icon and text
- **Add Transaction:** Opens transaction creation drawer
  - URL: `/transactions?drawer=transaction-create`
  - Button with icon and text

#### 2.3 Transaction List Controls
- **Select All Checkbox:** "Select All" button with icon
  - Shows count: "X transactions"
  - Allows bulk selection of transactions

#### 2.4 Transaction Items
Each transaction displays:
- **Icon:** Transaction type indicator
- **Description:** Transaction description (e.g., "Test", "Test 2")
- **Date:** Formatted date (e.g., "Dec 28, 2025", "Dec 17, 2025")
- **Amount:** Formatted amount with currency (e.g., "-$453.20", "-$23.00")
- **Category:** Category name or ID (e.g., "Fun", "61f64e62-f994-4aa6-a118-d1060bb5c308")
- **Checkbox:** For selection
- **Edit Icon:** Clickable edit button
- **Delete Icon:** Clickable delete button

### 3. Create New Transaction

#### 3.1 Initiate Transaction Creation
- User clicks "Add Transaction" button
- Drawer opens with URL parameter: `?drawer=transaction-create`
- Transaction creation form appears

#### 3.2 Transaction Form Fields
*(To be populated based on actual form - likely includes:)*
- Description
- Amount
- Date
- Type (Income/Expense)
- Category selection
- Account selection (or Credit Card)
- Payment status (Paid/Unpaid)
- Notes (optional)

#### 3.3 Save Transaction
- User fills form and submits
- Transaction is created
- Drawer closes
- Transaction list refreshes
- Success notification appears
- Account balance updates if linked to account

### 4. Edit Transaction

#### 4.1 Access Edit Mode
- User clicks edit icon on a transaction
- Edit drawer/modal opens
- Form pre-populated with transaction data

#### 4.2 Update Transaction
- User modifies fields
- User saves changes
- Transaction updates
- List refreshes with updated data
- Account balance recalculates if amount changed

### 5. Delete Transaction

#### 5.1 Initiate Deletion
- User clicks delete icon on a transaction
- Confirmation dialog appears (likely)

#### 5.2 Confirm Deletion
- User confirms deletion
- Transaction is removed
- List refreshes
- Account balance updates
- Success notification appears

### 6. Bulk Operations

#### 6.1 Select Multiple Transactions
- User clicks "Select All" or individual checkboxes
- Selected transactions are highlighted
- Bulk action options may appear

#### 6.2 Bulk Actions
*(To be populated based on actual implementation - may include:)*
- Bulk delete
- Bulk category assignment
- Bulk status update

### 7. Manage Categories

#### 7.1 Access Category Management
- User clicks "Manage Categories" button
- Drawer opens with URL parameter: `?drawer=category-manager`
- Category management interface appears

#### 7.2 Category Operations
*(To be populated based on actual implementation - may include:)*
- View all categories
- Create new category
- Edit category
- Delete category
- Assign category to transactions

## User Interactions

### Filtering Transactions
- Date range selector affects transaction list
- Transactions filtered by selected date range
- Count updates based on filtered results

### Sorting Transactions
*(To be documented based on actual implementation)*
- May include sorting by date, amount, category
- Ascending/descending order options

### Searching Transactions
*(To be documented based on actual implementation)*
- Search by description
- Search by category
- Search by amount range

### Category Assignment
- Transactions can be assigned to categories
- Categories displayed on transaction items
- Category management accessible from transaction page

## Technical Details

### Transaction Data Structure
- Transaction ID (UUID)
- Description
- Amount (positive for income, negative for expenses)
- Date
- Type (Income/Expense)
- Category ID or name
- Account ID or Credit Card ID
- Payment status
- User ID (for ownership)

### Transaction Types
- **Income:** Positive amounts, increases account balance
- **Expense:** Negative amounts, decreases account balance

### Account Linking
- Transactions can be linked to:
  - Bank accounts
  - Investment accounts
  - Credit cards
- Only one link type per transaction (XOR constraint)

## User Experience Considerations
- Clear transaction list with all relevant information
- Quick access to add new transactions
- Easy editing and deletion of transactions
- Category management integrated into transaction flow
- Visual indicators for transaction types
- Bulk operations for efficiency
- Date range filtering for focused analysis
- Real-time balance updates when transactions change

## Related Features
- Account management (transactions linked to accounts)
- Category management
- Credit card management
- Dashboard (transaction data feeds dashboard)

