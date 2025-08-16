// Investment Portfolio Types
export interface I_Investment {
  id: string;
  broker_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Investment Movement Types (deposits/withdrawals)
export interface I_InvestmentMovement {
  id: string;
  investment_id: string;
  date: string;
  amount: string;
  movement_type: 'deposit' | 'withdrawal';
  description?: string;
  created_at: string;
  updated_at: string;
}

// Investment Balance Types (point-in-time balances)
export interface I_InvestmentBalance {
  id: string;
  investment_id: string;
  date: string;
  balance: string;
  growth_amount?: string;
  growth_percentage?: number;
  created_at: string;
  updated_at: string;
}

// Investment Balance with calculated fields
export interface I_InvestmentBalanceWithCalculations extends I_InvestmentBalance {
  movement_amount?: string;
  previous_balance?: string;
  diff_amount: string;
  diff_percentage: number;
}

// Create Investment Request
export interface I_CreateInvestmentRequest {
  broker_id: string;
  name: string;
  description?: string;
}

// Create Investment Movement Request
export interface I_CreateInvestmentMovementRequest {
  investment_id: string;
  date: string;
  amount: number;
  movement_type: 'deposit' | 'withdrawal';
  description?: string;
}

// Create Investment Balance Request
export interface I_CreateInvestmentBalanceRequest {
  investment_id: string;
  date: string;
  balance: number;
}

// Investment Summary/Portfolio Response
export interface I_InvestmentPortfolio {
  investment: I_Investment;
  current_balance: string;
  total_invested: string;
  total_growth: string;
  growth_percentage: number;
  last_updated: string;
}

// Investment Balance History Response
export interface I_InvestmentBalanceHistoryParams {
  investment_id?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
  sort_by?: 'date' | 'balance' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface I_InvestmentBalanceHistoryResponse {
  data: I_InvestmentBalanceWithCalculations[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

// Investment Performance Types
export interface I_InvestmentPerformance {
  investment_id: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date: string;
  start_balance: string;
  end_balance: string;
  total_movements: string;
  net_growth: string;
  growth_percentage: number;
}

// All Investments Response
export interface I_InvestmentsResponse {
  data: I_InvestmentPortfolio[];
  meta: {
    total: number;
    total_balance: string;
    total_growth: string;
    overall_growth_percentage: number;
  };
}
