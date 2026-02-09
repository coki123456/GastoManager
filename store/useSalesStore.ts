
import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface SaleItem {
    recipe_id?: number;
    product_name: string;
    quantity: number;
    price: number;
}

interface Sale {
    id: number;
    created_at: string;
    total: number;
    payment_method: string;
    status: string;
    delivery_date?: string;
    items?: any[]; // Simplified for display
}

interface SalesState {
    recentSales: Sale[];
    isLoading: boolean;
    error: string | null;
    fetchRecentSales: () => Promise<void>;
    recordSale: (total: number, items: SaleItem[], paymentMethod: string, deliveryDate?: Date | null) => Promise<void>;
}

export const useSalesStore = create<SalesState>((set, get) => ({
    recentSales: [],
    isLoading: false,
    error: null,

    fetchRecentSales: async () => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('sales')
                .select(`
          *,
          sale_items (
            product_name,
            quantity
          )
        `)
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;

            set({ recentSales: data as Sale[] });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    recordSale: async (total, items, paymentMethod, deliveryDate = null) => {
        set({ isLoading: true, error: null });
        try {
            // Prepare items for RPC (ensure matches JSONB structure)
            const rpcItems = items.map(item => ({
                recipe_id: item.recipe_id || null, // Handle non-recipe items if any
                product_name: item.product_name,
                quantity: item.quantity,
                price: item.price
            }));

            // Determine status
            // If delivery date is set, assume pending unless user explicitly set it? 
            // For now, logic: if delivery date is provided, it's a reservation -> pending.
            // If no date, it's a direct sale -> completed.
            const status = deliveryDate ? 'pending' : 'completed';

            // Call Postgres Function
            const { error } = await supabase
                .rpc('record_sale_transaction', {
                    p_total: total,
                    p_payment_method: paymentMethod,
                    p_items: rpcItems,
                    p_delivery_date: deliveryDate ? deliveryDate.toISOString() : null,
                    p_status: status
                });

            if (error) throw error;

            // Reload
            await get().fetchRecentSales();

        } catch (error: any) {
            set({ error: error.message });
            throw error; // Re-throw to let UI know
        } finally {
            set({ isLoading: false });
        }
    }
}));
