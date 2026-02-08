import React, { useState, useEffect } from 'react';
import { Save, Check, PlusCircle, Trash2, Calculator, Info, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useInventoryStore } from '../store/useInventoryStore';
import { useRecipesStore, RecipeIngredient } from '../store/useRecipesStore';
import { Ingredient } from '../types';

interface IngredientRow extends RecipeIngredient {
  icon: string;
  color: string;
  total: number;
}

const CostCalculator: React.FC = () => {
  const { ingredients: inventory, fetchIngredients } = useInventoryStore();
  const { addRecipe, isLoading: isSaving } = useRecipesStore();

  const [recipeName, setRecipeName] = useState('Nueva Receta');
  const [portions, setPortions] = useState(1);
  const [multiplier, setMultiplier] = useState(3.0);
  const [errorMarginPercentage] = useState(0.05); // 5%

  const [selectedIngredients, setSelectedIngredients] = useState<IngredientRow[]>([]);
  const [isAddingIngredient, setIsAddingIngredient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  // Calculations
  const baseCost = selectedIngredients.reduce((acc, curr) => acc + curr.total, 0);
  const errorMargin = baseCost * errorMarginPercentage;
  const totalCost = baseCost + errorMargin;
  const costPerPortion = totalCost / Math.max(1, portions);
  const suggestedPrice = totalCost * multiplier;
  const marginPercent = ((suggestedPrice - totalCost) / suggestedPrice) * 100;
  const profit = suggestedPrice - totalCost;

  const handleAddIngredient = (ing: Ingredient) => {
    const newRow: IngredientRow = {
      ingredient_id: ing.id,
      name: ing.name,
      quantity: 1,
      unit: ing.unit,
      cost: ing.price,
      total: ing.price * 1, // Default 1 unit
      icon: '📦',
      color: 'bg-blue-100 text-blue-600'
    };
    setSelectedIngredients([...selectedIngredients, newRow]);
    setIsAddingIngredient(false);
    setSearchTerm('');
  };

  const handleUpdateQuantity = (index: number, qty: number) => {
    const newIngredients = [...selectedIngredients];
    newIngredients[index].quantity = qty;
    newIngredients[index].total = newIngredients[index].cost * qty;
    setSelectedIngredients(newIngredients);
  };

  const handleDelete = (index: number) => {
    setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
  };

  const handleSaveRecipe = async () => {
    if (!recipeName) return toast.error('Ingresa un nombre para la receta');
    if (selectedIngredients.length === 0) return toast.error('Agrega al menos un ingrediente');

    try {
      await addRecipe({
        name: recipeName,
        portions,
        price: suggestedPrice,
        ingredients: selectedIngredients
      });

      toast.success('Receta guardada exitosamente');
      // Reset form or navigate
      setRecipeName('Nueva Receta');
      setSelectedIngredients([]);
    } catch (error) {
      toast.error('Error al guardar la receta');
      console.error(error);
    }
  };

  const filteredInventory = inventory.filter(i =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedIngredients.some(si => si.ingredient_id === i.id)
  );

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-text-main">Calculadora de Costos</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveRecipe}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-text-main px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save size={18} /> Guardar Receta
              </>
            )}
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Col: Recipe Input */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-wrap items-end gap-6">
              <div className="flex-1 min-w-[200px]">
                <label className="mb-2 block text-sm font-medium text-gray-500">Nombre de la Receta</label>
                <input
                  className="w-full rounded-xl border-gray-200 bg-background-light px-4 py-3 text-lg font-bold text-text-main focus:ring-2 focus:ring-primary outline-none"
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                />
              </div>
              <div className="w-32">
                <label className="mb-2 block text-sm font-medium text-gray-500">Porciones</label>
                <div className="relative">
                  <input
                    className="w-full rounded-xl border-gray-200 bg-background-light px-4 py-3 text-center text-lg font-bold text-text-main outline-none"
                    type="number"
                    min="1"
                    value={portions}
                    onChange={(e) => setPortions(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">UND</span>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-background-light text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Ingrediente</th>
                    <th className="px-6 py-4 font-medium w-32">Cant.</th>
                    <th className="px-6 py-4 font-medium w-32">Unidad</th>
                    <th className="px-6 py-4 font-medium text-right w-32">Costo Total</th>
                    <th className="px-4 py-4 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedIngredients.map((ing, idx) => (
                    <tr key={idx} className="group hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-text-main">{ing.name}</span>
                        </div>
                        <div className="text-xs text-gray-400">Costo unit: ${ing.cost}</div>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          className="w-full rounded-lg border-gray-200 bg-white px-2 py-1 text-center text-sm"
                          type="number"
                          min="0"
                          step="0.01"
                          value={ing.quantity}
                          onChange={(e) => handleUpdateQuantity(idx, parseFloat(e.target.value) || 0)}
                        />
                      </td>
                      <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">{ing.unit}</span></td>
                      <td className="px-6 py-4 text-right font-medium">${ing.total.toFixed(2)}</td>
                      <td className="px-4 py-4 text-center">
                        <button onClick={() => handleDelete(idx)} className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 p-1 rounded">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={5} className="p-2">
                      {!isAddingIngredient ? (
                        <button
                          onClick={() => setIsAddingIngredient(true)}
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white py-3 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-primary-dark transition-all"
                        >
                          <PlusCircle size={18} /> Agregar Ingrediente
                        </button>
                      ) : (
                        <div className="p-2 border border-blue-200 rounded-lg bg-white">
                          <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded">
                            <Search size={16} className="text-gray-400" />
                            <input
                              autoFocus
                              type="text"
                              placeholder="Buscar ingrediente..."
                              className="bg-transparent outline-none w-full text-sm"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button onClick={() => setIsAddingIngredient(false)} className="text-xs text-gray-500 hover:text-red-500">Cancelar</button>
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {filteredInventory.map(ing => (
                              <div
                                key={ing.id}
                                onClick={() => handleAddIngredient(ing)}
                                className="p-2 hover:bg-blue-50 cursor-pointer text-sm flex justify-between items-center"
                              >
                                <span>{ing.name}</span>
                                <span className="text-xs text-gray-500">${ing.price} / {ing.unit}</span>
                              </div>
                            ))}
                            {filteredInventory.length === 0 && (
                              <div className="p-2 text-xs text-center text-gray-400">No se encontraron ingredientes</div>
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Summary */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-text-main flex items-center gap-2">
              <Calculator size={20} className="text-primary-dark" /> Resumen
            </h3>
            <div className="mb-6 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Costo Insumos</span>
                <span className="font-semibold text-text-main">${baseCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Margen Error (5%)</span>
                <span className="font-semibold text-text-main">${errorMargin.toFixed(2)}</span>
              </div>
              <div className="my-2 h-px w-full bg-gray-100"></div>
              <div className="flex justify-between items-center text-base">
                <span className="font-medium text-text-main">Costo Total Receta</span>
                <span className="font-bold text-lg text-text-main">${totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                <span>Costo por porción ({portions})</span>
                <span>${costPerPortion.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-4 rounded-xl bg-background-light p-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-bold uppercase text-gray-500">Multiplicador</label>
                  <span className="text-xs font-bold text-primary-dark">{multiplier}x</span>
                </div>
                <input
                  type="range"
                  min="1" max="5" step="0.1"
                  value={multiplier}
                  onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="text-[10px] font-bold uppercase text-gray-500">Margen %</label>
                  <div className="mt-1 w-full rounded-lg bg-white border border-gray-200 px-3 py-2 text-sm font-bold text-text-main">
                    {marginPercent.toFixed(0)}%
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-500">Ganancia</label>
                  <div className="mt-1 flex items-center rounded-lg bg-primary/10 px-3 py-2 text-sm font-bold text-green-700">
                    +${profit.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-primary/30 bg-white p-6 shadow-lg shadow-primary/5">
            <div className="mb-6">
              <label className="mb-2 block text-sm font-bold text-text-main">Precio Venta Sugerido</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-text-main">$</span>
                <input
                  className="w-full rounded-xl border-2 border-primary bg-white px-4 py-4 pl-8 text-3xl font-black text-text-main focus:outline-none"
                  type="number"
                  value={suggestedPrice.toFixed(2)}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
            <Info className="text-blue-500 flex-shrink-0" size={20} />
            <p className="text-xs text-blue-800">Esta receta tiene un margen saludable (superior al 60%).</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostCalculator;