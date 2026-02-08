import React from 'react';
import { TrendingUp, ArrowUp, DollarSign, ShoppingCart, Percent, Lightbulb, Calendar } from 'lucide-react';

const salesData = [
  { day: 'Lun', sales: 4000 },
  { day: 'Mar', sales: 3000 },
  { day: 'Mié', sales: 5000 },
  { day: 'Jue', sales: 2780 },
  { day: 'Vie', sales: 6890 },
  { day: 'Sáb', sales: 8390 },
  { day: 'Dom', sales: 7490 },
];

const totalWeeklySales = salesData.reduce((acc, curr) => acc + curr.sales, 0);
const averageDailySales = Math.round(totalWeeklySales / salesData.length);
const bestDay = salesData.reduce((prev, current) => (prev.sales > current.sales) ? prev : current);

const topProducts = [
  { name: 'Hamburguesa Especial', cost: 4.50, price: 12.99, margin: 65 },
  { name: 'Limonada de Coco', cost: 1.20, price: 4.50, margin: 73 },
  { name: 'Pasta Carbonara', cost: 3.80, price: 14.00, margin: 72 },
  { name: 'Tiramisú Casero', cost: 2.10, price: 6.50, margin: 67 },
];

const DashboardReports: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-main">Reportes y Estadísticas</h1>
          <p className="text-gray-500 mt-1">Analiza el rendimiento detallado de tu negocio.</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
          <button className="px-3 py-1.5 text-xs font-medium rounded hover:bg-gray-100 text-gray-600">Hoy</button>
          <button className="px-3 py-1.5 text-xs font-medium rounded bg-primary text-text-main font-bold shadow-sm">Esta Semana</button>
          <button className="px-3 py-1.5 text-xs font-medium rounded hover:bg-gray-100 text-gray-600">Este Mes</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><DollarSign size={64} /></div>
          <p className="text-gray-500 text-sm font-medium mb-1">Ventas Totales</p>
          <div className="flex items-end gap-3">
            <h3 className="text-2xl font-bold text-text-main">$12,450</h3>
            <span className="flex items-center text-xs font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded mb-1">
              <TrendingUp size={14} className="mr-0.5" /> +15%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><ShoppingCart size={64} /></div>
          <p className="text-gray-500 text-sm font-medium mb-1">Costos Totales</p>
          <div className="flex items-end gap-3">
            <h3 className="text-2xl font-bold text-text-main">$8,200</h3>
            <span className="flex items-center text-xs font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded mb-1">
              <TrendingUp size={14} className="mr-0.5" /> +5%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><DollarSign size={64} /></div>
          <p className="text-gray-500 text-sm font-medium mb-1">Beneficio Neto</p>
          <div className="flex items-end gap-3">
            <h3 className="text-2xl font-bold text-text-main">$4,250</h3>
            <span className="flex items-center text-xs font-bold text-primary-dark bg-primary/20 px-1.5 py-0.5 rounded mb-1">
              <TrendingUp size={14} className="mr-0.5" /> +22%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Percent size={64} /></div>
          <p className="text-gray-500 text-sm font-medium mb-1">Margen Promedio</p>
          <div className="flex items-end gap-3">
            <h3 className="text-2xl font-bold text-text-main">34.1%</h3>
            <span className="flex items-center text-xs font-bold text-primary-dark bg-primary/20 px-1.5 py-0.5 rounded mb-1">
              <ArrowUp size={14} className="mr-0.5" /> +2.5%
            </span>
          </div>
        </div>
      </div>

      {/* Weekly Sales Summary (Replaces Charts) */}
      <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
        <div className="flex flex-col gap-2 relative z-10">
            <div className="flex items-center gap-3">
               <div className="p-3 bg-primary/10 rounded-xl text-primary-dark shadow-sm">
                  <Calendar size={24} />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-text-main leading-tight">Ventas de la Semana</h3>
                  <p className="text-xs text-gray-500">Resumen consolidado de ingresos</p>
               </div>
            </div>
            <div className="mt-2">
                <p className="text-5xl font-black text-text-main tracking-tight">${totalWeeklySales.toLocaleString()}</p>
            </div>
        </div>
          
        <div className="flex flex-wrap justify-center md:justify-end gap-8 relative z-10">
            <div className="text-right border-r border-gray-100 pr-8 last:border-0 last:pr-0">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider">Mejor Día</p>
                <p className="text-2xl font-bold text-text-main">{bestDay.day}</p>
                <p className="text-sm text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full inline-block mt-1">${bestDay.sales.toLocaleString()}</p>
            </div>
            <div className="text-right">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider">Promedio Diario</p>
                <p className="text-2xl font-bold text-text-main">${averageDailySales.toLocaleString()}</p>
                 <p className="text-sm text-gray-500 font-medium mt-1 flex items-center justify-end gap-1">
                    <TrendingUp size={14} className="text-primary-dark" /> Estable
                 </p>
            </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-text-main">Productos más Rentables</h3>
            <button className="text-sm font-medium text-primary-dark hover:underline">Ver Todos</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Producto</th>
                  <th className="px-6 py-3 font-medium">Costo</th>
                  <th className="px-6 py-3 font-medium">Precio</th>
                  <th className="px-6 py-3 font-medium text-right">Margen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topProducts.map((p) => (
                  <tr key={p.name} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-text-main">{p.name}</td>
                    <td className="px-6 py-4 text-gray-500">${p.cost.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-500">${p.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-bold text-green-600">{p.margin}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-text-main mb-4">Balance Financiero</h3>
            <div className="space-y-6">
              {[
                { label: 'Ingresos', amount: 12450, color: 'bg-primary', width: '85%' },
                { label: 'Materia Prima', amount: 4100, color: 'bg-red-500', width: '33%' },
                { label: 'Operativos', amount: 2100, color: 'bg-orange-400', width: '17%' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-gray-600">{item.label}</span>
                    <span className="text-sm font-bold text-text-main">${item.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full`} style={{width: item.width}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-100 flex gap-3">
            <Lightbulb className="text-yellow-600 flex-shrink-0" size={20} />
            <p className="text-xs text-yellow-800 leading-relaxed">
              <strong>Consejo IA:</strong> Tus costos de materia prima han bajado un 2%. Considera mantener el proveedor actual de lácteos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardReports;