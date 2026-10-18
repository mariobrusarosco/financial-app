import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CASHFLOW_VIEW_QUERY_KEYS } from '@/domains/cashflow/api/keys';
import { cashflowViewsApi } from '@/domains/cashflow/api/cashflow-views.api';
import type {
  I_CashflowViewGroupTransactionsParams,
  I_CashflowViewPayload,
  I_CashflowViewReportParams,
  I_CashflowViewUpdatePayload,
} from '@/domains/cashflow/types/index';
import { ApiError, handleErrorWithToast } from '@/domains/global/utils/error-handler';

export const useCashflowViews = () => {
  const queryClient = useQueryClient();

  const viewsQuery = useQuery({
    queryKey: CASHFLOW_VIEW_QUERY_KEYS.list(),
    queryFn: cashflowViewsApi.getViews,
    retry: retryUnlessClientError,
  });

  // Summary and overlaps depend on the view's groups, so refresh everything under 'cashflow-views'
  const refreshViews = () =>
    queryClient.invalidateQueries({ queryKey: CASHFLOW_VIEW_QUERY_KEYS.all });

  const createMutation = useMutation({
    mutationFn: (payload: I_CashflowViewPayload) => cashflowViewsApi.createView(payload),
    onSuccess: () => {
      void refreshViews();
      toast.success('View created');
    },
    onError: showViewError,
  });
  const updateMutation = useMutation({
    mutationFn: ({ viewId, payload }: { viewId: string; payload: I_CashflowViewUpdatePayload }) =>
      cashflowViewsApi.updateView(viewId, payload),
    onSuccess: () => {
      void refreshViews();
      toast.success('View updated');
    },
    onError: showViewError,
  });
  const deleteMutation = useMutation({
    mutationFn: cashflowViewsApi.deleteView,
    onSuccess: () => {
      void refreshViews();
      toast.success('View deleted');
    },
    onError: showViewError,
  });

  return {
    query: viewsQuery,
    mutations: {
      create: createMutation,
      update: updateMutation,
      delete: deleteMutation,
    },
  };
};

export const useCashflowViewSummary = (
  viewId: string | undefined,
  params: I_CashflowViewReportParams
) =>
  useQuery({
    queryKey: CASHFLOW_VIEW_QUERY_KEYS.summary(viewId ?? '', params),
    queryFn: () => cashflowViewsApi.getSummary(viewId!, params),
    enabled: !!viewId,
    retry: retryUnlessClientError,
  });

// `groupId: null` → expenses that aren't in any group of the view
export const useCashflowViewGroupTransactions = (
  viewId: string,
  groupId: string | null,
  params: I_CashflowViewGroupTransactionsParams,
  { enabled = true }: { enabled?: boolean } = {}
) =>
  useQuery({
    queryKey: CASHFLOW_VIEW_QUERY_KEYS.groupTransactions(viewId, groupId, params),
    queryFn: () => cashflowViewsApi.getGroupTransactions(viewId, groupId, params),
    enabled,
    // Keep the current page on screen while the next one loads
    placeholderData: keepPreviousData,
    retry: retryUnlessClientError,
  });

export const useCashflowViewOverlaps = (
  viewId: string | undefined,
  params: I_CashflowViewReportParams,
  { enabled = true }: { enabled?: boolean } = {}
) =>
  useQuery({
    queryKey: CASHFLOW_VIEW_QUERY_KEYS.overlaps(viewId ?? '', params),
    queryFn: () => cashflowViewsApi.getOverlaps(viewId!, params),
    enabled: enabled && !!viewId,
    retry: retryUnlessClientError,
  });

// A 4xx (e.g. 404 while the endpoint isn't deployed) won't fix itself, so don't retry it
const retryUnlessClientError = (failureCount: number, error: Error) => {
  const isClientError = error instanceof ApiError && error.status >= 400 && error.status < 500;
  return !isClientError && failureCount < 3;
};

// Validation messages from the API are already user-facing, so show them as they come
const showViewError = (error: Error) => {
  handleErrorWithToast(error);
};
