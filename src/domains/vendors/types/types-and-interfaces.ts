export interface I_Vendor {
  id: string;
  user_id: string;
  name: string;
  logo_url?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface I_CreateVendorRequest {
  name: string;
  logo_url?: string;
  website?: string;
}

export interface I_UpdateVendorRequest {
  name?: string;
  logo_url?: string;
  website?: string;
}

export interface I_VendorResponse {
  data: I_Vendor;
}

export interface I_VendorsResponse {
  data: I_Vendor[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface I_VendorsParams {
  [key: string]: unknown; // Added index signature
  page?: number;
  per_page?: number;
  name?: string;
  sort_by?: 'name' | 'created_at';
  sort_order?: 'asc' | 'desc';
}
