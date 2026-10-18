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

// Cashflow views: view → groups → tags
export interface I_CashflowViewGroupResponse {
  id: string;
  name: string;
  tag_ids: string[];
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

export interface I_CashflowViewGroupPayload {
  name: string;
  tag_ids: string[];
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

export interface I_CashflowViewSummaryResponse {
  groups: {
    group_id: string;
    // Decimal strings, e.g. "1240.00". A group counts each expense once
    total: string;
    count: number;
    tags: { tag_id: string; total: string; count: number }[];
  }[];
}

export interface I_CashflowViewOverlapResponse {
  transaction_id: string;
  description: string;
  amount: string;
  date: string;
  group_ids: string[];
}

export type I_CashflowViewOverlapsResponse = I_CashflowViewOverlapResponse[];
