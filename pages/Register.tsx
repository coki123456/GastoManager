import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Mail, Lock, User, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Register: React.FC = () => {
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      // Optional: Clear form
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-background-light flex flex-col md:flex-row">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col bg-white">
        <header className="flex items-center gap-3 px-8 py-6 border-b border-gray-100 md:border-none">
          <div className="text-primary-dark"><ChefHat size={32} /></div>
          <span className="text-xl font-bold text-text-main">GastroManager</span>
        </header>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-black text-text-main mb-2">Crea tu cuenta</h1>
              <p className="text-text-secondary">Gestiona los costos y ventas de tu negocio gastronómico.</p>
            </div>

            <button className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-3 hover:bg-gray-50 transition-colors font-bold text-text-main">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Registrarse con Google
            </button>

            <div className="relative flex items-center justify-center">
              <hr className="w-full border-gray-200" />
              <span className="absolute bg-white px-4 text-sm font-medium text-gray-400">o regístrate con tu email</span>
            </div>

            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-500 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-green-50 text-green-500 rounded-lg text-sm font-medium">
                  Registro exitoso. Por favor revisa tu correo para confirmar tu cuenta.
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1.5">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="Ej. Juan Pérez"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-main mb-1.5">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="nombre@ejemplo.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1.5">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="Mínimo 6 car."
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-main mb-1.5">Confirmar</label>
                  <div className="relative">
                    <CheckCircle2 className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      placeholder="Repite..."
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="terms" required className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" />
                <label htmlFor="terms" className="text-sm text-gray-600">Acepto los <a href="#" className="font-bold text-text-main underline decoration-primary decoration-2 underline-offset-2">Términos y Condiciones</a></label>
              </div>

              <button type="submit" disabled={loading} className="mt-4 w-full bg-primary hover:bg-primary-dark text-text-main py-3 rounded-lg font-bold text-lg transition-colors shadow-sm disabled:opacity-50">
                {loading ? 'Creando Cuenta...' : 'Crear Cuenta'}
              </button>
            </form>

            <div className="text-center mt-2">
              <span className="text-sm text-gray-600">¿Ya tienes una cuenta? </span>
              <Link to="/login" className="text-sm font-bold text-text-main hover:underline">Iniciar Sesión</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex flex-1 relative bg-background-light overflow-hidden items-center justify-center p-12">
        <div className="relative w-full max-w-2xl aspect-[3/4] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Chefs cooking"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-10 left-10 right-10 z-20 text-white">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl">
              <h3 className="text-2xl font-bold mb-2">Optimiza tu Rentabilidad</h3>
              <p className="text-gray-200">"Desde que usamos GastroManager, hemos reducido nuestros costos de desperdicio en un 25% y mejorado los tiempos de servicio."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;