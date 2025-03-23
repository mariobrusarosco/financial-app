import { apiClient } from '../client';
import type { Transaction, PaginatedResponse, ListRequestParams, ApiResponse } from '../types';

/**
 * Transaction creation data
 */
export interface CreateTransactionData {
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense' | 'transfer';
}

/**
 * Transaction service
 */
export const transactionService = {
  // Get a list of transactions
  async getTransactions(params: ListRequestParams = {}): Promise<PaginatedResponse<Transaction>> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get<PaginatedResponse<Transaction>>(`/transactions${queryString}`);
  },
  
  // Get a transaction by ID
  async getTransaction(id: string): Promise<Transaction> {
    return apiClient.get<ApiResponse<Transaction>>(`/transactions/${id}`)
      .then(res => res.data);
  },
  
  // Create a new transaction
  async createTransaction(data: CreateTransactionData): Promise<Transaction> {
    return apiClient.post<ApiResponse<Transaction>>('/transactions', data)
      .then(res => res.data);
  },
  
  // Update a transaction
  async updateTransaction(id: string, data: Partial<CreateTransactionData>): Promise<Transaction> {
    return apiClient.put<ApiResponse<Transaction>>(`/transactions/${id}`, data)
      .then(res => res.data);
  },
  
  // Delete a transaction
  async deleteTransaction(id: string): Promise<void> {
    return apiClient.delete<void>(`/transactions/${id}`);
  }
}; 