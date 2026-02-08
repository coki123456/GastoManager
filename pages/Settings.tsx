import React from 'react';
import { 
    User, 
    Store, 
    UploadCloud, 
    Sliders, 
    ChevronDown, 
    Sun, 
    Moon, 
    Monitor, 
    Bell, 
    Save, 
    Pencil, 
    Lock 
} from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6 text-sm">
            <a className="text-gray-400 hover:text-primary transition-colors" href="#">Inicio</a>
            <span className="text-gray-400">/</span>
            <span className="text-text-main font-medium">Configuración</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
                <h2 className="text-3xl md:text-4xl font-bold text-text-main tracking-tight mb-2">Configuración del Sistema</h2>
                <p className="text-gray-500 text-base">Gestiona tu perfil, datos del negocio y preferencias de la aplicación.</p>
            </div>
            <button className="hidden md:flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-text-main px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-primary/20">
                <Save size={20} />
                Guardar Cambios
            </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Col 1: Profile & Business (Left Side) */}
            <div className="xl:col-span-2 flex flex-col gap-6">
                
                {/* Section 1: Perfil de Usuario */}
                <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                        <User className="text-primary-dark" size={24} />
                        <h3 className="text-lg font-bold text-text-main">Perfil de Usuario</h3>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex flex-col items-center gap-3 min-w-[120px]">
                            <div className="relative group cursor-pointer">
                                <div className="w-24 h-24 rounded-full bg-cover bg-center border-2 border-gray-200 group-hover:border-primary transition-colors" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80")'}}></div>
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Pencil className="text-white" size={20} />
                                </div>
                            </div>
                            <button className="text-primary-dark text-sm font-semibold hover:underline">Cambiar foto</button>
                        </div>
                        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Nombre Completo</label>
                                <input className="w-full bg-background-light border border-gray-200 text-text-main rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-gray-400" type="text" defaultValue="Carlos Rivera"/>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Correo Electrónico</label>
                                <input className="w-full bg-background-light border border-gray-200 text-text-main rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-gray-400" type="email" defaultValue="admin@restaurante.com"/>
                            </div>
                            <div className="col-span-1 md:col-span-2 pt-2">
                                <button className="flex items-center gap-2 text-sm text-text-main bg-white hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors border border-gray-300">
                                    <Lock size={18} />
                                    Cambiar Contraseña
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: Datos del Negocio */}
                <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                        <Store className="text-primary-dark" size={24} />
                        <h3 className="text-lg font-bold text-text-main">Datos del Negocio</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Nombre del Local</label>
                            <input className="w-full bg-background-light border border-gray-200 text-text-main rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" type="text" defaultValue="GastroManager Demo"/>
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">CUIT / ID Fiscal</label>
                            <input className="w-full bg-background-light border border-gray-200 text-text-main rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono" type="text" defaultValue="30-12345678-9"/>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Logo del Negocio</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-background-light hover:bg-gray-100 transition-colors cursor-pointer group">
                                <div className="space-y-1 text-center">
                                    <div className="mx-auto h-12 w-12 text-gray-400 group-hover:text-primary-dark transition-colors flex items-center justify-center">
                                        <UploadCloud size={48} />
                                    </div>
                                    <div className="flex text-sm text-gray-500">
                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary-dark hover:text-primary focus-within:outline-none">
                                            <span>Subir un archivo</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only"/>
                                        </label>
                                        <p className="pl-1">o arrastrar y soltar</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 2MB</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Col 2: Preferences & Notifications (Right Side) */}
            <div className="xl:col-span-1 flex flex-col gap-6">
                
                {/* Section 3: Preferencias */}
                <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-fit">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                        <Sliders className="text-primary-dark" size={24} />
                        <h3 className="text-lg font-bold text-text-main">Preferencias</h3>
                    </div>
                    <div className="flex flex-col gap-5">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Moneda Principal</label>
                            <div className="relative">
                                <select className="w-full appearance-none bg-background-light border border-gray-200 text-text-main rounded-lg px-3 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer">
                                    <option>ARS - Peso Argentino ($)</option>
                                    <option>USD - Dólar Estadounidense ($)</option>
                                    <option>EUR - Euro (€)</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                    <ChevronDown size={20} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">IVA / Impuestos por Defecto (%)</label>
                            <div className="relative">
                                <input className="w-full bg-background-light border border-gray-200 text-text-main rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" type="number" defaultValue="21"/>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-gray-500 text-sm">%</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">Tema de la Aplicación</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button className="flex flex-col items-center justify-center p-2 rounded-lg border border-gray-200 bg-background-light hover:bg-gray-100 text-gray-500 transition-all">
                                    <Sun size={20} className="mb-1" />
                                    <span className="text-xs">Claro</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-2 rounded-lg border border-primary bg-primary/10 text-primary-dark transition-all relative">
                                    <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></div>
                                    <Moon size={20} className="mb-1" />
                                    <span className="text-xs font-medium">Oscuro</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-2 rounded-lg border border-gray-200 bg-background-light hover:bg-gray-100 text-gray-500 transition-all">
                                    <Monitor size={20} className="mb-1" />
                                    <span className="text-xs">Auto</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 4: Notificaciones */}
                <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-fit">
                    <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                        <Bell className="text-primary-dark" size={24} />
                        <h3 className="text-lg font-bold text-text-main">Notificaciones</h3>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col">
                                <p className="text-sm font-medium text-text-main">Alertas de stock bajo</p>
                                <p className="text-xs text-gray-500">Recibir notificaciones cuando un ingrediente esté por agotarse.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer"/>
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                        <div className="pt-2 border-t border-gray-100">
                            <label className="block text-xs font-medium text-gray-500 mb-1.5 mt-2">Umbral de alerta (unidades)</label>
                            <input className="w-24 bg-background-light border border-gray-200 text-text-main rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" type="number" defaultValue="10"/>
                        </div>
                    </div>
                </section>
            </div>
        </div>

        {/* Footer Action Bar for Mobile */}
        <div className="md:hidden mt-6 flex justify-end">
            <button className="flex w-full items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-text-main px-6 py-3 rounded-lg font-bold transition-all">
                <Save size={20} />
                Guardar Cambios
            </button>
        </div>
        
        {/* Padding for bottom */}
        <div className="h-10"></div>
    </div>
  );
};

export default Settings;