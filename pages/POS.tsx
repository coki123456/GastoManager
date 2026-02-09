import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote, History, Search, Calendar, AlertTriangle, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSalesStore } from '../store/useSalesStore';
import { useRecipesStore } from '../store/useRecipesStore';
import { useInventoryStore } from '../store/useInventoryStore';

interface CartItem {
  id: string; // temp id for cart
  recipe_id?: number;
  name: string;
  price: number;
  quantity: number;
}

const POS: React.FC = () => {
  const { recentSales, fetchRecentSales, recordSale } = useSalesStore();
  const { recipes, fetchRecipes } = useRecipesStore();
  const { ingredients: inventory, fetchIngredients } = useInventoryStore();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [deliveryDate, setDeliveryDate] = useState<string>('');

  useEffect(() => {
    fetchRecentSales();
    fetchRecipes();
    fetchIngredients();
  }, [fetchRecentSales, fetchRecipes, fetchIngredients]);

  const addToCart = (recipe: any) => {
    // Basic stock check warning (optional, blocking might be too strict)
    const existing = cart.find(item => item.recipe_id === recipe.id);
    const newQty = (existing?.quantity || 0) + 1;

    // Check stock availability
    const missing = getMissingIngredients(recipe.id, newQty);
    if (missing.length > 0) {
      toast.warning(`Atención: Falta stock para ${recipe.name}`, {
        description: `Falta: ${missing.map(m => m.name).join(', ')}`
      });
    }

    if (existing) {
      setCart(cart.map(item =>
        item.recipe_id === recipe.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: Date.now().toString(),
        recipe_id: recipe.id,
        name: recipe.name,
        price: recipe.price,
        quantity: 1
      }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const updatePrice = (id: string, newPrice: number) => {
    setCart(cart.map(item => item.id === id ? { ...item, price: newPrice } : item));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getMissingIngredients = (recipeId: number | undefined, qty: number) => {
    if (!recipeId) return [];
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return [];

    const missing: { name: string }[] = [];
    recipe.ingredients.forEach(ri => {
      const invItem = inventory.find(i => i.id === ri.ingredient_id);
      const required = ri.quantity * qty;
      const current = invItem?.stock || 0;
      if (current < required) {
        missing.push({ name: ri.name });
      }
    });
    return missing;
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    // Final Stock Check
    const allMissing: string[] = [];
    cart.forEach(item => {
      const missing = getMissingIngredients(item.recipe_id, item.quantity);
      if (missing.length > 0) {
        allMissing.push(`${item.name} (Falta: ${missing.map(m => m.name).join(', ')})`);
      }
    });

    if (allMissing.length > 0) {
      toast.error('No hay suficiente stock', {
        description: allMissing.join('\n')
      });
      // We allow creating pending sales (reservations) even without stock?
      // Maybe yes, but standard sales no. 
      // User asked: "sales planning (see required)".
      // If delivery date is set (Reservation), maybe we allow it?
      if (!deliveryDate) return;
    }

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const saleItems = cart.map(item => ({
      recipe_id: item.recipe_id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    try {
      const dateObj = deliveryDate ? new Date(deliveryDate) : null;
      await recordSale(total, saleItems, paymentMethod, dateObj);
      setCart([]);
      setDeliveryDate('');
      toast.success(deliveryDate ? 'Reserva creada' : 'Venta registrada properly', {
        description: `Total: $${total.toFixed(2)} - ${deliveryDate ? 'Pendiente' : 'Completada'}`
      });
    } catch (err) {
      toast.error('Error al registrar venta');
      console.error(err);
    }
  };

  const filteredRecipes = recipes.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Left Interface: Product Selection */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredRecipes.map(recipe => (
              <button
                key={recipe.id}
                onClick={() => addToCart(recipe)}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary transition-all text-left flex flex-col justify-between group"
              >
                <div>
                  <div className="font-bold text-text-main mb-1 group-hover:text-primary-dark">{recipe.name}</div>
                  <div className="text-sm text-gray-500">{recipe.portions} porción(es)</div>
                </div>
                <div className="mt-3 text-lg font-black text-primary-dark">
                  ${recipe.price.toFixed(2)}
                </div>
              </button>
            ))}
            {filteredRecipes.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-400">
                No se encontraron productos. Crea recetas en la Calculadora de Costos.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Interface: Current Sale & History */}
      <div className="flex flex-col gap-6">
        {/* Current Cart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg flex flex-col flex-1 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-text-main flex items-center gap-2">
              <ShoppingCart size={20} /> Venta Actual
            </h3>
            <span className="text-sm font-medium text-gray-500">{cart.length} ítems</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.map(item => {
              const missing = getMissingIngredients(item.recipe_id, item.quantity);
              const hasStockIssue = missing.length > 0;
              return (
                <div key={item.id} className={`flex flex-col bg-white p-2 rounded-lg border ${hasStockIssue ? 'border-red-200 bg-red-50' : 'border-gray-100'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="font-bold text-sm text-text-main line-clamp-1">{item.name}</div>

                      {/* Bulk Pricing Edit */}
                      {item.quantity >= 3 ? (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-blue-600 font-bold">Mayorista: $</span>
                          <input
                            className="w-16 text-xs border-b border-blue-300 bg-transparent outline-none font-bold text-blue-700"
                            type="number"
                            value={item.price}
                            onChange={(e) => updatePrice(item.id, parseFloat(e.target.value))}
                          />
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">${item.price.toFixed(2)} c/u</div>
                      )}

                      {hasStockIssue && (
                        <div className="flex items-center gap-1 text-[10px] text-red-500 font-bold mt-1">
                          <AlertTriangle size={10} /> Falta: {missing.map(m => m.name).join(', ')}
                        </div>
                      )}
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="font-bold text-gray-700">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded shadow-sm"><Minus size={14} /></button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded shadow-sm"><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
              );
            })}
            {cart.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-sm">
                Agrega productos para comenzar una venta
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-4">

            {/* Delivery Date / Reservation */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                <Calendar size={12} /> Fecha de Entrega (Opcional)
              </label>
              <input
                type="datetime-local"
                className="w-full text-sm p-2 rounded-lg border border-gray-200 outline-none focus:border-primary"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Total a Pagar</span>
              <span className="text-2xl font-black text-text-main">${cartTotal.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPaymentMethod('Efectivo')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-bold transition-all ${paymentMethod === 'Efectivo' ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200 text-gray-500'}`}
              >
                <Banknote size={16} /> Efectivo
              </button>
              <button
                onClick={() => setPaymentMethod('Tarjeta')}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-bold transition-all ${paymentMethod === 'Tarjeta' ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200 text-gray-500'}`}
              >
                <CreditCard size={16} /> Tarjeta
              </button>
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className={`w-full py-3 text-white rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all ${deliveryDate ? 'bg-blue-600 hover:bg-blue-700' : 'bg-text-main hover:bg-black'}`}
            >
              {deliveryDate ? '📅 Reservar Pedido' : `Cobrar $${cartTotal.toFixed(2)}`}
            </button>
          </div>
        </div>

        {/* Recent Sales Mini-View */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 h-48 overflow-hidden flex flex-col">
          <h3 className="font-bold text-text-main text-sm mb-3 flex items-center gap-2">
            <History size={16} /> Ventas Recientes
          </h3>
          <div className="flex-1 overflow-y-auto space-y-2">
            {recentSales.map(sale => (
              <div key={sale.id} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded cursor-pointer">
                <div>
                  <div className="font-bold text-text-main mb-0.5">
                    {sale.status === 'pending' ? '📅 Reserva' : 'Venta'} #{sale.id}
                  </div>
                  <div className="text-xs text-gray-400">{new Date(sale.created_at).toLocaleTimeString()} • {sale.payment_method}</div>
                  {sale.status === 'pending' && <div className="text-[10px] text-blue-500 font-bold">Entrega: {sale.delivery_date ? new Date(sale.delivery_date || '').toLocaleDateString() : '?'}</div>}
                </div>
                <div className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                  ${sale.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;