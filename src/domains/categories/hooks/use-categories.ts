import { useQuery } from '@tanstack/react-query';
import { CategoriesApi } from '../api/categories';
import { GET_ALL_CATEGORIES_QUERY_KEY } from '../api/keys';
export const useCategories = () => {
  return useQuery({
    queryKey: GET_ALL_CATEGORIES_QUERY_KEY(),
    queryFn: CategoriesApi.getCategories,
  });
};
