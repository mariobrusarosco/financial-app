import { apiClient } from '@/config/api';
import type {
  I_CreateTagRequest,
  I_Tag,
  I_TagsSearchParams,
  I_UpdateTagRequest,
} from '@/domains/tags/types/types-and-interfaces';

export const tagsApi = {
  getTags: async (includeInactive = false): Promise<I_Tag[]> => {
    const response = await apiClient.get<I_Tag[]>('/tags', {
      params: { include_inactive: includeInactive },
    });
    return response.data;
  },

  searchTags: async (params: I_TagsSearchParams): Promise<I_Tag[]> => {
    const response = await apiClient.get<I_Tag[]>('/tags', { params });
    return response.data;
  },

  createTag: async (payload: I_CreateTagRequest): Promise<I_Tag> => {
    const response = await apiClient.post<I_Tag>('/tags', payload);
    return response.data;
  },

  updateTag: async (tagId: string, payload: I_UpdateTagRequest): Promise<I_Tag> => {
    const response = await apiClient.patch<I_Tag>(`/tags/${tagId}`, payload);
    return response.data;
  },

  deleteTag: async (tagId: string): Promise<void> => {
    await apiClient.delete(`/tags/${tagId}`);
  },
};
