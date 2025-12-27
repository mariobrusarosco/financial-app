export type T_BillingCycle = 'daily' | 'weekly' | 'monthly' | 'annually';

export interface I_Subscription {
  id: string;
  user_id: string;
  vendor_id: string;
  account_id: string;
  category_id?: string;
  name: string;
  amount: number;
  currency: string;
  frequency: T_BillingCycle;
  start_date: string; // ISO Date string
  end_date?: string; // ISO Date string
  next_payment_date: string; // ISO Date string
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface I_CreateSubscriptionRequest {
  vendor_id: string;
  account_id: string;
  category_id?: string;
  name: string;
  amount: number;
  currency: string;
  frequency: T_BillingCycle;
  start_date: string; // ISO Date string
  end_date?: string; // ISO Date string
  next_payment_date: string; // ISO Date string
  notes?: string;
  is_active?: boolean;
}

export interface I_UpdateSubscriptionRequest {
  vendor_id?: string;
  account_id?: string;
  category_id?: string;
  name?: string;
  amount?: number;
  currency?: string;
  frequency?: T_BillingCycle;
  start_date?: string; // ISO Date string
  end_date?: string; // ISO Date string
  next_payment_date?: string; // ISO Date string
  notes?: string;
  is_active?: boolean;
}

export interface I_SubscriptionResponse {
  data: I_Subscription;
}

export interface I_SubscriptionsResponse {
  data: I_Subscription[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface I_SubscriptionsParams {
  page?: number;
  per_page?: number;
  vendor_id?: string;
  account_id?: string;
  is_active?: boolean;
  sort_by?: 'name' | 'amount' | 'next_payment_date' | 'created_at';
  sort_order?: 'asc' | 'desc';
}
