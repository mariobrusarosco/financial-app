# Backend Request: Multi-Value Filtering for Transactions

## Context
We are improving the **Transactions History** UI by adding checkboxes for "Income" and "Expense". Users expect to be able to select both to see their full cashflow while excluding "Transfer" or "Investment" types.

## The Problem
The current `GET /transactions` API only accepts a single string for the `movement_type` parameter (e.g., `?movement_type=expense`). 
- If a user selects both "Income" and "Expense" in the UI, we are currently forced to pick one or send no filter at all (which includes everything, like Transfers).
- There is no way to request a specific subset of transaction types.

## The Request
We need the transaction filtering endpoints to support **multiple values** for specific parameters.

### 1. Multi-Value `movement_type`
Allow passing multiple movement types in a single request.

**Proposed Implementation:**
Comma-separated values or repeated parameters.
`GET /api/v1/transactions?movement_type=income,expense`
OR
`GET /api/v1/transactions?movement_type[]=income&movement_type[]=expense`

### 2. Multi-Value `category_id` (Optional but Recommended)
Similarly, it would be highly beneficial to filter by multiple categories at once.
`GET /api/v1/transactions?category_id=uuid1,uuid2`

---

**Impact:** Enabling this will allow for a much more flexible and "pro" filtering experience in the Transactions History screen, similar to modern banking apps.
