/**
 * API Types
 * Contains shared types for API requests and responses
 */

/**
 * Pagination parameters for list API requests
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Sort parameters for list API requests
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filter parameters for list API requests
 */
export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * List request parameters combining pagination, sorting, and filtering
 */
export type ListRequestParams = PaginationParams & SortParams & FilterParams;

/**
 * Paginated response from the API for list endpoints
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Base API response structure
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/**
 * Error response from the API
 */
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

/**
 * User model
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Transaction model
 */
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense' | 'transfer';
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  updatedAt: string;
}

/**
 * Budget model
 */
export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  category: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Account model
 */
export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'credit' | 'loan' | 'other';
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Investment model
 */
export interface Investment {
  id: string;
  name: string;
  symbol: string;
  type: 'stock' | 'etf' | 'mutual_fund' | 'bond' | 'crypto' | 'other';
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
} 