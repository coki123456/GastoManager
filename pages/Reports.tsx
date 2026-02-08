import React, { useEffect, useState } from 'react';
import { DollarSign, ShoppingCart, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, Lightbulb } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Initial state
const initialStats = {
  salesToday: 0,
  ordersToday: 0,
  revenueMonth: 0,
  lowStockItems: 0
};

const DashboardReports: React.FC = () => {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 1. Sales Today
      const { data: salesTodayData, error: salesError } = await supabase
        .from('sales')
        .select('total')
        .gte('created_at', today.toISOString());

      if (salesError) throw salesError;

      const salesToday = salesTodayData ? salesTodayData.reduce((acc, curr) => acc + curr.total, 0) : 0;
      const ordersToday = salesTodayData ? salesTodayData.length : 0;

      // 2. Low Stock Items
      const { data: ingredientsData, error: ingError } = await supabase
        .from('ingredients')
        .select('stock, minStock');

      if (ingError) throw ingError;

      const lowStockItems = ingredientsData ? ingredientsData.filter((i: any) => i.stock <= i.minStock).length : 0;

      // 3. Fake Chart Data (since we don't have months of history)
      const mockChartData = [
        { name: 'Lun', venta: salesToday * 0.4 },
        { name: 'Mar', venta: salesToday * 0.6 },
        { name: 'Mie', venta: salesToday * 0.3 },
        { name: 'Jue', venta: salesToday * 0.8 },
        { name: 'Vie', venta: salesToday * 0.9 },
        { name: 'Sab', venta: salesToday * 1.2 },
        { name: 'Dom', venta: salesToday }
      ];
      setSalesData(mockChartData);

      setStats({
        salesToday,
        ordersToday,
        revenueMonth: salesToday * 30, // Projection
        lowStockItems
      });

    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Ventas Hoy',
      value: `$${stats.salesToday.toFixed(2)}`,
      icon: DollarSign,
      trend: '+12.5%',
      positive: true,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Pedidos Hoy',
      value: stats.ordersToday.toString(),
      icon: ShoppingCart,
      trend: '+5.2%',
      positive: true,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Ingresos Mes',
      value: `$${stats.revenueMonth.toFixed(2)}`,
      icon: TrendingUp,
      trend: '+2.4%',
      positive: true,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Stock Bajo',
      value: stats.lowStockItems.toString(),
      icon: AlertTriangle,
      trend: 'Requiere Atención',
      positive: false,
      color: 'bg-red-100 text-red-600'
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-main">Dashboard</h1>
          <p className="text-gray-500">Resumen general de tu negocio</p>
        </div>
        <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200">
          Última actualización: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${card.color}`}>
                <card.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${card.positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {card.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {card.trend}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">{card.title}</div>
              <div className="text-2xl font-black text-text-main">{loading ? '...' : card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-text-main">Tendencia de Ventas (Semanal)</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorVenta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E1E1E" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#1E1E1E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="venta" stroke="#1E1E1E" strokeWidth={3} fillOpacity={1} fill="url(#colorVenta)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-text-main text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 h-full flex flex-col justify-between text-center items-center py-8">
            <div>
              <h3 className="text-xl font-bold mb-2">GastroManager Pro</h3>
              <p className="text-gray-400 text-sm">Versión 1.0.0</p>
            </div>

            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 w-full max-w-[200px]">
              <div className="text-xs text-gray-400 uppercase font-bold mb-1">Estado del Sistema</div>
              <div className="flex items-center justify-center gap-2 text-green-400 font-bold">
                <div className="w-2 h-2 bg-green-400 rounded-full relative">
                  <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
                </div>
                En Línea
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-400 mb-4">¿Necesitas ayuda?</p>
              <button className="bg-white text-text-main px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors w-full">
                Contactar Soporte
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      < div className="grid grid-cols-1 lg:grid-cols-3 gap-6" >
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
                {/* Placeholder for top products */}
                {[
                  { name: 'Café Latte', cost: 1.50, price: 4.00, margin: 62.5 },
                  { name: 'Sandwich de Pollo', cost: 2.00, price: 6.50, margin: 69.23 },
                  { name: 'Jugo Natural', cost: 1.00, price: 3.50, margin: 71.43 },
                  { name: 'Tarta de Manzana', cost: 1.20, price: 4.50, margin: 73.33 },
                ].map((p) => (
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
                    <div className={`${item.color} h-2 rounded-full`} style={{ width: item.width }}></div>
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
      </div >
    </div >
  );
};

export default DashboardReports;