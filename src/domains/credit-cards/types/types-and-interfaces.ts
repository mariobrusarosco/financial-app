// Credit Card Entity
export interface I_CreditCard {
  id: string;
  account_id: string;
  broker_id: string;
  credit_limit: number;
  name: string;
  due_date: number; // Day of month (1-31)
  last_four_digits: string;
  is_active: boolean;
  is_deleted: boolean;
  brand: T_CreditCardBrand;
}

export interface I_CreateCreditCardRequest {
  name: string;
  last_four_digits: string;
  brand: T_CreditCardBrand;
  credit_limit: number | null;
  due_date: number;
}

export interface I_CreateCreditCardResponse {
  credit_card: I_CreditCard;
}

export interface I_CreateCreditCardsResponse {
  data: I_CreditCard[];
  meta: {
    has_next: boolean;
    has_previous: boolean;
    page: number;
    per_page: number;
    total: number;
  };
}

export type T_CreditCardBrand = 'visa' | 'mastercard' | 'other';

// Invoice Related Types
export interface I_CreditCardRawInvoice {
  total_due: string;
  due_date: string;
  period: string;
  min_payment: string;
  installment_options: I_CreditCardInstallmentOption[];
  transactions: I_CreditCardTransaction[];
  next_due_info?: I_CreditCardNextDueInfo;
}

export interface I_CreditCardInvoiceRequest {
  credit_card_id: string;
  raw_invoice: I_CreditCardRawInvoice;
}

export interface I_CreditCardInvoice {
  id: string;
  credit_card_id: string;
  broker_id: string;
  raw_invoice: I_CreditCardRawInvoice;
  is_deleted: boolean;
  is_paid: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface I_CreditCardInvoicesResponse {
  data: I_CreditCardInvoice[];
  meta: {
    has_next: boolean;
    has_previous: boolean;
    page: number;
    per_page: number;
    total: number;
  };
}

export type I_CreditCardInvoiceResponse = string[];

export interface I_CreditCardTransaction {
  id: string;
  account_id: string | null;
  credit_card_id: string;
  broker_id: string;
  is_paid: boolean;
  date: string;
  amount: number;
  description: string;
  movement_type: string;
  category: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface I_CreditCardTransactionsResponse {
  data: I_CreditCardTransaction[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

// Pagination and filtering parameters for credit card transactions
export interface I_CreditCardTransactionsParams {
  // Pagination
  page?: number;
  per_page?: number;

  // Date filtering
  date_from?: string;
  date_to?: string;

  // Amount filtering
  amount_min?: number;
  amount_max?: number;

  // Text search
  description_contains?: string;
  category?: string;

  // Status filtering
  is_paid?: boolean;
  movement_type?: 'income' | 'expense' | 'investment' | 'transfer';

  // Sorting
  sort_by?: 'date' | 'amount' | 'created_at' | 'category';
  sort_order?: 'asc' | 'desc';
}

export interface I_CreditCardInstallmentOption {
  months: number;
  total: string;
}

export interface I_CreditCardNextDueInfo {
  amount: string;
  balance: string;
}
