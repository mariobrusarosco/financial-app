import { apiClient } from '../client';
import type { Budget, ListRequestParams, PaginatedResponse } from '../types';

export interface CreateBudgetData {
  name: string;
  amount: number;
  category: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface UpdateBudgetData {
  name?: string;
  amount?: number;
  category?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  percentageUsed: number;
  categorySummaries: {
    [category: string]: {
      budget: number;
      spent: number;
      remaining: number;
      percentageUsed: number;
    };
  };
}

/**
 * Helper to create query string from ListRequestParams
 */
function createQueryString(params?: ListRequestParams): string {
  if (!params) return '';
  
  const searchParams = new URLSearchParams();
  
  // Handle pagination
  if ('page' in params && params.page !== undefined) {
    searchParams.append('page', params.page.toString());
  }
  
  if ('limit' in params && params.limit !== undefined) {
    searchParams.append('limit', params.limit.toString());
  }
  
  // Handle sorting
  if ('sortBy' in params && params.sortBy) {
    searchParams.append('sortBy', params.sortBy);
    if ('sortOrder' in params && params.sortOrder) {
      searchParams.append('sortOrder', params.sortOrder);
    }
  }
  
  // Handle all other filter parameters
  Object.entries(params).forEach(([key, value]) => {
    // Skip pagination and sort parameters which we've already handled
    if (!['page', 'limit', 'sortBy', 'sortOrder'].includes(key) && value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Service for budget operations
 */
export const budgetService = {
  /**
   * Get a list of budgets with optional pagination and filtering
   */
  async getBudgets(params?: ListRequestParams): Promise<PaginatedResponse<Budget>> {
    const queryString = createQueryString(params);
    return apiClient.get<PaginatedResponse<Budget>>(`/budgets${queryString}`);
  },

  /**
   * Get a single budget by ID
   */
  async getBudget(id: string): Promise<Budget> {
    return apiClient.get<Budget>(`/budgets/${id}`);
  },

  /**
   * Create a new budget
   */
  async createBudget(data: CreateBudgetData): Promise<Budget> {
    return apiClient.post<Budget>('/budgets', data);
  },

  /**
   * Update an existing budget
   */
  async updateBudget(id: string, data: UpdateBudgetData): Promise<Budget> {
    return apiClient.put<Budget>(`/budgets/${id}`, data);
  },

  /**
   * Delete a budget
   */
  async deleteBudget(id: string): Promise<void> {
    return apiClient.delete(`/budgets/${id}`);
  },

  /**
   * Get budget summary with spending by category
   */
  async getBudgetSummary(month?: string, year?: string): Promise<BudgetSummary> {
    const queryParams = new URLSearchParams();
    if (month) queryParams.append('month', month);
    if (year) queryParams.append('year', year);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get<BudgetSummary>(`/budgets/summary${queryString}`);
  },

  /**
   * Get budget vs actual comparison by category
   */
  async getBudgetVsActual(month?: string, year?: string): Promise<{ 
    category: string;
    budgeted: number;
    actual: number;
    difference: number;
    percentageUsed: number;
  }[]> {
    const queryParams = new URLSearchParams();
    if (month) queryParams.append('month', month);
    if (year) queryParams.append('year', year);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get<{ 
      category: string;
      budgeted: number;
      actual: number;
      difference: number;
      percentageUsed: number;
    }[]>(`/budgets/vs-actual${queryString}`);
  }
}; 