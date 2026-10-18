import type { I_CashflowViewReportParams } from '@/domains/cashflow/types/index';

export const CASHFLOW_VIEW_QUERY_KEYS = {
  all: ['cashflow-views'] as const,
  list: () => [...CASHFLOW_VIEW_QUERY_KEYS.all, 'list'] as const,
  summary: (viewId: string, params: I_CashflowViewReportParams) =>
    [...CASHFLOW_VIEW_QUERY_KEYS.all, 'summary', viewId, params] as const,
  overlaps: (viewId: string, params: I_CashflowViewReportParams) =>
    [...CASHFLOW_VIEW_QUERY_KEYS.all, 'overlaps', viewId, params] as const,
};
