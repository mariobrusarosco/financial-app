import { I_Broker } from '@/domains/broker/type/types-and-interfaces';

export type T_AccountType = 'savings' | 'credit' | 'investment';

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
  currency: T_AccountCurrency;
}

export type T_AccountCurrency = 'BRL' | 'USD';
