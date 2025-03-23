import { apiClient } from '../client';
import type { Account, ListRequestParams, PaginatedResponse, PaginationParams, SortParams, FilterParams } from '../types';

export interface CreateAccountData {
  name: string;
  type: string;
  balance: number;
  institution?: string;
  accountNumber?: string;
  notes?: string;
}

export interface UpdateAccountData {
  name?: string;
  type?: string;
  balance?: number;
  institution?: string;
  accountNumber?: string;
  notes?: string;
}

/**
 * Helper to convert ListRequestParams to URLSearchParams
 */
function createQueryString(params?: ListRequestParams): string {
  if (!params) return '';
  
  const searchParams = new URLSearchParams();
  
  // Handle pagination (from PaginationParams)
  if ('page' in params && params.page !== undefined) {
    searchParams.append('page', params.page.toString());
  }
  
  if ('limit' in params && params.limit !== undefined) {
    searchParams.append('limit', params.limit.toString());
  }
  
  // Handle sorting (from SortParams)
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
 * Service for bank account operations
 */
export const accountService = {
  /**
   * Get a list of accounts with optional pagination
   */
  async getAccounts(params?: ListRequestParams): Promise<PaginatedResponse<Account>> {
    const queryString = createQueryString(params);
    return apiClient.get<PaginatedResponse<Account>>(`/accounts${queryString}`);
  },

  /**
   * Get a single account by ID
   */
  async getAccount(id: string): Promise<Account> {
    return apiClient.get<Account>(`/accounts/${id}`);
  },

  /**
   * Create a new account
   */
  async createAccount(data: CreateAccountData): Promise<Account> {
    return apiClient.post<Account>('/accounts', data);
  },

  /**
   * Update an existing account
   */
  async updateAccount(id: string, data: UpdateAccountData): Promise<Account> {
    return apiClient.put<Account>(`/accounts/${id}`, data);
  },

  /**
   * Delete an account
   */
  async deleteAccount(id: string): Promise<void> {
    return apiClient.delete(`/accounts/${id}`);
  },

  /**
   * Get total balance across all accounts
   */
  async getTotalBalance(): Promise<{ totalBalance: number }> {
    return apiClient.get<{ totalBalance: number }>('/accounts/total-balance');
  },

  /**
   * Get account balance history
   */
  async getBalanceHistory(id: string, period: 'week' | 'month' | 'year'): Promise<{ date: string; balance: number }[]> {
    return apiClient.get<{ date: string; balance: number }[]>(`/accounts/${id}/balance-history?period=${period}`);
  }
}; 