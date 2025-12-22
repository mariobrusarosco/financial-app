import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CategoriesApi } from '../api/categories';
import { GET_ALL_CATEGORIES_QUERY_KEY } from '../api/keys';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CategoriesApi.createCategory,
    onSuccess: () => {
      toast.success('Category created successfully');
      queryClient.invalidateQueries({ queryKey: GET_ALL_CATEGORIES_QUERY_KEY() });
    },
    onError: (error) => {
      handleErrorWithToast(error, { userMessage: 'Failed to create category' });
    }
  });
};
