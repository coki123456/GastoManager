import React from 'react';
import { User, Search, DollarSign, CheckCircle2, MoreVertical, Lightbulb } from 'lucide-react';
import { Sale } from '../types';

const recentSales: Sale[] = [
  { id: '1', time: '14:32', customer: 'Carlos M.', items: 'Hamburguesa Doble + Papas', total: 12.50, status: 'PAGADO', color: 'bg-orange-400' },
  { id: '2', time: '14:15', customer: 'Mesa 5', items: 'Pizza Familiar Peperoni', total: 18.00, status: 'PAGADO', color: 'bg-red-400' },
  { id: '3', time: '13:58', customer: 'Ana R.', items: 'Ensalada César + Agua', total: 9.20, status: 'PENDIENTE', color: 'bg-blue-400' },
  { id: '4', time: '13:45', customer: 'Pedido #402', items: 'Café Americano x2', total: 4.50, status: 'PAGADO', color: 'bg-purple-400' },
  { id: '5', time: '13:30', customer: 'Mesa 2', items: 'Lomo Saltado', total: 15.00, status: 'PAGADO', color: 'bg-orange-400' },
];

const POS: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-main">Registrar Nueva Venta</h1>
          <p className="text-gray-500">Ingresa los detalles para actualizar caja y stock.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-3 min-w-[140px]">
            <span className="text-xs text-gray-500 font-bold uppercase">Total Hoy</span>
            <span className="text-xl font-bold block text-text-main">$1,240.50</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 min-w-[140px]">
            <span className="text-xs text-gray-500 font-bold uppercase">Tickets</span>
            <span className="text-xl font-bold block text-text-main">42</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Quick Form */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-primary/10 p-4 border-b border-gray-200 flex items-center gap-2">
              <span className="font-bold text-text-main">Venta Rápida</span>
            </div>
            <form className="p-5 flex flex-col gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-text-main">Cliente</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input type="text" className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary" placeholder="Ej: Mesa 4" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-text-main">Pedido / Receta</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input type="text" className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary" placeholder="Buscar receta..." />
                </div>
                <p className="text-xs text-gray-500">Descuenta stock automáticamente.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-text-main">Precio ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input type="number" className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary font-mono" placeholder="0.00" />
                </div>
              </div>

              <button type="button" className="mt-2 w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-text-main font-bold py-3.5 px-4 rounded-lg transition-all shadow-md">
                <CheckCircle2 size={20} /> Registrar Venta
              </button>
            </form>
          </div>

          <div className="bg-[#eafdf2] rounded-lg p-4 border border-primary/20 flex gap-3 items-start">
            <Lightbulb className="text-primary-dark mt-0.5" size={20} />
            <div>
              <h4 className="text-sm font-bold text-text-main mb-1">Tip de eficiencia</h4>
              <p className="text-xs text-gray-600">Usa <kbd className="font-mono bg-white px-1 rounded border border-gray-200">TAB</kbd> para navegar y <kbd className="font-mono bg-white px-1 rounded border border-gray-200">ENTER</kbd> para guardar.</p>
            </div>
          </div>
        </div>

        {/* Right: Table */}
        <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-text-main">Últimas Ventas</h3>
                <button className="text-xs font-bold text-primary-dark bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20">Ver todas</button>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex-1">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="py-3 px-4 text-xs font-bold uppercase text-gray-500">Hora</th>
                                <th className="py-3 px-4 text-xs font-bold uppercase text-gray-500">Cliente</th>
                                <th className="py-3 px-4 text-xs font-bold uppercase text-gray-500">Pedido</th>
                                <th className="py-3 px-4 text-xs font-bold uppercase text-gray-500 text-right">Monto</th>
                                <th className="py-3 px-4 text-xs font-bold uppercase text-gray-500 text-center">Estado</th>
                                <th className="py-3 px-4 w-[50px]"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentSales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="py-3 px-4 text-xs font-mono text-gray-500">{sale.time}</td>
                                    <td className="py-3 px-4 font-medium text-text-main">{sale.customer}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${sale.color}`}></div>
                                            {sale.items}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-right font-bold text-text-main font-mono">${sale.total.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold border ${sale.status === 'PAGADO' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                                            {sale.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default POS;