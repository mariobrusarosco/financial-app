export const ACCOUNTS_ROUTES = {
  LIST: '/accounts',
  LIST_ACTIVE: '/accounts/active',
  DETAIL: (id: string) => `/accounts/${id}`,
  DELETE: (id: string) => `/accounts/${id}`,
  UPDATE_BALANCE: (id: string) => `/accounts/${id}/update-balance`,
  PARSE_STATEMENTS: (accountId: string) => `/accounts/${accountId}/statements/parse-pdf`,
  STATEMENTS: (accountId: string) => `/accounts/${accountId}/statements`,
  BALANCE_POINTS: (accountId: string) => `/balance_points/${accountId}/timeline`,
};
