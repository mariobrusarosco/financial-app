# User Journey: Category Management

## Overview
Users manage transaction categories to organize and track their expenses and income. Categories help with budgeting, reporting, and financial analysis.

## Journey Flow

### 1. Access Category Management

#### 1.1 From Transactions Page
- **Entry Point:** User clicks "Manage Categories" button on Transactions page
- **URL:** `/transactions?drawer=category-manager`
- **Method:** Drawer opens over transactions page

#### 1.2 Alternative Access
- *(May be accessible from Settings or other locations - to be documented)*

### 2. Category Management Interface

#### 2.1 Category List
- List of all user's categories displayed
- Categories may be organized by:
  - Default categories (system-provided)
  - Custom categories (user-created)
  - Category groups or types

#### 2.2 Category Display
Each category may show:
- **Category Name** (e.g., "Fun", "Groceries", "Transportation")
- **Category Icon/Color** (visual identifier)
- **Transaction Count** (number of transactions in this category)
- **Total Amount** (total spending/income in this category)
- **Actions Menu** (edit, delete options)

### 3. Create New Category

#### 3.1 Initiate Category Creation
- User clicks "Add Category" or "Create Category" button
- Category creation form appears in drawer or modal

#### 3.2 Category Creation Form
*(To be populated based on actual form fields - likely includes:)*
- **Category Name** (required)
- **Category Type** (Income, Expense, or Both)
- **Icon Selection** (choose icon for category)
- **Color Selection** (choose color for category)
- **Parent Category** (optional - for subcategories)
- **Description** (optional)

#### 3.3 Save Category
- User fills form and submits
- Category is created
- Category list refreshes
- Success notification appears
- Category available for transaction assignment

### 4. Edit Category

#### 4.1 Access Edit Mode
- User clicks edit action on a category
- Edit form opens with pre-populated data

#### 4.2 Update Category
- User modifies fields (name, icon, color, etc.)
- User saves changes
- Category updates
- List refreshes with updated data
- Existing transactions using category are updated

### 5. Delete Category

#### 5.1 Initiate Deletion
- User clicks delete action on a category
- Confirmation dialog appears
- *(May show warning if category has associated transactions)*

#### 5.2 Confirm Deletion
- User confirms deletion
- *(May need to reassign transactions to another category)*
- Category is removed
- List refreshes
- Success notification appears

### 6. Assign Category to Transactions

#### 6.1 From Category Manager
- User may be able to view transactions for a category
- User may be able to bulk assign category to transactions

#### 6.2 From Transaction List
- User can assign category when creating/editing transaction
- Category dropdown shows all available categories
- Recently used categories may be highlighted

### 7. Category Organization

#### 7.1 Category Groups
*(To be documented based on actual implementation - may include:)*
- Categories grouped by type (Income, Expense)
- Custom category groups
- Subcategories (parent-child relationships)

#### 7.2 Category Sorting
- Categories may be sortable
- Custom sort order
- Alphabetical sorting option

## User Interactions

### Category-Transaction Relationship
- Every transaction can be assigned a category
- Categories help organize and analyze spending
- Transactions can be filtered by category
- Category totals shown in reports and dashboards

### Category Usage
- Categories displayed on transaction items
- Category icons/colors provide visual identification
- Category statistics (count, totals) help with budgeting

### Bulk Category Operations
*(To be documented based on actual implementation - may include:)*
- Bulk assign category to multiple transactions
- Bulk change category for transactions
- Merge categories

## Technical Details

### Category Data Structure
- Category ID (UUID)
- Category name
- Category type (Income, Expense, Both)
- Icon identifier
- Color code
- Parent category ID (optional - for subcategories)
- User ID (for ownership - custom categories)
- Is default (system-provided vs user-created)
- Created/updated timestamps

### Default Categories
- System may provide default categories
- Users can create custom categories
- Default categories may not be deletable

### Category Types
- **Income Categories:** For income transactions
- **Expense Categories:** For expense transactions
- **Both:** Categories that can be used for both

## User Experience Considerations
- Easy access from transaction management
- Visual categories with icons and colors
- Quick category creation and editing
- Category statistics for budgeting insights
- Integration with transaction creation/editing
- Bulk operations for efficiency
- Clear organization and grouping

## Related Features
- Transaction management (categories assigned to transactions)
- Dashboard (category-based analysis)
- Reports (category breakdowns)
- Budgeting (category-based budgets)

## Current Status
- Category management accessible from Transactions page
- Full functionality to be documented as features are completed
- Integration with transaction management in progress

