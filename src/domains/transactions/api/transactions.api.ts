import { apiClient } from '@/config/api';
import type {
  I_CreateTransactionForm,
  I_BulkTransactionRequestPayload,
  I_BulkTransactionResponse,
  I_BulkTransactionRequest,
  I_AccountTransactionsParams,
  I_AccountTransactionsResponse,
  I_TransactionResponse,
} from '../types/types-and-interfaces';


export const transactionsApi = {
  createTransaction: async (transaction: I_CreateTransactionForm): Promise<I_TransactionResponse> => {
    const response = await apiClient.post<I_TransactionResponse>('/transactions', transaction);
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

  deleteBulkTransactions: async (transactionIds: string[]): Promise<{ deleted_count: number }> => {
    // Validate that all transaction IDs are valid UUIDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const invalidIds = transactionIds.filter(id => !uuidRegex.test(id));

    if (invalidIds.length > 0) {
      throw new Error(`Invalid transaction IDs: ${invalidIds.join(', ')}`);
    }

    const response = await apiClient.delete('/transactions/bulk', {
      data: { transaction_ids: transactionIds },
    });
    return response.data;
  },

  deleteTransaction: async (transactionId: string): Promise<void> => {
    // Validate that the transaction ID is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(transactionId)) {
      throw new Error(`Invalid transaction ID: ${transactionId}`);
    }

    await apiClient.delete(`/transactions/${transactionId}`);
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

export const updateTransaction = async (
  id: string,
  updates: Partial<I_TransactionResponse>
): Promise<I_TransactionResponse> => {
  const response = await apiClient.patch<I_TransactionResponse>(
    `/transactions/${id}`,
    updates
  );
  return response.data;
};



