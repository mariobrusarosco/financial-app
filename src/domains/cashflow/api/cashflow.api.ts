import { apiClient } from '@/config/api';
import type {
  I_CashflowFilter,
  I_CashflowSummary,
  I_MonthlyCashflow,
} from '@/domains/cashflow/types/index';

const toMonthlyCashflow = (month: I_MonthlyCashflowResponse): I_MonthlyCashflow => ({
  month: month.month,
  income: Number(month.income),
  expenses: Number(month.expenses),
  savings: Number(month.savings),
  investments: Number(month.investments),
});

const toCashflowSummary = (summary: I_CashflowSummaryResponse): I_CashflowSummary => ({
  total_income: Number(summary.total_income),
  total_expenses: Number(summary.total_expenses),
  net_cashflow: Number(summary.net_cashflow),
  savings_rate: summary.savings_rate,
  monthly_data: summary.monthly_data.map(toMonthlyCashflow),
});

export const cashflowApi = {
  getSummary: async (filters: I_CashflowFilter): Promise<I_CashflowSummary> => {
    const response = await apiClient.get<I_CashflowSummaryResponse>('/cashflow', {
      params: filters,
    });

    return toCashflowSummary(response.data);
  },
};

interface I_MonthlyCashflowResponse {
  month: string;
  income: string;
  expenses: string;
  savings: string;
  investments: string;
}

interface I_CashflowSummaryResponse {
  total_income: string;
  total_expenses: string;
  net_cashflow: string;
  savings_rate: number;
  monthly_data: I_MonthlyCashflowResponse[];
}
