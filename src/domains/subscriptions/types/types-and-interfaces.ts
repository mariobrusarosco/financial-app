export type T_BillingCycle = 'daily' | 'weekly' | 'monthly' | 'annually';

export interface I_Subscription {
  id: string;
  user_id: string;
  vendor_id: string;
  account_id: string;
  category_id?: string;
  name: string;
  amount: number;
  currency: string; // Stays here for consistency with other entities
  billing_cycle: T_BillingCycle;
  next_due_date: string; // ISO Date string
  end_date?: string; // ISO Date string
  notes?: string;
  is_active: boolean;
  is_paid_this_cycle: boolean;
  created_at: string;
  updated_at: string;
}

export interface I_CreateSubscriptionRequest {
  vendor_id: string;
  account_id: string;
  category_id?: string;
  name: string;
  amount: number;
  billing_cycle: T_BillingCycle;
  next_due_date: string; // ISO Date string
  end_date?: string; // ISO Date string
  notes?: string;
  is_active?: boolean;
}

export interface I_UpdateSubscriptionRequest {
  vendor_id?: string;
  account_id?: string;
  category_id?: string;
  name?: string;
  amount?: number;
  billing_cycle?: T_BillingCycle;
  next_due_date?: string; // ISO Date string
  end_date?: string; // ISO Date string
  notes?: string;
  is_active?: boolean;
}

export interface I_SubscriptionResponse {
  data: I_Subscription;
}

export interface I_SubscriptionSummary {
  monthly_burn_rate: number;
  yearly_projection: number;
  due_next_30_days: number;
  active_count: number;
  category_breakdown: { name: string; amount: number }[];
  monthly_forecast: { month: string; amount: number }[];
}

export interface I_SubscriptionsResponse {
  data: I_Subscription[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    has_next: boolean;
    has_previous: boolean;
    summary?: I_SubscriptionSummary;
  };
}

export interface I_SubscriptionsParams {
  [key: string]: unknown;
  page?: number;
  per_page?: number;
  vendor_id?: string;
  account_id?: string;
  is_active?: boolean;
  sort_by?: 'name' | 'amount' | 'next_due_date' | 'created_at';
  sort_order?: 'asc' | 'desc';
  include_summary?: boolean;
}