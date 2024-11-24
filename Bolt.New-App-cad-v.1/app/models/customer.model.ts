export interface Customer {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  created_at?: string;
}

export interface CustomerFilter {
  searchText?: string;
  sortBy?: 'name' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}