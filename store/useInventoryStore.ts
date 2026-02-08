import { create } from 'zustand';
import { Ingredient } from '../types';

interface InventoryState {
  ingredients: Ingredient[];
  addIngredient: (ingredient: Omit<Ingredient, 'id' | 'status'>) => void;
  removeIngredient: (id: number) => void;
  updateStock: (id: number, quantity: number) => void;
}

// Datos iniciales simulados
const initialIngredients: Ingredient[] = [
  { id: 1, name: 'Harina de Trigo 000', category: 'Secos / Harinas', stock: 8.5, unit: 'Kg', minStock: 10, price: 1200, supplier: 'Distribuidora Central', image: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=64&q=80', status: 'Bajo Stock' },
  { id: 2, name: 'Tomates Perita', category: 'Frescos / Verduras', stock: 45, unit: 'Kg', minStock: 15, price: 850, supplier: 'Huerta Verde S.A.', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=64&q=80', status: 'En Stock' },
  { id: 3, name: 'Mozzarella Barra', category: 'Lácteos / Quesos', stock: 12, unit: 'Unid', minStock: 5, price: 4500, supplier: 'Lácteos del Sur', image: 'https://images.unsplash.com/photo-1574125589383-d481358241a4?auto=format&fit=crop&w=64&q=80', status: 'En Stock' },
  { id: 4, name: 'Aceite de Oliva Extra', category: 'Aceites', stock: 2, unit: 'L', minStock: 5, price: 8900, supplier: 'Importadora Gourmet', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=64&q=80', status: 'Bajo Stock' },
  { id: 5, name: 'Carne Molida Especial', category: 'Carnes / Frescos', stock: 28.5, unit: 'Kg', minStock: 10, price: 3200, supplier: 'Frigorífico Modelo', image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=64&q=80', status: 'En Stock' },
];

export const useInventoryStore = create<InventoryState>((set) => ({
  ingredients: initialIngredients,
  
  addIngredient: (newIngredient) => set((state) => {
    const id = Math.max(0, ...state.ingredients.map(i => i.id)) + 1;
    const status = newIngredient.stock <= newIngredient.minStock ? 'Bajo Stock' : 'En Stock';
    // Imagen por defecto si no se provee una
    const image = newIngredient.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=64&q=80';
    
    return {
      ingredients: [...state.ingredients, { ...newIngredient, id, status, image }]
    };
  }),

  removeIngredient: (id) => set((state) => ({
    ingredients: state.ingredients.filter(i => i.id !== id)
  })),

  updateStock: (id, quantity) => set((state) => ({
    ingredients: state.ingredients.map(i => {
      if (i.id === id) {
        const newStock = i.stock + quantity;
        return {
          ...i,
          stock: newStock,
          status: newStock <= i.minStock ? 'Bajo Stock' : 'En Stock'
        };
      }
      return i;
    })
  }))
}));