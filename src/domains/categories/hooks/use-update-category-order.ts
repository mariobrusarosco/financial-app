import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CategoriesApi } from '../api/categories';
import { GET_ALL_CATEGORIES_QUERY_KEY } from '../api/keys';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';

export const useUpdateCategoryOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, display_order }: { id: string; display_order: number }) =>
      CategoriesApi.updateCategoryOrder(id, display_order),
    onSuccess: () => {
      // Order updates might be frequent or drag-driven, maybe skip toast or use a subtle one?
      // I'll skip toast for DnD to reduce noise, or verify with user. 
      // User style seems to be "toast on success" generally.
      // But for DnD usually we don't spam.
      queryClient.invalidateQueries({ queryKey: GET_ALL_CATEGORIES_QUERY_KEY() });
    },
    onError: (error) => {
      handleErrorWithToast(error, { userMessage: 'Failed to update category order' });
    }
  });
};
