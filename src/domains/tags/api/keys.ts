import type { I_TagsSearchParams } from '@/domains/tags/types/types-and-interfaces';

export const TAG_QUERY_KEYS = {
  all: ['tags'] as const,
  lists: () => [...TAG_QUERY_KEYS.all, 'list'] as const,
  list: (includeInactive = false) => [...TAG_QUERY_KEYS.lists(), { includeInactive }] as const,
  search: (params: I_TagsSearchParams) => [...TAG_QUERY_KEYS.all, 'search', params] as const,
};
