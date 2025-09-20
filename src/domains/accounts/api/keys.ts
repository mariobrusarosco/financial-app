export const GET_ACCOUNT_QUERY_KEY = (id: string) => ['accounts', 'account', id];
export const GET_ALL_ACTIVE_ACCOUNTS_QUERY_KEY = () => ['accounts', 'active'];
export const GET_ALL_ACCOUNTS_QUERY_KEY = () => ['accounts', 'all'];
export const GET_ALL_CREDIT_CARDS_QUERY_KEY = (accountId: string) => [
  'accounts',
  accountId,
  'credit-cards',
];
export const GET_ACCOUNT_BALANCE_POINTS_QUERY_KEY = (accountId: string) => [
  'accounts',
  accountId,
  'balance-points',
];
