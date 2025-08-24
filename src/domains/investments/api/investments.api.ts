import { apiClient } from '@/config/api';
import type {
  I_Investment,
  I_InvestmentMovement,
  I_InvestmentBalance,
  I_InvestmentPortfolio,
  I_InvestmentsResponse,
  I_InvestmentBalanceHistoryParams,
  I_InvestmentBalanceHistoryResponse,
  I_CreateInvestmentRequest,
  I_CreateInvestmentMovementRequest,
  I_CreateInvestmentBalanceRequest,
  I_MonthlyBalanceSummary,
  I_MonthlyBalanceSummaryParams,
  I_CreateBalancePointRequest,
  I_CreateBalancePointResponse,
} from '../types/types-and-interfaces';

export const investmentsApi = {
  // Investments CRUD
  getAllInvestments: async (): Promise<I_InvestmentsResponse> => {
    const response = await apiClient.get<I_InvestmentsResponse>('/investments');
    return response.data;
  },

  getInvestment: async (investmentId: string): Promise<I_InvestmentPortfolio> => {
    const response = await apiClient.get<I_InvestmentPortfolio>(`/investments/${investmentId}`);
    return response.data;
  },

  createInvestment: async (investment: I_CreateInvestmentRequest): Promise<I_Investment> => {
    const response = await apiClient.post<I_Investment>('/investments', investment);
    return response.data;
  },

  updateInvestment: async (
    investmentId: string,
    investment: Partial<I_CreateInvestmentRequest>
  ): Promise<I_Investment> => {
    const response = await apiClient.put<I_Investment>(`/investments/${investmentId}`, investment);
    return response.data;
  },

  deleteInvestment: async (investmentId: string): Promise<void> => {
    await apiClient.delete(`/investments/${investmentId}`);
  },

  // Investment Movements
  createMovement: async (
    movement: I_CreateInvestmentMovementRequest
  ): Promise<I_InvestmentMovement> => {
    const response = await apiClient.post<I_InvestmentMovement>('/investments/movements', movement);
    return response.data;
  },

  getInvestmentMovements: async (investmentId: string): Promise<I_InvestmentMovement[]> => {
    const response = await apiClient.get<I_InvestmentMovement[]>(
      `/investments/${investmentId}/movements`
    );
    return response.data;
  },

  // Investment Balances
  createBalance: async (
    balance: I_CreateInvestmentBalanceRequest
  ): Promise<I_InvestmentBalance> => {
    const response = await apiClient.post<I_InvestmentBalance>('/investments/balances', balance);
    return response.data;
  },

  getInvestmentBalanceHistory: async (
    investmentId: string,
    params?: I_InvestmentBalanceHistoryParams
  ): Promise<I_InvestmentBalanceHistoryResponse> => {
    const response = await apiClient.get<I_InvestmentBalanceHistoryResponse>(
      `/investments/${investmentId}/balances`,
      { params }
    );
    return response.data;
  },

  getAllInvestmentBalances: async (
    params?: I_InvestmentBalanceHistoryParams
  ): Promise<I_InvestmentBalanceHistoryResponse> => {
    const response = await apiClient.get<I_InvestmentBalanceHistoryResponse>(
      '/investments/balances',
      { params }
    );
    return response.data;
  },

  // Monthly Balance Summaries
  getMonthlyBalanceSummaries: async (
    params: I_MonthlyBalanceSummaryParams
  ): Promise<I_MonthlyBalanceSummary[]> => {
    const { account_id, year, months } = params;
    const queryParams = new URLSearchParams();
    
    if (year) queryParams.append('year', year.toString());
    if (months) queryParams.append('months', months.toString());
    
    const response = await apiClient.get<I_MonthlyBalanceSummary[]>(
      `/balance_points/account/${account_id}/monthly-summary?${queryParams}`
    );
    return response.data;
  },

  // Balance Points - Using upsert functionality
  upsertBalancePoint: async (
    data: I_CreateBalancePointRequest
  ): Promise<I_CreateBalancePointResponse> => {
    const { account_id, date, balance, note } = data;
    
    const response = await apiClient.put<I_CreateBalancePointResponse>(
      `/balance_points/account/${account_id}/date/${date}`,
      {
        balance,
        snapshot_type: 'manual',
        note: note || undefined,
      }
    );
    return response.data;
  },
};
