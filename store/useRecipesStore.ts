
import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface RecipeIngredient {
    id?: number;
    ingredient_id: number;
    name: string; // Snapshot for UI
    quantity: number;
    unit: string;
    cost: number; // Snapshot or calculated
}

export interface Recipe {
    id: number;
    name: string;
    portions: number;
    price: number;
    ingredients: RecipeIngredient[];
}

interface RecipesState {
    recipes: Recipe[];
    isLoading: boolean;
    error: string | null;
    fetchRecipes: () => Promise<void>;
    addRecipe: (recipe: Omit<Recipe, 'id'>) => Promise<void>;
    updateRecipe: (id: number, recipe: Omit<Recipe, 'id'>) => Promise<void>;
    deleteRecipe: (id: number) => Promise<void>;
}

export const useRecipesStore = create<RecipesState>((set, get) => ({
    recipes: [],
    isLoading: false,
    error: null,

    fetchRecipes: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data: recipesData, error: recipesError } = await supabase
                .from('recipes')
                .select(`
          *,
          recipe_ingredients (
            *,
            ingredients (
              name,
              price
            )
          )
        `);

            if (recipesError) throw recipesError;

            // Transform data to match interface
            const recipes = recipesData.map((r: any) => ({
                id: r.id,
                name: r.name,
                portions: r.portions,
                price: r.price,
                ingredients: r.recipe_ingredients.map((ri: any) => ({
                    id: ri.id,
                    ingredient_id: ri.ingredient_id,
                    name: ri.ingredients?.name || 'Unknown',
                    quantity: ri.quantity,
                    unit: ri.unit,
                    cost: ri.ingredients?.price || 0
                }))
            }));

            set({ recipes });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },



    updateRecipe: async (id, updatedRecipe) => {
        set({ isLoading: true, error: null });
        try {
            // 1. Update Recipe Details
            const { error: recipeError } = await supabase
                .from('recipes')
                .update({
                    name: updatedRecipe.name,
                    portions: updatedRecipe.portions,
                    price: updatedRecipe.price
                })
                .eq('id', id);

            if (recipeError) throw recipeError;

            // 2. Clear existing ingredients
            const { error: deleteError } = await supabase
                .from('recipe_ingredients')
                .delete()
                .eq('recipe_id', id);

            if (deleteError) throw deleteError;

            // 3. Insert New Ingredients
            const recipeIngredients = updatedRecipe.ingredients.map(ing => ({
                recipe_id: id,
                ingredient_id: ing.ingredient_id,
                quantity: ing.quantity,
                unit: ing.unit
            }));

            if (recipeIngredients.length > 0) {
                const { error: insertError } = await supabase
                    .from('recipe_ingredients')
                    .insert(recipeIngredients);

                if (insertError) throw insertError;
            }

            // Reload
            await get().fetchRecipes();

        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    addRecipe: async (newRecipe) => {
        set({ isLoading: true, error: null });
        try {
            // 1. Insert Recipe
            const { data: recipeData, error: recipeError } = await supabase
                .from('recipes')
                .insert([{
                    name: newRecipe.name,
                    portions: newRecipe.portions,
                    price: newRecipe.price
                }])
                .select()
                .single();

            if (recipeError) throw recipeError;

            // 2. Insert Ingredients
            const recipeIngredients = newRecipe.ingredients.map(ing => ({
                recipe_id: recipeData.id,
                ingredient_id: ing.ingredient_id,
                quantity: ing.quantity,
                unit: ing.unit
            }));

            if (recipeIngredients.length > 0) {
                const { error: ingredientsError } = await supabase
                    .from('recipe_ingredients')
                    .insert(recipeIngredients);

                if (ingredientsError) throw ingredientsError;
            }

            // Reload to get full structure
            await get().fetchRecipes();

        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteRecipe: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const { error } = await supabase
                .from('recipes')
                .delete()
                .eq('id', id);

            if (error) throw error;

            set((state) => ({
                recipes: state.recipes.filter(r => r.id !== id)
            }));
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    }
}));
