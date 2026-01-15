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
