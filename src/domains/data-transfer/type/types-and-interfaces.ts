// Export Types
export interface I_ExportPayload {
  date_from?: string;
  date_to?: string;
  include_deleted?: boolean;
  format?: 'csv';
}

export interface I_ExportResponse {
  export_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  file_size?: number;
  row_count?: number;
  download_url?: string;
  created_at: string;
  completed_at?: string;
  error_message?: string;
}

// Import Types
export interface I_ImportResponse {
  import_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  statistics?: {
    total_rows: number;
    imported: number;
    skipped: number;
    errors: number;
  };
  entities_created?: {
    accounts?: number;
    credit_cards?: number;
    categories?: number;
    vendors?: number;
    transactions?: number;
    brokers?: number;
    subscriptions?: number;
    installments?: number;
  };
  error_details?: Array<{
    row?: number;
    column?: string;
    error: string;
    value?: string;
  }>;
  created_at: string;
  completed_at?: string;
}

export interface I_ValidateResponse {
  valid: boolean;
  row_count: number;
  warnings: string[];
  errors: Array<{
    row?: number;
    column?: string;
    error: string;
    value?: string;
  }>;
}
