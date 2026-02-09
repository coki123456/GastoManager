import React, { useEffect } from 'react';
import { Plus, Search, Edit, Trash2, ChefHat, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRecipesStore } from '../store/useRecipesStore';

const RecipeList: React.FC = () => {
    const navigate = useNavigate();
    const { recipes, fetchRecipes, deleteRecipe, isLoading } = useRecipesStore();

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar esta receta?')) {
            await deleteRecipe(id);
        }
    };

    const calculateTotalCost = (ingredients: any[]) => {
        return ingredients.reduce((acc, ing) => acc + (ing.cost * ing.quantity), 0);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-text-main">Mis Recetas</h1>
                    <p className="text-gray-500">Gestiona tus platos, costos y precios de venta.</p>
                </div>
                <button
                    onClick={() => navigate('/calculator')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-dark font-bold text-text-main text-sm transition-colors shadow-sm"
                >
                    <Plus size={18} /> Nueva Receta
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 bg-white p-1 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center px-4 h-12">
                        <Search className="text-gray-400 mr-3" size={20} />
                        <input type="text" className="w-full bg-transparent outline-none text-sm" placeholder="Buscar receta..." />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Nombre del Plato</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Porciones</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Costo Total</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Costo/Porción</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Precio Venta</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Margen</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recipes.map((recipe) => {
                                const totalCost = calculateTotalCost(recipe.ingredients);
                                const costPerPortion = totalCost / recipe.portions;
                                const margin = recipe.price > 0 ? ((recipe.price - costPerPortion) / recipe.price) * 100 : 0;

                                return (
                                    <tr key={recipe.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary-dark">
                                                    <ChefHat size={20} />
                                                </div>
                                                <span className="font-bold text-text-main text-sm">{recipe.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{recipe.portions}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-600">${totalCost.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-600">${costPerPortion.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-text-main">${recipe.price.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${margin >= 30 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {margin.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/calculator?recipeId=${recipe.id}`)}
                                                    className="text-gray-400 hover:text-primary-dark transition-colors p-1"
                                                    title="Editar"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(recipe.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {recipes.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        No tienes recetas guardadas. ¡Crea la primera con la Calculadora!
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

export default RecipeList;
