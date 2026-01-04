# Backend Request: Cashflow Analytics Endpoint

## Context
We are implementing a **Cashflow Dashboard** to visualize income, expenses, and savings over time (monthly breakdown). Currently, we are calculating these metrics on the client-side by fetching individual transactions.

## The Problem
The existing `GET /transactions` endpoint enforces a hard pagination limit (`per_page` cannot exceed 100). 
- To accurately calculate cashflow for a Year-to-Date (YTD) or 1-Year view, we often need to process far more than 100 transactions.
- Since we cannot fetch all transactions in a single request, we are forced to either:
    1. Display incomplete data (truncated to the first 100 transactions).
    2. Implement complex recursive fetching on the client (fetching page 1, then page 2, etc.), which is inefficient and slow.

## The Request
We need a way to retrieve **aggregated cashflow data** or **all relevant transactions** for a specific date range without pagination limits.

### Option A: Dedicated Analytics Endpoint (Preferred)
A new endpoint that returns pre-aggregated monthly totals. This is the most efficient approach as it reduces payload size and offloads calculation to the database.

**Proposed Endpoint:**
`GET /api/v1/analytics/cashflow`

**Parameters:**
- `date_from`: ISO Date (YYYY-MM-DD)
- `date_to`: ISO Date (YYYY-MM-DD)
- `account_id`: (Optional) Filter by specific account

**Response Format:**
```json
{
  "total_income": 50000.00,
  "total_expenses": 30000.00,
  "net_cashflow": 20000.00,
  "savings_rate": 40.0,
  "monthly_data": [
    {
      "month": "2024-01",
      "income": 10000.00,
      "expenses": 6000.00,
      "savings": 4000.00,
      "investments": 1000.00
    },
    {
      "month": "2024-02",
      "income": 12000.00,
      "expenses": 7000.00,
      "savings": 5000.00,
      "investments": 1500.00
    }
    // ...
  ]
}
```

### Option B: Non-Paginated Transactions
Alternatively, allow us to bypass pagination for specific reporting use cases.

**Proposed Change:**
Allow `per_page=-1` or a `pagination=false` flag on the existing `GET /transactions` endpoint.

**Example:**
`GET /api/v1/transactions?date_from=2024-01-01&date_to=2024-12-31&pagination=false`

---

**Priority:** High
**Impact:** The Cashflow Dashboard currently displays incomplete data for users with high transaction volumes (>100/month) when viewing longer date ranges.
