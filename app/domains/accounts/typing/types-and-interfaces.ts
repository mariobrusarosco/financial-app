import { I_Broker } from '@/domains/broker/typing/types-and-interfaces';

export interface I_Account {
  id: string;
  name: string;
  description?: string;
  type: T_AccountType;
  broker: I_Broker;
  balance: number;
  currency: string;
  is_active: boolean;
}

export interface I_CreateAccountForm {
  name: string;
  description?: string;
  broker_id: string;
  type: T_AccountType;
  balance: number;
  currency: string;
}

export type T_AccountType = 'checking' | 'savings' | 'credit_card' | 'investment';
