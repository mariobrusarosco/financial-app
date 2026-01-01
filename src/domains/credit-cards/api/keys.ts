const CREDIT_CARDS = 'credit-cards';

export const CREDIT_CARD_INVOICES_KEY = (creditCardId: string) => [CREDIT_CARDS, creditCardId, 'invoices'];
export const GET_ALL_CREDIT_CARDS_QUERY_KEY = (accountId: string | undefined) => accountId ? ['credit_cards', accountId] : ['credit_cards', 'all'];
export const GET_CREDIT_CARD_QUERY_KEY = (creditCardId: string) => [CREDIT_CARDS, creditCardId];
export const GET_CREDIT_CARD_INVOICES_QUERY_KEY = CREDIT_CARD_INVOICES_KEY;
export const GET_CREDIT_CARDS_INVOICES_KEY = CREDIT_CARD_INVOICES_KEY;
export const GET_CREDIT_CARD_INVOICE_QUERY_KEY = (creditCardId: string, invoiceId: string) => [
  CREDIT_CARDS,
  creditCardId,
  'invoices',
  invoiceId,
];
