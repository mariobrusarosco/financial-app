import { apiClient } from '../client';
import type { 
  Transaction,
  PaginatedResponse,
  ListRequestParams,
  ApiResponse 
} from '../types';

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
 * Transaction update data
 */
export interface UpdateTransactionData extends Partial<CreateTransactionData> {
  id: string;
}

/**
 * Transaction service for API operations related to transactions
 */
export const transactionService = {
  /**
   * Get a list of transactions with pagination, sorting, and filtering
   */
  async getTransactions(params: ListRequestParams = {}): Promise<PaginatedResponse<Transaction>> {
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    // Add sorting params
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    // Add filter params (excluding pagination and sorting)
    const filterParams = { ...params };
    delete filterParams.page;
    delete filterParams.limit;
    delete filterParams.sortBy;
    delete filterParams.sortOrder;
    
    // Add remaining filter params to query string
    Object.entries(filterParams).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get<PaginatedResponse<Transaction>>(`/transactions${queryString}`);
  },
  
  /**
   * Get a transaction by ID
   */
  async getTransaction(id: string): Promise<Transaction> {
    return apiClient.get<ApiResponse<Transaction>>(`/transactions/${id}`).then(res => res.data);
  },
  
  /**
   * Create a new transaction
   */
  async createTransaction(data: CreateTransactionData): Promise<Transaction> {
    return apiClient.post<ApiResponse<Transaction>>('/transactions', data).then(res => res.data);
  },
  
  /**
   * Update an existing transaction
   */
  async updateTransaction(data: UpdateTransactionData): Promise<Transaction> {
    return apiClient.put<ApiResponse<Transaction>>(`/transactions/${data.id}`, data).then(res => res.data);
  },
  
  /**
   * Delete a transaction
   */
  async deleteTransaction(id: string): Promise<void> {
    return apiClient.delete<void>(`/transactions/${id}`);
  },
  
  /**
   * Get transaction statistics
   */
  async getTransactionStats(
    startDate: string, 
    endDate: string
  ): Promise<{
    totalIncome: number;
    totalExpense: number;
    netCashflow: number;
    categorySummary: {
      category: string;
      amount: number;
      percentage: number;
    }[];
  }> {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    
    return apiClient.get<any>(`/transactions/stats?${params.toString()}`);
  },
}; 