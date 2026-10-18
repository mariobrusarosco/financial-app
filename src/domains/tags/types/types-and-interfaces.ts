export interface I_Tag {
  id: string;
  user_id: string;
  name: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface I_TagsSearchParams {
  // Case-insensitive match on the tag name
  q?: string;
  // `usage` puts the most used tags first
  sort?: 'display_order' | 'usage';
  // Max 100
  limit?: number;
  include_inactive?: boolean;
}

export interface I_CreateTagRequest {
  name: string;
  display_order?: number;
}

export interface I_UpdateTagRequest {
  name?: string;
  display_order?: number;
}
