export type T_TransactionType = 'expense' | 'income' | 'investment' | 'transfer';

// Single transaction payload (data going TO backend)
export interface I_TransactionPayload {
  description: string;
  amount: number | null;
  date: string;
  account_id?: string;
  credit_card_id?: string;
  broker_id?: string;
  is_paid: boolean;
  ignored: boolean;
  type: T_TransactionType;
  category: string;
  sub_category?: string;
}

// Legacy alias for backward compatibility - will be removed
export interface I_CreateTransactionForm extends I_TransactionPayload {}

// Collection transactions payload (data going TO backend)
export interface I_TransactionsPayload {
  transactions: I_TransactionPayload[];
}

// Legacy bulk transaction types - will be removed
export interface I_BulkTransactionRequest {
  account_id?: string | null;
  credit_card_id?: string | null;
  broker_id: string;
  is_paid: boolean;
  date: string;
  amount: number;
  description: string;
  movement_type: T_TransactionType;
  category?: string;
}

export interface I_BulkTransactionRequestPayload {
  transactions: I_BulkTransactionRequest[];
}

export interface I_BulkTransactionResult {
  success: boolean;
  transaction_id?: string;
  error_message?: string;
  error_code?: string;
  original_data: I_BulkTransactionRequest;
}

export interface I_BulkTransactionResponse {
  total_submitted: number;
  total_successful: number;
  total_failed: number;
  success_rate: number;
  results: I_BulkTransactionResult[];
}

// Account transactions endpoint types
export interface I_TransactionResponse {
  id: string;
  account_id: string;
  broker_id: string;
  credit_card_id?: string;
  is_deleted: boolean;
  is_paid: boolean;
  ignored: boolean;
  date: string;
  amount: string;
  description: string;
  movement_type: T_TransactionType;
  category?: string;
  category_id?: string | null;
  category_name?: string | null;
  category_tree?: {
    id: string;
    name: string;
    parent: {
      id: string;
      name: string;
    } | null;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface I_AccountTransactionsParams {
  page?: number;
  per_page?: number;
  date_from?: string;
  date_to?: string;
  amount_min?: number;
  amount_max?: number;
  category?: string;
  description_contains?: string;
  movement_type?: T_TransactionType;
  is_paid?: boolean;
  sort_by?: 'date' | 'amount' | 'created_at' | 'category';
  sort_order?: 'asc' | 'desc';
  include_credit_cards?: boolean; // New parameter to include credit card transactions
}

// Collection transactions response (data coming FROM backend)
export interface I_TransactionsResponse {
  data: I_TransactionResponse[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

// Legacy alias for backward compatibility - will be removed
export interface I_AccountTransactionsResponse extends I_TransactionsResponse {}
