import { apiClient } from '../client';
import type { Investment, ListRequestParams, PaginatedResponse } from '../types';

export interface CreateInvestmentData {
  name: string;
  symbol: string;
  type: 'stock' | 'etf' | 'mutual_fund' | 'bond' | 'crypto' | 'other';
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  notes?: string;
}

export interface UpdateInvestmentData {
  name?: string;
  symbol?: string;
  type?: 'stock' | 'etf' | 'mutual_fund' | 'bond' | 'crypto' | 'other';
  quantity?: number;
  purchasePrice?: number;
  purchaseDate?: string;
  notes?: string;
}

export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  totalGainLoss: number;
  percentageReturn: number;
  assetAllocation: {
    [assetType: string]: {
      value: number;
      percentage: number;
    };
  };
}

export interface InvestmentPerformance {
  symbol: string;
  name: string;
  purchasePrice: number;
  currentPrice: number;
  quantity: number;
  costBasis: number;
  marketValue: number;
  gainLoss: number;
  percentageReturn: number;
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
 * Service for investment operations
 */
export const investmentService = {
  /**
   * Get a list of investments with optional pagination and filtering
   */
  async getInvestments(params?: ListRequestParams): Promise<PaginatedResponse<Investment>> {
    const queryString = createQueryString(params);
    return apiClient.get<PaginatedResponse<Investment>>(`/investments${queryString}`);
  },

  /**
   * Get a single investment by ID
   */
  async getInvestment(id: string): Promise<Investment> {
    return apiClient.get<Investment>(`/investments/${id}`);
  },

  /**
   * Create a new investment
   */
  async createInvestment(data: CreateInvestmentData): Promise<Investment> {
    return apiClient.post<Investment>('/investments', data);
  },

  /**
   * Update an existing investment
   */
  async updateInvestment(id: string, data: UpdateInvestmentData): Promise<Investment> {
    return apiClient.put<Investment>(`/investments/${id}`, data);
  },

  /**
   * Delete an investment
   */
  async deleteInvestment(id: string): Promise<void> {
    return apiClient.delete(`/investments/${id}`);
  },

  /**
   * Get portfolio summary with allocation by asset type
   */
  async getPortfolioSummary(): Promise<PortfolioSummary> {
    return apiClient.get<PortfolioSummary>('/investments/portfolio-summary');
  },

  /**
   * Get performance data for all investments
   */
  async getPerformance(): Promise<InvestmentPerformance[]> {
    return apiClient.get<InvestmentPerformance[]>('/investments/performance');
  },

  /**
   * Search for investment symbols (for adding new investments)
   */
  async searchSymbols(query: string): Promise<{ symbol: string; name: string; type: string }[]> {
    return apiClient.get<{ symbol: string; name: string; type: string }[]>(`/investments/search?query=${encodeURIComponent(query)}`);
  },

  /**
   * Get historical prices for an investment
   */
  async getHistoricalPrices(symbol: string, period: 'week' | 'month' | 'year' | '5year'): Promise<{
    dates: string[];
    prices: number[];
  }> {
    return apiClient.get<{ dates: string[]; prices: number[] }>(`/investments/historical/${symbol}?period=${period}`);
  }
}; 