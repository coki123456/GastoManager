import { create } from 'zustand';
import { Ingredient } from '../types';
import { supabase } from '../lib/supabase';

interface InventoryState {
  ingredients: Ingredient[];
  isLoading: boolean;
  error: string | null;
  fetchIngredients: () => Promise<void>;
  addIngredient: (ingredient: Omit<Ingredient, 'id' | 'status'>) => Promise<void>;
  removeIngredient: (id: number) => Promise<void>;
  updateStock: (id: number, quantity: number) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  ingredients: [],
  isLoading: false,
  error: null,

  fetchIngredients: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      set({ ingredients: data as Ingredient[] });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addIngredient: async (newIngredient) => {
    set({ isLoading: true, error: null });
    try {
      const status = newIngredient.stock <= newIngredient.min_stock ? 'Bajo Stock' : 'En Stock';
      const image = newIngredient.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=64&q=80';

      const { data, error } = await supabase
        .from('ingredients')
        .insert([{ ...newIngredient, status, image }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        ingredients: [...state.ingredients, data as Ingredient]
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  removeIngredient: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('ingredients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        ingredients: state.ingredients.filter(i => i.id !== id)
      }));
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateStock: async (id, quantity) => {
    // Optimistic update
    const previousIngredients = get().ingredients;

    set((state) => ({
      ingredients: state.ingredients.map(i => {
        if (i.id === id) {
          const newStock = i.stock + quantity;
          return {
            ...i,
            stock: newStock,
            status: newStock <= i.min_stock ? 'Bajo Stock' : 'En Stock'
          };
        }
        return i;
      })
    }));

    try {
      const ingredient = get().ingredients.find(i => i.id === id);
      if (!ingredient) return;

      const { error } = await supabase
        .from('ingredients')
        .update({ stock: ingredient.stock, status: ingredient.status })
        .eq('id', id);

      if (error) throw error;
    } catch (error: any) {
      // Revert optimistic update on error
      set({ ingredients: previousIngredients, error: error.message });
    }
  }
}));