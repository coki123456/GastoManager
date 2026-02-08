import React, { useState } from 'react';
import { Save, Check, PlusCircle, Trash2, Calculator, Info } from 'lucide-react';

interface IngredientRow {
  id: number;
  name: string;
  qty: number;
  unit: string;
  cost: number;
  total: number;
  icon: string;
  color: string;
}

const CostCalculator: React.FC = () => {
  const [multiplier, setMultiplier] = useState(3.0);
  const [baseCost] = useState(3.62);
  const [errorMargin] = useState(0.18);
  const totalCost = baseCost + errorMargin;
  
  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { id: 1, name: 'Pan Brioche Artesanal', qty: 1, unit: 'Unidad', cost: 0.80, total: 0.80, icon: '🍞', color: 'bg-orange-100 text-orange-600' },
    { id: 2, name: 'Carne Molida Especial', qty: 180, unit: 'Gramos', cost: 0.012, total: 2.16, icon: '🥩', color: 'bg-red-100 text-red-600' },
    { id: 3, name: 'Queso Cheddar', qty: 2, unit: 'Lámina', cost: 0.30, total: 0.60, icon: '🧀', color: 'bg-yellow-100 text-yellow-600' },
    { id: 4, name: 'Lechuga Fresca', qty: 30, unit: 'Gramos', cost: 0.002, total: 0.06, icon: '🥬', color: 'bg-green-100 text-green-600' },
  ]);

  const handleDelete = (id: number) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  const suggestedPrice = totalCost * multiplier;
  const marginPercent = ((suggestedPrice - totalCost) / suggestedPrice) * 100;

  return (
    <div className="flex flex-col gap-6">
       <header className="flex items-center justify-between bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-text-main">Calculadora de Costos</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-text-main shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <Save size={18} /> Guardar
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-text-main px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-black">
            <Check size={18} /> Finalizar
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
                  defaultValue="Hamburguesa Clásica Doble" 
                />
              </div>
              <div className="w-32">
                <label className="mb-2 block text-sm font-medium text-gray-500">Porciones</label>
                <div className="relative">
                  <input className="w-full rounded-xl border-gray-200 bg-background-light px-4 py-3 text-center text-lg font-bold text-text-main outline-none" type="number" defaultValue="1" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">UND</span>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-background-light text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Ingrediente</th>
                    <th className="px-6 py-4 font-medium w-24">Cant.</th>
                    <th className="px-6 py-4 font-medium w-32">Unidad</th>
                    <th className="px-6 py-4 font-medium text-right w-32">Total</th>
                    <th className="px-4 py-4 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ingredients.map(ing => (
                    <tr key={ing.id} className="group hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded flex items-center justify-center ${ing.color} text-lg`}>
                            {ing.icon}
                          </div>
                          <span className="font-medium text-text-main">{ing.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input className="w-16 rounded-lg border-gray-200 bg-white px-2 py-1 text-center text-sm" type="number" defaultValue={ing.qty} />
                      </td>
                      <td className="px-6 py-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">{ing.unit}</span></td>
                      <td className="px-6 py-4 text-right font-medium">${ing.total.toFixed(2)}</td>
                      <td className="px-4 py-4 text-center">
                        <button onClick={() => handleDelete(ing.id)} className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 p-1 rounded">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={5} className="p-2">
                      <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white py-3 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-primary-dark transition-all">
                        <PlusCircle size={18} /> Agregar Ingrediente
                      </button>
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
                <span className="font-medium text-text-main">Costo Real</span>
                <span className="font-bold text-lg text-text-main">${totalCost.toFixed(2)}</span>
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
                    +${(suggestedPrice - totalCost).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-primary/30 bg-white p-6 shadow-lg shadow-primary/5">
            <div className="mb-6">
              <label className="mb-2 block text-sm font-bold text-text-main">Precio Venta Final</label>
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
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 text-base font-bold text-text-main shadow-md hover:bg-primary-dark transition-all">
              Registrar Receta
            </button>
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