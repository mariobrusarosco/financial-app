export interface I_MonthlyCashflow {
  month: string; // e.g., "Jan", "2024-01"
  income: number;
  expenses: number;
  savings: number;
  investments: number;
}

export interface I_CashflowFilter {
  date_from?: string;
  date_to?: string;
  account_id?: string;
}

export interface I_CashflowSummary {
  total_income: number;
  total_expenses: number;
  net_cashflow: number;
  savings_rate: number;
  monthly_data: I_MonthlyCashflow[];
}

// Cashflow views: view → groups → tags, or view → groups → sub-groups → tags
export type T_CashflowViewGroupMatch = 'any' | 'all';

export interface I_CashflowViewGroupResponse {
  id: string;
  name: string;
  // How a group holding tags matches expenses; null on a group holding sub-groups
  match: T_CashflowViewGroupMatch | null;
  tag_ids: string[];
  // Always [] on a sub-group
  groups: I_CashflowViewGroupResponse[];
}

export interface I_CashflowViewResponse {
  id: string;
  name: string;
  display_order: number;
  groups: I_CashflowViewGroupResponse[];
  created_at: string;
  updated_at: string;
}

export type I_CashflowViewsResponse = I_CashflowViewResponse[];

// A group sends either tags (with `match`) or sub-groups, never both
export interface I_CashflowViewGroupPayload {
  name: string;
  match: T_CashflowViewGroupMatch | null;
  tag_ids: string[];
  groups: I_CashflowViewGroupPayload[];
}

export interface I_CashflowViewPayload {
  name: string;
  groups?: I_CashflowViewGroupPayload[];
  display_order?: number;
}

// Omitted fields stay unchanged; `groups`, when sent, replaces the whole list
export type I_CashflowViewUpdatePayload = Partial<I_CashflowViewPayload>;

export interface I_CashflowViewReportParams {
  date_from?: string;
  date_to?: string;
  movement_type?: 'expense' | 'income' | 'investment' | 'transfer';
}

export interface I_CashflowViewGroupSummaryResponse {
  group_id: string;
  // Decimal string, e.g. "1240.00". A parent counts each expense once, so its total can be
  // less than the sum of its sub-groups
  total: string;
  count: number;
  groups: I_CashflowViewGroupSummaryResponse[];
}

export interface I_CashflowViewSummaryResponse {
  groups: I_CashflowViewGroupSummaryResponse[];
  // Expenses that match none of the view's groups. Not "total minus groups": groups can overlap
  ungrouped: { total: string; count: number };
}

export interface I_CashflowViewGroupTransactionsParams extends I_CashflowViewReportParams {
  page?: number;
  // Max 100
  per_page?: number;
}

// Compact transaction behind a group's total
export interface I_CashflowViewGroupTransactionResponse {
  id: string;
  date: string;
  description: string;
  // Decimal string, always positive
  amount: string;
  account: { id: string; name: string } | null;
  credit_card: { id: string; name: string } | null;
}

export interface I_CashflowViewGroupTransactionsResponse {
  data: I_CashflowViewGroupTransactionResponse[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface I_CashflowViewOverlapResponse {
  transaction_id: string;
  description: string;
  amount: string;
  date: string;
  group_ids: string[];
}

export type I_CashflowViewOverlapsResponse = I_CashflowViewOverlapResponse[];
