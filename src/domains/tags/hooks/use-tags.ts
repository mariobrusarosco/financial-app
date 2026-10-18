import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TAG_QUERY_KEYS } from '@/domains/tags/api/keys';
import { tagsApi } from '@/domains/tags/api/tags.api';
import type {
  I_CreateTagRequest,
  I_UpdateTagRequest,
} from '@/domains/tags/types/types-and-interfaces';
import { handleErrorWithToast } from '@/domains/global/utils/error-handler';

interface UseTagsOptions {
  includeInactive?: boolean;
}

export const useTags = ({ includeInactive = false }: UseTagsOptions = {}) => {
  const queryClient = useQueryClient();

  const tagsQuery = useQuery({
    queryKey: TAG_QUERY_KEYS.list(includeInactive),
    queryFn: () => tagsApi.getTags(includeInactive),
  });
  const refreshTags = () => queryClient.invalidateQueries({ queryKey: TAG_QUERY_KEYS.all });
  const refreshTagDisplays = () => {
    void queryClient.invalidateQueries({ queryKey: ['transaction'] });
    void queryClient.invalidateQueries({ queryKey: ['account-transactions'] });
  };

  const createTagMutation = useMutation({
    mutationFn: (payload: I_CreateTagRequest) => tagsApi.createTag(payload),
    onSuccess: () => {
      void refreshTags();
      toast.success('Tag created');
    },
    onError: showTagError,
  });
  const updateTagMutation = useMutation({
    mutationFn: ({ tagId, payload }: { tagId: string; payload: I_UpdateTagRequest }) =>
      tagsApi.updateTag(tagId, payload),
    onSuccess: () => {
      void refreshTags();
      refreshTagDisplays();
      toast.success('Tag updated');
    },
    onError: showTagError,
  });
  const deleteTagMutation = useMutation({
    mutationFn: tagsApi.deleteTag,
    onSuccess: () => {
      void refreshTags();
      refreshTagDisplays();
      toast.success('Tag deactivated');
    },
    onError: showTagError,
  });

  return {
    tags: {
      query: tagsQuery,
      actions: {
        refetchTags: tagsQuery.refetch,
        createTag: createTagMutation.mutate,
        updateTag: updateTagMutation.mutate,
        deleteTag: deleteTagMutation.mutate,
      },
      mutations: {
        create: createTagMutation,
        update: updateTagMutation,
        delete: deleteTagMutation,
      },
    },
  };
};

const showTagError = (error: Error) => {
  handleErrorWithToast(error, { userMessage: 'Unable to save tag changes. Please try again.' });
};
