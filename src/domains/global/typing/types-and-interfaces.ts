export type T_Currency = 'USD' | 'BRL';

export interface T_AppError {
  code: string;
  message: string;
  timestamp: string | null;
  request_id: string;
}
