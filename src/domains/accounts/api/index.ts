import { apiClient } from '@/config/api';
import { I_Account, I_CreateAccountForm } from '@/domains/accounts/types/types-and-interfaces';
import { parsePdf } from '@/server-functions/pdf-parser';

// Define account statement types
export interface I_AccountStatement {
  id: string;
  account_id: string;
  raw_statement: I_AccountRawStatement;
  is_deleted: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface I_AccountRawStatement {
  balance: string;
  period: string;
  transactions: I_AccountStatementTransaction[];
}

export interface I_AccountStatementTransaction {
  id: string | null;
  date: string;
  description: string;
  amount: string;
  type: 'debit' | 'credit';
  category: string;
}

export interface I_CreateAccountStatementRequest {
  account_id: string;
  raw_statement: I_AccountRawStatement;
}

export interface I_AccountStatementsResponse {
  data: I_AccountStatement[];
  meta: {
    has_next: boolean;
    has_previous: boolean;
    page: number;
    per_page: number;
    total: number;
  };
}

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
    return response.data;
  } catch (error) {
    console.error('Error fetching account:', error);
    throw error;
  }
};

const deleteAccount = async (id: string): Promise<void> => {
  try {
    await apiClient.delete<void>(`/accounts/${id}`);
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};

const parseAccountStatement = async (formData: FormData): Promise<I_AccountRawStatement> => {
  return await parsePdf({ data: formData });
};

const createAccountStatement = async (
  data: I_CreateAccountStatementRequest
): Promise<I_AccountStatement> => {
  try {
    const response = await apiClient.post<I_AccountStatement>(
      `/accounts/${data.account_id}/statements`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error creating account statement:', error);
    throw error;
  }
};

const getAccountStatements = async (accountId: string): Promise<I_AccountStatement[]> => {
  try {
    const response = await apiClient.get<I_AccountStatementsResponse>(
      `/accounts/${accountId}/statements`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching account statements:', error);
    throw error;
  }
};

export const accountsApi = {
  getAllAccounts,
  getAllActiveAccounts,
  createAccount,
  deleteAccount,
  getAccount,
  parseAccountStatement,
  createAccountStatement,
  getAccountStatements,
};
