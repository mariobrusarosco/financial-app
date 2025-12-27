export const VENDORS_QUERY_KEYS = {
  all: ['vendors'] as const,
  lists: () => [...VENDORS_QUERY_KEYS.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...VENDORS_QUERY_KEYS.lists(), params] as const,
  details: () => [...VENDORS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...VENDORS_QUERY_KEYS.details(), id] as const,
};
