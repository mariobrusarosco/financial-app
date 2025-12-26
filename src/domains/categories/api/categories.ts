import { apiClient } from '@/config/api';
import { I_Category, I_CategoryCreate, I_CategoryTreeNode, I_CategoryUpdate } from '../types';

const BASE_URL = '/categories';

export const CategoriesApi = {
  getCategories: async (): Promise<I_CategoryTreeNode[]> => {
    const { data } = await apiClient.get<I_CategoryTreeNode[]>(BASE_URL);
    return data;
  },

  createCategory: async (category: I_CategoryCreate): Promise<I_Category> => {
    const { data } = await apiClient.post<I_Category>(BASE_URL, category);
    return data;
  },

  updateCategory: async (id: string, category: I_CategoryUpdate): Promise<I_Category> => {
    const { data } = await apiClient.patch<I_Category>(`${BASE_URL}/${id}`, category);
    return data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },

  updateCategoryOrder: async (id: string, display_order: number): Promise<I_Category> => {
    const { data } = await apiClient.patch<I_Category>(`${BASE_URL}/${id}`, { display_order });
    return data;
  },
};
