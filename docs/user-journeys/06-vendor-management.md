# User Journey: Vendor Management

## Overview

Users manage vendors (merchants, service providers) through the Vendors section. Vendors are entities that users make payments to, helping with expense categorization and tracking.

## Journey Flow

### 1. Access Vendors Section

- **Entry Point:** User clicks "Vendors" in navigation menu
- **URL:** `/vendors?from=2025-12-01&to=2025-12-31`
- **Page Title:** "Vendors"

### 2. Vendors List View

#### 2.1 Page Header

- **Icon and Title:** "Vendors" heading
- **Action Button:** "Add Vendor" button (top right) to create new vendor

#### 2.2 Loading State

- Initial state shows: "Loading vendors..." with spinner
- Data loads from API
- List populates when data is available

### 3. Vendors Display

_(To be populated based on actual implementation - likely includes:)_

- List of vendors as cards or table rows
- Each vendor may show:
  - Vendor name
  - Transaction count
  - Total amount spent
  - Last transaction date
  - Category association
  - Actions menu

### 4. Create New Vendor

#### 4.1 Initiate Vendor Creation

- User clicks "Add Vendor" button
- _(Drawer or modal opens - to be documented based on actual implementation)_

#### 4.2 Vendor Creation Form

_(To be populated based on actual form fields - likely includes:)_

- Vendor name (required)
- Category (optional - default category for vendor transactions)
- Notes (optional)
- Contact information (optional)

#### 4.3 Save Vendor

- User fills form and submits
- Vendor is created
- Vendor list refreshes
- Success notification appears

### 5. View Vendor Details

#### 5.1 Access Vendor Details

- User clicks on a vendor (if clickable)
- _(May navigate to vendor detail page or open drawer - to be documented)_

#### 5.2 Vendor Detail View

_(To be populated based on actual implementation - may include:)_

- Vendor information
- Associated transactions list
- Total spending with this vendor
- Transaction history
- Category breakdown

### 6. Edit Vendor

#### 6.1 Access Edit Mode

- User clicks edit action on vendor
- Edit form opens with pre-populated data

#### 6.2 Update Vendor

- User modifies fields
- User saves changes
- Vendor updates
- List refreshes with updated data

### 7. Delete Vendor

#### 7.1 Initiate Deletion

- User clicks delete action on vendor
- Confirmation dialog appears

#### 7.2 Confirm Deletion

- User confirms deletion
- Vendor is removed
- List refreshes
- Success notification appears
- _(Note: Associated transactions may need handling)_

## User Interactions

### Vendor-Transaction Relationship

- Transactions can be linked to vendors
- When creating a transaction, user can select a vendor
- Vendor information helps with expense categorization
- Transactions can be filtered by vendor

### Vendor-Category Association

- Vendors can have default categories
- When creating transaction with vendor, category may auto-populate
- Helps with consistent categorization

### Date Range Filtering

- Date range selector affects vendor-related data
- May filter transactions or spending totals by date range

## Technical Details

### Vendor Data Structure

- Vendor ID (UUID)
- Vendor name
- Default category ID (optional)
- User ID (for ownership)
- Created/updated timestamps

### Vendor-Transaction Relationship

- Transactions can optionally be linked to vendors
- One vendor can have multiple transactions
- Vendor deletion may require handling of associated transactions

## User Experience Considerations

- Simple interface for vendor management
- Quick access to create new vendors
- Integration with transaction creation
- Category association for easier expense tracking
- Loading states for better UX
- Error handling for API failures

## Related Features

- Transaction management (vendors linked to transactions)
- Category management (vendors can have default categories)
- Expense tracking (vendor-based expense analysis)

## Current Status

- Vendor management page is implemented
- API integration in progress (some 404 errors observed)
- Full functionality to be documented as features are completed
