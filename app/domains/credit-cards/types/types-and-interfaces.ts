export interface I_CreditCardRawInvoice {
  total_due: string;
  due_date: string;
  period: string;
  min_payment: string;
  installment_options: I_CreditCardInstallmentOption[];
  transactions: I_CreditCardTransaction[];
  next_due_info?: I_CreditCardNextDueInfo;
}

export interface I_CreditCardInvoiceResponse {
  id: string;
  creditCardId: string;
  brokerId: string;
  isDeleted: boolean;
  isPaid: boolean;
}

export interface I_CreditCardInvoiceRequest {
  credit_card_id: string;
  broker_id: string;
  raw_invoice: I_CreditCardRawInvoice;
}

export interface I_CreditCardTransaction {
  id: string;
  creditCardId: string;
  brokerId: string;
  isDeleted: boolean;
  isPaid: boolean;
  date: string;
}

export interface I_CreditCardInstallmentOption {
  months: number;
  total: string;
}

export interface I_CreditCardNextDueInfo {
  next_due_amount: string;
  total_balance_due: string;
}
