# User Journey: Broker Management

## Overview

Users manage their investment brokers through the Brokers section. Brokers are financial institutions that hold investment accounts.

## Journey Flow

### 1. Access Brokers Section

- **Entry Point:** User clicks "Brokers" in navigation menu
- **URL:** `/brokers?from=2025-12-01&to=2025-12-31`
- **Page Title:** "Brokers"

### 2. Brokers List View

#### 2.1 Page Header

- **Icon and Title:** "Brokers" heading
- **Action Button:** "Add" button (top right) to create new broker

#### 2.2 Brokers Display

- List of user's brokers displayed as cards
- Each broker card shows:
  - **Broker Name** (e.g., "Chase", "Wells Fargo")
  - **Broker Type:** "Investment Broker" label
  - **Menu Button:** "Open menu" button (three dots icon) for actions

### 3. Create New Broker

#### 3.1 Initiate Broker Creation

- User clicks "Add" button on brokers list page
- _(Drawer or modal opens - to be documented based on actual implementation)_

#### 3.2 Broker Creation Form

_(To be populated based on actual form fields - likely includes:)_

- Broker name
- Broker type (Investment Broker, etc.)
- Contact information (optional)
- Notes (optional)

#### 3.3 Save Broker

- User fills form and submits
- Broker is created
- Broker list refreshes
- Success notification appears

### 4. Broker Actions Menu

#### 4.1 Access Menu

- User clicks "Open menu" button on a broker card
- Dropdown menu appears with options

#### 4.2 Menu Options

_(To be populated based on actual implementation - likely includes:)_

- **Edit Broker:** Opens edit form
- **View Accounts:** Navigate to accounts linked to this broker
- **Delete Broker:** Remove broker (with confirmation)

### 5. Edit Broker

#### 5.1 Access Edit Mode

- User selects "Edit Broker" from menu
- Edit form opens with pre-populated data

#### 5.2 Update Broker

- User modifies fields
- User saves changes
- Broker updates
- List refreshes with updated data

### 6. Delete Broker

#### 6.1 Initiate Deletion

- User selects "Delete Broker" from menu
- Confirmation dialog appears

#### 6.2 Confirm Deletion

- User confirms deletion
- Broker is removed
- List refreshes
- Success notification appears
- _(Note: May require handling of associated accounts)_

### 7. View Broker Accounts

#### 7.1 Navigate to Accounts

- User selects "View Accounts" from menu
- _(May navigate to accounts page filtered by broker, or show accounts in a modal)_

#### 7.2 Broker's Accounts

- List of accounts associated with this broker
- Can create new account for this broker
- Can manage existing accounts

## User Interactions

### Broker-Account Relationship

- Brokers are linked to investment accounts
- When creating an investment account, user selects a broker
- Broker information displayed on account detail pages
- Accounts can be filtered by broker

### Date Range Filtering

- Date range selector may affect broker-related data
- May filter accounts or transactions by broker within date range

## Technical Details

### Broker Data Structure

- Broker ID (UUID)
- Broker name
- Broker type (e.g., "Investment Broker")
- User ID (for ownership)
- Created/updated timestamps

### Broker-Account Relationship

- Investment accounts must be linked to a broker
- Bank accounts may not require a broker
- One broker can have multiple accounts
- Broker deletion may require handling of associated accounts

## User Experience Considerations

- Simple list view for easy broker management
- Quick access to create new brokers
- Menu-based actions for each broker
- Clear indication of broker type
- Integration with account management
- Confirmation dialogs for destructive actions

## Related Features

- Account management (brokers linked to investment accounts)
- Investment tracking
- Transaction management (transactions on broker accounts)
