import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CategoriesApi } from '../api/categories';
import { I_CategoryUpdate } from '../types';
import { GET_ALL_CATEGORIES_QUERY_KEY } from '../api/keys';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: I_CategoryUpdate }) =>
      CategoriesApi.updateCategory(id, data),
    onSuccess: () => {
      toast.success('Category updated successfully');
      queryClient.invalidateQueries({ queryKey: GET_ALL_CATEGORIES_QUERY_KEY() });
    },
    onError: error => {
      handleErrorWithToast(error, { userMessage: 'Failed to update category' });
    },
  });
};
