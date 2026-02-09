import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, FileText, ChevronDown, Package, AlertTriangle, Truck, Search, Check, Carrot } from 'lucide-react';
import { useInventoryStore } from '../store/useInventoryStore';

// Esquema de validación con Zod
const ingredientSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  category: z.string().min(1, "Debes seleccionar una categoría"),
  unit: z.string().min(1, "Debes seleccionar una unidad"),
  price: z.number({ invalid_type_error: "Debe ser un número" }).min(0, "El precio no puede ser negativo"),
  stock: z.number({ invalid_type_error: "Debe ser un número" }).min(0, "El stock no puede ser negativo"),
  min_stock: z.number({ invalid_type_error: "Debe ser un número" }).min(0, "El stock mínimo no puede ser negativo"),
  supplier: z.string().optional(),
});

type IngredientFormValues = z.infer<typeof ingredientSchema>;

import { Ingredient } from '../types';

interface AddIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Ingredient | null;
}

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({ isOpen, onClose, initialData }) => {
  const addIngredient = useInventoryStore(state => state.addIngredient);
  const updateIngredient = useInventoryStore(state => state.updateIngredient);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      unit: 'Kg',
      stock: 0,
      min_stock: 5,
      price: 0
    }
  });

  // Reset form when initialData changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name,
          category: initialData.category,
          unit: initialData.unit,
          stock: initialData.stock,
          min_stock: initialData.min_stock,
          price: initialData.price,
          supplier: initialData.supplier || '',
        });
      } else {
        reset({
          name: '',
          category: '',
          unit: 'Kg',
          stock: 0,
          min_stock: 5,
          price: 0,
          supplier: ''
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data: IngredientFormValues) => {
    if (initialData) {
      await updateIngredient(initialData.id, {
        name: data.name,
        category: data.category,
        unit: data.unit,
        stock: data.stock,
        min_stock: data.min_stock,
        price: data.price,
        supplier: data.supplier || 'Sin Proveedor',
      });
    } else {
      await addIngredient({
        name: data.name,
        category: data.category,
        unit: data.unit,
        stock: data.stock,
        min_stock: data.min_stock,
        price: data.price,
        supplier: data.supplier || 'Sin Proveedor',
        image: ''
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      >
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2bee7c 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      </div>

      {/* Modal Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="relative w-full max-w-4xl bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-main flex items-center gap-2">
              <Carrot className="text-primary-dark" size={28} />
              {initialData ? 'Editar Ingrediente' : 'Añadir Nuevo Ingrediente'}
            </h1>
            <p className="text-sm text-gray-500">
              {initialData ? 'Modifique los detalles del insumo.' : 'Complete los detalles para registrar un nuevo insumo.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Section 1: Basic Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <FileText className="text-primary-dark" size={24} />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Detalles Básicos</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-text-main">Nombre del ingrediente <span className="text-primary-dark">*</span></span>
                <input
                  {...register('name')}
                  className={`w-full rounded-lg border ${errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'} bg-gray-50 px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400`}
                  placeholder="Ej. Bondiola de Cerdo"
                  type="text"
                />
                {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-text-main">Categoría <span className="text-primary-dark">*</span></span>
                <div className="relative">
                  <select
                    {...register('category')}
                    className={`w-full rounded-lg border ${errors.category ? 'border-red-500' : 'border-gray-200'} bg-gray-50 px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none text-text-main`}
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="carnicos">Cárnicos</option>
                    <option value="verduras">Verduras y Frutas</option>
                    <option value="lacteos">Lácteos</option>
                    <option value="secos">Secos y Especias</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="desechables">Desechables</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
                {errors.category && <span className="text-xs text-red-500">{errors.category.message}</span>}
              </label>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-text-main">Unidad de medida <span className="text-primary-dark">*</span></span>
              <div className="flex flex-wrap gap-3">
                {['Kg', 'L', 'Unid', 'gr', 'ml'].map((unit) => (
                  <label key={unit} className="relative cursor-pointer group">
                    <input
                      {...register('unit')}
                      type="radio"
                      value={unit}
                      className="peer sr-only"
                    />
                    <div className="px-5 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 text-sm font-medium transition-all peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary-dark hover:border-primary/50">
                      {unit}
                    </div>
                  </label>
                ))}
              </div>
              {errors.unit && <span className="text-xs text-red-500">{errors.unit.message}</span>}
            </div>
          </div>

          {/* Section 2: Inventory & Costs */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Package className="text-primary-dark" size={24} />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Inventario y Costos</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-text-main">Precio de compra</span>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">$</span>
                  <input
                    {...register('price', { valueAsNumber: true })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-8 pr-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                    placeholder="0.00"
                    step="0.01"
                    type="number"
                  />
                </div>
                {errors.price && <span className="text-xs text-red-500">{errors.price.message}</span>}
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-text-main">Stock Inicial</span>
                <input
                  {...register('stock', { valueAsNumber: true })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                  placeholder="0"
                  type="number"
                />
                {errors.stock && <span className="text-xs text-red-500">{errors.stock.message}</span>}
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-text-main flex items-center justify-between">
                  Stock mínimo
                  <AlertTriangle className="text-yellow-500 cursor-help" size={18} />
                </span>
                <input
                  {...register('min_stock', { valueAsNumber: true })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                  placeholder="0"
                  type="number"
                />
                {errors.min_stock && <span className="text-xs text-red-500">{errors.min_stock.message}</span>}
              </label>
            </div>
          </div>

          {/* Section 3: Supplier */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Truck className="text-primary-dark" size={24} />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Proveedor</h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-text-main">Proveedor Principal (Opcional)</span>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    {...register('supplier')}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                    placeholder="Buscar proveedor existente o añadir nuevo..."
                    type="text"
                  />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-lg text-sm font-semibold text-gray-600 border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-lg text-sm font-bold text-text-main bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Check size={20} />
            {isSubmitting ? 'Guardando...' : (initialData ? 'Actualizar Ingrediente' : 'Guardar Ingrediente')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddIngredientModal;