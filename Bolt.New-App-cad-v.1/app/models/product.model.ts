export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  low_stock_threshold: number;
  barcode?: string;
  location?: string;
  created_at?: string;
}

export interface ProductFilter {
  searchText?: string;
  lowStock?: boolean;
  sortBy?: 'name' | 'price' | 'quantity';
  sortOrder?: 'asc' | 'desc';
}