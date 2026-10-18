import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from '@tanstack/react-pacer';
import { TAG_QUERY_KEYS } from '@/domains/tags/api/keys';
import { tagsApi } from '@/domains/tags/api/tags.api';
import type { I_TagsSearchParams } from '@/domains/tags/types/types-and-interfaces';

const SEARCH_DEBOUNCE_MS = 300;
const SEARCH_LIMIT = 50;

/**
 * Searches active tags on the server as the user types (debounced). With an empty search it
 * returns the most used tags first.
 */
export const useTagSearch = (search: string) => {
  const trimmedSearch = search.trim();
  const [debouncedSearch] = useDebouncedValue(trimmedSearch, { wait: SEARCH_DEBOUNCE_MS });
  const params: I_TagsSearchParams = {
    q: debouncedSearch || undefined,
    sort: 'usage',
    limit: SEARCH_LIMIT,
  };

  const query = useQuery({
    queryKey: TAG_QUERY_KEYS.search(params),
    queryFn: () => tagsApi.searchTags(params),
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
    // True while typing or fetching, i.e. the results don't match the current input yet
    isSearching: trimmedSearch !== debouncedSearch || query.isFetching,
  };
};
