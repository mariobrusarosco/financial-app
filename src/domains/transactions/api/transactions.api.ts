import { apiClient } from '@/config/api';
import type {
  I_CreateTransactionForm,
  I_Transaction,
  I_BulkTransactionRequestPayload,
  I_BulkTransactionResponse,
  I_BulkTransactionRequest,
  I_AccountTransactionsParams,
  I_AccountTransactionsResponse,
} from '../types/types-and-interfaces';

export const transactionsApi = {
  createTransaction: async (transaction: I_CreateTransactionForm): Promise<I_Transaction> => {
    const response = await apiClient.post<I_Transaction>('/transactions', transaction);
    return response.data;
  },

  createBulkTransactions: async (
    payload: I_BulkTransactionRequestPayload
  ): Promise<I_BulkTransactionResponse> => {
    const response = await apiClient.post<I_BulkTransactionResponse>('/transactions/bulk', payload);
    return response.data;
  },

  getAllTransactions: async (
    params?: I_AccountTransactionsParams
  ): Promise<I_AccountTransactionsResponse> => {
    const response = await apiClient.get<I_AccountTransactionsResponse>('/transactions', {
      params,
    });
    return response.data;
  },

  getAccountTransactions: async (
    accountId: string,
    params?: I_AccountTransactionsParams
  ): Promise<I_AccountTransactionsResponse> => {
    const response = await apiClient.get<I_AccountTransactionsResponse>(
      `/accounts/${accountId}/transactions`,
      { params }
    );
    return response.data;
  },
};

// Helper function to transform form data to API format
export const transformFormToBulkRequest = (
  transactions: I_CreateTransactionForm[]
): I_BulkTransactionRequest[] => {
  return transactions.map(transaction => ({
    account_id: transaction.account_id || null,
    credit_card_id: transaction.credit_card_id || null,
    broker_id: transaction.broker_id || '', // Already calculated when transaction was added
    is_paid: transaction.is_paid,
    date: new Date(transaction.date).toISOString(),
    amount: transaction.amount || 0,
    description: transaction.description,
    movement_type: transaction.type,
    category: transaction.category || undefined,
  }));
};
