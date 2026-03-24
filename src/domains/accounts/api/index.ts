import { apiClient } from '@/config/api';
import type {
  I_Account,
  I_CreateAccountForm,
  I_BalancePoint,
} from '@/domains/accounts/types/types-and-interfaces';
import type { I_TransactionResponse } from '@/domains/transactions/types/types-and-interfaces';
import { ACCOUNTS_ROUTES } from './backend-routes';

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
  transactions: I_TransactionResponse[];
}

// Full API response structure for parsed statements
export interface I_ParsedAccountStatement {
  id: string;
  account_id: string;
  user_id: string;
  period_start: string;
  period_end: string;
  opening_balance: string;
  closing_balance: string;
  raw_statement: I_AccountRawStatement;
  is_processed: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
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
    const response = await apiClient.get<I_Account[]>(ACCOUNTS_ROUTES.LIST);
    return response.data;
  } catch (error) {
    console.error('Error fetching all accounts:', error);
    throw error;
  }
};

const getAllActiveAccounts = async (): Promise<I_Account[]> => {
  try {
    const response = await apiClient.get<I_Account[]>(ACCOUNTS_ROUTES.LIST_ACTIVE);
    return response.data;
  } catch (error) {
    console.error('Error fetching active accounts:', error);
    // Depending on error handling strategy, re-throw or return a default/empty value
    throw error;
  }
};

const createAccount = async (account: I_CreateAccountForm): Promise<I_Account> => {
  try {
    const response = await apiClient.post<I_Account>(ACCOUNTS_ROUTES.LIST, account);
    return response.data;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
};

const getAccount = async (id: string): Promise<I_Account> => {
  try {
    const response = await apiClient.get<I_Account>(ACCOUNTS_ROUTES.DETAIL(id));
    return response.data;
  } catch (error) {
    console.error('Error fetching account:', error);
    throw error;
  }
};

const deleteAccount = async (id: string): Promise<void> => {
  try {
    await apiClient.delete<void>(ACCOUNTS_ROUTES.DELETE(id));
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};

const updateAccountBalance = async (id: string): Promise<void> => {
  try {
    await apiClient.post<void>(ACCOUNTS_ROUTES.UPDATE_BALANCE(id));
  } catch (error) {
    console.error('Error updating account balance:', error);
    throw error;
  }
};

const parseAccountStatement = async (
  formData: FormData,
  accountId: string
): Promise<I_ParsedAccountStatement> => {
  try {
    const response = await apiClient.post<I_ParsedAccountStatement>(
      ACCOUNTS_ROUTES.PARSE_STATEMENTS(accountId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error parsing account statement:', error);
    throw error;
  }
};

const createAccountStatement = async (
  data: I_CreateAccountStatementRequest
): Promise<I_AccountStatement> => {
  try {
    const response = await apiClient.post<I_AccountStatement>(
      ACCOUNTS_ROUTES.STATEMENTS(data.account_id),
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
      ACCOUNTS_ROUTES.STATEMENTS(accountId)
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching account statements:', error);
    throw error;
  }
};

const getAccountBalancePoints = async (
  accountId: string,
  startDate: string,
  endDate: string
): Promise<I_BalancePoint[]> => {
  try {
    const response = await apiClient.get<I_BalancePoint[]>(
      ACCOUNTS_ROUTES.BALANCE_POINTS(accountId),
      {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching account balance points:', error);
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
  updateAccountBalance,
  getAccountBalancePoints,
};

export type { I_BalancePoint };
