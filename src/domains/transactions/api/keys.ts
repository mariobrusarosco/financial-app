export const GET_ALL_TRANSACTIONS_QUERY_KEY = () => ['all-transactions'];
export const GET_ACCOUNT_TRANSACTIONS_QUERY_KEY = (accountId: string) => [
  'account-transactions',
  accountId,
];
export const GET_ACCOUNT_TRANSACTIONS_PAGINATED_QUERY_KEY = (accountId: string) => [
  'account-transactions-paginated',
  accountId,
];
