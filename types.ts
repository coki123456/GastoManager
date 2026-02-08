export interface Ingredient {
  id: number;
  name: string;
  category: string;
  stock: number;
  unit: string;
  min_stock: number;
  price: number;
  supplier: string;
  image: string;
  status: 'Bajo Stock' | 'En Stock';
}

export interface Sale {
  id: string;
  time: string;
  customer: string;
  items: string;
  total: number;
  status: 'PAGADO' | 'PENDIENTE';
  color: string;
}

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  cost: number;
  price: number;
  margin: number;
}