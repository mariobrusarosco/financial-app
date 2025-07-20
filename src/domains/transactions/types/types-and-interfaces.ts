export interface I_Transaction {
  id: string;
  account_id: string;
  broker_id: string;
  is_deleted: boolean;
  is_paid: boolean;
  date: string;
  amount: string;
  description: string;
}

export type T_TransactionType = 'expense' | 'income' | 'investment' | 'transfer';

export interface I_CreateTransactionForm {
  description: string;
  amount: number | null;
  date: string;
  account_id: string;
  broker_id: string;
  credit_card_id?: string;
  is_paid: boolean;
  type: T_TransactionType;
}
