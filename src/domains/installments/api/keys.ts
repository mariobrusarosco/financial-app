export const INSTALLMENTS_QUERY_KEYS = {
  all: ['installments'] as const,
  plans: () => [...INSTALLMENTS_QUERY_KEYS.all, 'plans'] as const,
  planList: (params?: Record<string, unknown>) =>
    [...INSTALLMENTS_QUERY_KEYS.plans(), 'list', params] as const,
  planDetails: () => [...INSTALLMENTS_QUERY_KEYS.plans(), 'detail'] as const,
  planDetail: (id: string | undefined) => [...INSTALLMENTS_QUERY_KEYS.planDetails(), id] as const,
};
