import React, { useState } from 'react';
import { Search, Plus, RefreshCw, MoreVertical, AlertTriangle, DollarSign } from 'lucide-react';
import AddIngredientModal from '../components/AddIngredientModal';
import { useInventoryStore } from '../store/useInventoryStore';

const Inventory: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { ingredients, fetchIngredients, isLoading } = useInventoryStore();

  React.useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  const totalValue = ingredients.reduce((acc, item) => acc + (item.stock * item.price), 0);
  const lowStockItems = ingredients.filter(item => item.status === 'Bajo Stock').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <AddIngredientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-main">Inventario de Ingredientes</h1>
          <p className="text-gray-500">Gestiona el stock, costos y proveedores en tiempo real.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 font-semibold text-sm transition-colors">
            <RefreshCw size={18} /> Actualizar Stock
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-dark font-bold text-text-main text-sm transition-colors shadow-sm"
          >
            <Plus size={18} /> Añadir Ingrediente
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 bg-white p-1 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center px-4 h-12">
            <Search className="text-gray-400 mr-3" size={20} />
            <input type="text" className="w-full bg-transparent outline-none text-sm" placeholder="Buscar por ingrediente, proveedor..." />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Valor Total</p>
            <p className="text-lg font-bold text-text-main">${totalValue.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><DollarSign size={20} /></div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Bajo Stock</p>
            <p className={`text-lg font-bold ${lowStockItems > 0 ? 'text-red-500' : 'text-green-500'}`}>{lowStockItems} Ítems</p>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${lowStockItems > 0 ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'}`}><AlertTriangle size={20} /></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Ingrediente</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Stock Actual</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Mínimo</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Precio</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Proveedor</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ingredients.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 bg-cover bg-center" style={{ backgroundImage: `url('${item.image}')` }}></div>
                      <div>
                        <p className="font-bold text-text-main text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{item.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className={`font-bold ${item.status === 'Bajo Stock' ? 'text-red-500' : 'text-text-main'}`}>{item.stock} {item.unit}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.minStock} {item.unit}</td>
                  <td className="px-6 py-4 text-sm font-medium">${item.price}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.supplier}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Bajo Stock' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-primary-dark transition-colors"><MoreVertical size={18} /></button>
                  </td>
                </tr>
              ))}
              {ingredients.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No hay ingredientes registrados. ¡Añade el primero!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;