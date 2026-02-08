import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, Mail, Lock, Eye } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background-light flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2 text-primary-dark">
          <ChefHat size={32} />
          <span className="text-xl font-bold text-text-main">GastroManager</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span className="text-sm text-text-secondary">¿No tienes cuenta?</span>
          <Link to="/register" className="px-4 py-2 bg-gray-100 text-text-main font-bold text-sm rounded-lg hover:bg-gray-200 transition-colors">
            Registrarse
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex justify-center items-center p-4">
        <div className="w-full max-w-[480px] bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-text-main mb-2">Bienvenido de nuevo</h1>
            <p className="text-text-secondary">Gestiona los costos y ventas de tu negocio</p>
          </div>

          <button className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-3 hover:bg-gray-50 transition-colors font-bold text-text-main mb-6">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Continuar con Google
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <hr className="w-full border-gray-200" />
            <span className="absolute bg-white px-3 text-xs font-bold text-text-secondary uppercase">o con email</span>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Correo electrónico</label>
              <div className="relative">
                <input 
                  type="email" 
                  className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="ejemplo@restaurante.com"
                />
                <Mail className="absolute right-3 top-3 text-gray-400" size={20} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-text-main">Contraseña</label>
                <a href="#" className="text-sm font-bold text-primary-dark hover:underline">¿Olvidaste tu contraseña?</a>
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="Ingresa tu contraseña"
                />
                <button type="button" className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                  <Eye size={20} />
                </button>
              </div>
            </div>

            <button type="submit" className="mt-2 w-full bg-primary hover:bg-primary-dark text-text-main py-3 rounded-lg font-bold text-lg transition-colors shadow-sm">
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-6 text-center sm:hidden">
            <span className="text-sm text-text-secondary">¿No tienes cuenta? </span>
            <Link to="/register" className="text-sm font-bold text-primary-dark">Registrarse</Link>
          </div>
        </div>
      </main>

      <div className="fixed inset-0 -z-10 opacity-5 bg-[url('https://images.unsplash.com/photo-1556910103-1c02745a30bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
    </div>
  );
};

export default Login;