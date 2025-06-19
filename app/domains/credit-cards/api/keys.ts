export const GET_CREDIT_CARD_QUERY_KEY = (creditCardId: string) => ['credit-cards', creditCardId];
export const GET_CREDIT_CARD_INVOICES_QUERY_KEY = (creditCardId: string) => [
  'credit-cards',
  creditCardId,
  'invoices',
];
