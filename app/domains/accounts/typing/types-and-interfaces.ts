export interface I_Account {
  id: string;
  name: string;
  description?: string;
  type: T_AccountType;
  broker_id: string;
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
