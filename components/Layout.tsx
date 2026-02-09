import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Calculator,
  Store,
  History,
  LogOut,
  ChefHat,
  Settings,
  Menu as MenuIcon
} from 'lucide-react';
import { Toaster } from 'sonner';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Inventario', path: '/inventory', icon: Package },
    { name: 'Recetas', path: '/recipes', icon: ChefHat },
    { name: 'Calculadora', path: '/calculator', icon: Calculator },
    { name: 'Ventas (POS)', path: '/pos', icon: Store },
    { name: 'Historial', path: '/sales', icon: History },
  ];

  return (
    <aside className="hidden md:flex w-72 flex-col justify-between border-r border-gray-200 bg-white px-4 py-6 h-screen sticky top-0">
      <div className="flex flex-col gap-8">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary-dark">
            <ChefHat size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-text-main">GastroManager</h1>
            <p className="text-xs font-medium text-text-secondary">Pro Edition</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200 group
                ${isActive
                  ? 'bg-primary/10 text-primary-dark font-semibold'
                  : 'text-text-main hover:bg-gray-50 text-gray-600'}
              `}
            >
              <item.icon size={20} className={location.pathname === item.path ? "text-primary-dark" : "text-gray-400 group-hover:text-primary-dark"} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User & Footer */}
      <div className="flex flex-col gap-4">
        <div className="border-t border-gray-100 pt-4">
          <NavLink
            to="/settings"
            className={({ isActive }) => `
                flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors
                ${isActive ? 'bg-gray-100 text-text-main' : 'text-gray-600 hover:bg-gray-50'}
              `}
          >
            <Settings size={20} className="text-gray-400" />
            <span className="text-sm font-medium">Configuración</span>
          </NavLink>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-background-light p-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
            <img
              alt="Profile"
              className="h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
            />
          </div>
          <div className="flex flex-col overflow-hidden">
            <p className="truncate text-sm font-bold text-text-main">Carlos Rivera</p>
            <p className="truncate text-xs text-text-secondary">Chef Ejecutivo</p>
          </div>
          <button onClick={handleLogout} className="ml-auto text-gray-400 hover:text-red-500 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 md:px-8 backdrop-blur-md">
      <div className="flex items-center gap-4 md:hidden">
        <button className="rounded-lg p-2 hover:bg-gray-100">
          <MenuIcon size={24} className="text-gray-600" />
        </button>
        <span className="font-bold text-lg">GastroManager</span>
      </div>

      <div className="flex w-full justify-end items-center gap-4">
        {/* Notifications and Help buttons removed */}
      </div>
    </header>
  );
}

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full bg-background-light">
      <Sidebar />
      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;