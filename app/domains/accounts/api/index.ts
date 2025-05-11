import { apiClient } from '@/config/api';

// Basic type for an account - adjust as per your actual API response
export interface Account {
  id: string;
  name: string;
  // Add other account properties here
  status: 'active' | 'inactive';
  balance: number;
  currency: string;
}

const getAllAccounts = async (): Promise<Account[]> => {
  try {
    const response = await apiClient.get<Account[]>('/accounts');
    return response.data;
  } catch (error) {
    console.error('Error fetching all accounts:', error);
    throw error;
  }
};

const getAllActiveAccounts = async (): Promise<Account[]> => {
  try {
    const response = await apiClient.get<Account[]>('/accounts/active');
    return response.data;
  } catch (error) {
    console.error('Error fetching active accounts:', error);
    // Depending on error handling strategy, re-throw or return a default/empty value
    throw error; 
  }
};

export const accountsApi = {
  getAllAccounts,
  getAllActiveAccounts,
};
