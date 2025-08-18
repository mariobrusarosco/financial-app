export const AUTH_QUERY_KEYS = {
  USER: ['auth', 'user'] as const,
  SESSION: ['auth', 'session'] as const,
} as const;

export const GET_CURRENT_USER_QUERY_KEY = () => AUTH_QUERY_KEYS.USER;
export const GET_SESSION_QUERY_KEY = () => AUTH_QUERY_KEYS.SESSION;