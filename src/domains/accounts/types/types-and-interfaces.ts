import type { I_Broker } from '@/domains/broker/type/types-and-interfaces';

export type T_AccountType = 'savings' | 'credit' | 'investment' | 'cash';

export interface I_AccountsParams {
  is_active?: boolean;
  type?: T_AccountType;
}

export interface I_Account {
  id: string;
  name: string;
  description?: string;
  type: T_AccountType;
  broker: I_Broker;
  balance: number;
  currency: string;
  is_active: boolean;
  availableCredit?: number; // Optional field for credit accounts
}

export interface I_CreateAccountForm {
  name: string;
  description?: string;
  broker_id: string;
  type: T_AccountType;
  balance: number;
  opening_date?: string;
  currency: T_AccountCurrency;
}

export type T_AccountCurrency = 'BRL' | 'USD';

// PATCH /accounts/:id: only the fields sent are changed. Balance, currency and broker are not
// editable: the balance comes from balance points, and the others would desync existing data.
export interface I_AccountUpdatePayload {
  name?: string;
  description?: string | null;
}

export interface I_BalancePoint {
  id: string;
  account_id: string;
  user_id: string;
  date: string;
  balance: number;
  snapshot_type: 'opening' | 'manual' | 'transaction';
  note?: string;
  source_transaction_id?: string;
  created_at: string;
  updated_at: string;
}
