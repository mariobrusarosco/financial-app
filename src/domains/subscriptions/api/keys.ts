export const SUBSCRIPTIONS_QUERY_KEYS = {
  all: ['subscriptions'] as const,
  lists: () => [...SUBSCRIPTIONS_QUERY_KEYS.all, 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...SUBSCRIPTIONS_QUERY_KEYS.lists(), params] as const,
  details: () => [...SUBSCRIPTIONS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SUBSCRIPTIONS_QUERY_KEYS.details(), id] as const,
};
