import type { I_AccountsParams } from '@/domains/accounts/types/types-and-interfaces';

export const GET_ACCOUNT_QUERY_KEY = (id: string) => ['accounts', 'account', id];
export const GET_ACCOUNTS_QUERY_KEY = (params?: I_AccountsParams) => ['accounts', 'list', params];
export const GET_ALL_ACTIVE_ACCOUNTS_QUERY_KEY = () =>
  GET_ACCOUNTS_QUERY_KEY({ is_active: true });
export const GET_ALL_ACCOUNTS_QUERY_KEY = () => GET_ACCOUNTS_QUERY_KEY();
export const GET_ALL_CREDIT_CARDS_QUERY_KEY = (accountId: string) => [
  'accounts',
  accountId,
  'credit-cards',
];
export const GET_ACCOUNT_BALANCE_POINTS_TIMELINE_QUERY_KEY = (
  accountId: string,
  startDate: string,
  endDate: string
) => ['balance-points', accountId, 'timeline', startDate, endDate];

export const GET_UPLOADED_STATEMENT_QUERY_KEY = (accountId: string) => [
  'accounts',
  accountId,
  'uploaded-statement',
];
