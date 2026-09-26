export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string;
  price: string;
  costPrice: string;
  unit: string;
  categoryId: number;
  category?: Category;
}