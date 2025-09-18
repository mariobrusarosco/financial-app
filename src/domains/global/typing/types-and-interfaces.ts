export type T_Currency = 'USD' | 'BRL';

export type T_AppError = {
  code: string;
  message: string;
  timestamp: string | null;
  request_id: string;
};
