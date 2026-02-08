import React from 'react';
import { Download, Plus, Search, Eye, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: '01', uv: 4000 },
  { name: '05', uv: 3000 },
  { name: '10', uv: 5000 },
  { name: '15', uv: 2780 },
  { name: '20', uv: 6890 },
  { name: '25', uv: 4390 },
  { name: '30', uv: 7490 },
];

const SalesHistory: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main">Historial de Ventas</h1>
          <p className="text-gray-500">Resumen financiero y transacciones.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary">
            <option>Noviembre 2023</option>
            <option>Octubre 2023</option>
          </select>
          <button className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download size={18} /> Exportar
          </button>
          <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-text-main px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-colors">
            <Plus size={18} /> Nueva Venta
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-bold text-text-main mb-4">Tendencia de Ingresos</h3>
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2bee7c" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#2bee7c" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                    <Area type="monotone" dataKey="uv" stroke="#2bee7c" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-text-main">Detalle de Transacciones</h3>
            <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input type="text" className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary w-64" placeholder="Buscar cliente..." />
            </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Pedido</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Total</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Ganancia</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-400" /> 12 Nov, 14:30
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-text-main">Juan Pérez</td>
                            <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[200px]">Hamburguesa Doble, Papas...</td>
                            <td className="px-6 py-4 text-sm text-right font-semibold">$18.50</td>
                            <td className="px-6 py-4 text-sm text-right font-bold text-primary-dark">$8.20</td>
                            <td className="px-6 py-4 text-center">
                                <button className="text-gray-400 hover:text-primary-dark"><Eye size={20} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <p className="text-sm text-gray-600">Mostrando 1-5 de 42</p>
                <div className="flex gap-2">
                    <button className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"><ChevronLeft size={20} /></button>
                    <button className="p-1 rounded hover:bg-gray-200"><ChevronRight size={20} /></button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SalesHistory;