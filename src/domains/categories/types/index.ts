export interface I_Category {
  id: string;
  name: string;
  parent_id?: string | null;
  display_order: number;
  is_active: boolean;
}

export interface I_CategoryTreeNode extends I_Category {
  children: I_CategoryTreeNode[];
}

export interface I_CategoryCreate {
  name: string;
  parent_id?: string | null;
  display_order?: number;
}

export interface I_CategoryUpdate {
  name?: string;
  parent_id?: string | null;
  display_order?: number;
}
