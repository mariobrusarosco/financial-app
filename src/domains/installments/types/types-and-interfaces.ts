export type T_InstallmentPlanStatus = 'active' | 'completed' | 'canceled';
export type T_InstallmentStatus = 'pending' | 'linked' | 'overdue';

export interface I_Installment {
  id: string;
  plan_id: string;
  number: number;
  amount: number;
  due_date: string; // ISO date
  status: T_InstallmentStatus;
  transaction_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface I_InstallmentPlan {
  id: string;
  name: string;
  description: string | null;
  total_amount: number;
  installment_count: number;
  start_date: string; // ISO date
  status: T_InstallmentPlanStatus;
  created_at: string;
  updated_at: string;
  credit_card_id: string | null;
  vendor_id: string | null;
  category_id: string | null;
  installments: I_Installment[];
}

export interface I_CreateInstallmentPlanRequest {
  name: string;
  description?: string | null;
  total_amount: number;
  installment_count: number;
  start_date: string;
  credit_card_id?: string | null;
  vendor_id?: string | null;
  category_id?: string | null;
}

export interface I_InstallmentPlanResponse {
  data: I_InstallmentPlan;
}

export interface I_InstallmentPlanListResponse {
  data: I_InstallmentPlan[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface I_InstallmentPlansParams {
  status?: string | null;
  vendor_id?: string | null;
  category_id?: string | null;
  credit_card_id?: string | null;
  page?: number;
  per_page?: number;
}

export interface I_LinkInstallmentRequest {
  transaction_id: string;
}