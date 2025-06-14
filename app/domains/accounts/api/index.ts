import { apiClient } from '@/config/api';
import { I_Account, I_CreateAccountForm } from '@/domains/accounts/types/types-and-interfaces';

const getAllAccounts = async (): Promise<I_Account[]> => {
  try {
    const response = await apiClient.get<I_Account[]>('/accounts');
    return response.data;
  } catch (error) {
    console.error('Error fetching all accounts:', error);
    throw error;
  }
};

const getAllActiveAccounts = async (): Promise<I_Account[]> => {
  try {
    const response = await apiClient.get<I_Account[]>('/accounts/active');
    return response.data;
  } catch (error) {
    console.error('Error fetching active accounts:', error);
    // Depending on error handling strategy, re-throw or return a default/empty value
    throw error;
  }
};

const createAccount = async (account: I_CreateAccountForm): Promise<I_Account> => {
  try {
    const response = await apiClient.post<I_Account>('/accounts', account);
    return response.data;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};

const getAccount = async (id: string): Promise<I_Account> => {
  try {
    const response = await apiClient.get<I_Account>(`/accounts/${id}`);
    return response.data as I_Account;
  } catch (error) {
    console.error('Error fetching account:', error);
    throw error;
  }
};

export const accountsApi = {
  getAllAccounts,
  getAllActiveAccounts,
  createAccount,
  getAccount,
};
