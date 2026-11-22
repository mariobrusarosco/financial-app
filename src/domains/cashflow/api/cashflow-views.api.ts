import { apiClient } from '@/config/api';
import type {
  I_CashflowViewGroupTransactionsParams,
  I_CashflowViewGroupTransactionsResponse,
  I_CashflowViewOverlapsResponse,
  I_CashflowViewPayload,
  I_CashflowViewReportParams,
  I_CashflowViewResponse,
  I_CashflowViewsResponse,
  I_CashflowViewSummaryResponse,
  I_CashflowViewUpdatePayload,
} from '@/domains/cashflow/types/index';

const CASHFLOW_VIEWS_PATH = '/cashflow/views';

export const cashflowViewsApi = {
  getViews: async (): Promise<I_CashflowViewsResponse> => {
    const response = await apiClient.get<I_CashflowViewsResponse>(CASHFLOW_VIEWS_PATH);
    return response.data;
  },

  createView: async (payload: I_CashflowViewPayload): Promise<I_CashflowViewResponse> => {
    const response = await apiClient.post<I_CashflowViewResponse>(CASHFLOW_VIEWS_PATH, payload);
    return response.data;
  },

  updateView: async (
    viewId: string,
    payload: I_CashflowViewUpdatePayload
  ): Promise<I_CashflowViewResponse> => {
    const response = await apiClient.patch<I_CashflowViewResponse>(
      `${CASHFLOW_VIEWS_PATH}/${viewId}`,
      payload
    );
    return response.data;
  },

  deleteView: async (viewId: string): Promise<void> => {
    await apiClient.delete(`${CASHFLOW_VIEWS_PATH}/${viewId}`);
  },

  getSummary: async (
    viewId: string,
    params: I_CashflowViewReportParams
  ): Promise<I_CashflowViewSummaryResponse> => {
    const response = await apiClient.get<I_CashflowViewSummaryResponse>(
      `${CASHFLOW_VIEWS_PATH}/${viewId}/summary`,
      { params }
    );
    return response.data;
  },

  // `groupId: null` lists the expenses that aren't in any group of the view
  getGroupTransactions: async (
    viewId: string,
    groupId: string | null,
    params: I_CashflowViewGroupTransactionsParams
  ): Promise<I_CashflowViewGroupTransactionsResponse> => {
    const path = groupId
      ? `${CASHFLOW_VIEWS_PATH}/${viewId}/groups/${groupId}/transactions`
      : `${CASHFLOW_VIEWS_PATH}/${viewId}/ungrouped/transactions`;
    const response = await apiClient.get<I_CashflowViewGroupTransactionsResponse>(path, {
      params,
    });
    return response.data;
  },

  getOverlaps: async (
    viewId: string,
    params: I_CashflowViewReportParams
  ): Promise<I_CashflowViewOverlapsResponse> => {
    const response = await apiClient.get<I_CashflowViewOverlapsResponse>(
      `${CASHFLOW_VIEWS_PATH}/${viewId}/overlaps`,
      { params }
    );
    return response.data;
  },
};
