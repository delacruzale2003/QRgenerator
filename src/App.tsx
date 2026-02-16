import { useState } from 'react';
import { QRPro } from './components/QRPro';
import { QRClassic } from './components/QRCodeClassic'; // Asegúrate que el nombre del archivo coincida

// IMPORTAMOS LOS LOGOS OFICIALES
import { FaInstagram, FaWhatsapp, FaGithub } from "react-icons/fa";

function App() {
  const [url, setUrl] = useState<string>('https://promomonsteroxxo.ptm.pe');
  const [activeTab, setActiveTab] = useState<'pro' | 'classic'>('classic');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 md:p-8 font-sans text-slate-800">
      
      {/* --- SECCIÓN 1: TU FIRMA DE DESARROLLADOR (Arriba) --- */}
      <div className="w-full max-w-5xl mb-4 flex flex-col md:flex-row justify-between items-center gap-3 text-sm">
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="font-bold text-slate-700">Dev: Alejandro De La Cruz</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 text-slate-500 font-medium">
            {/* INSTAGRAM */}
            <a 
                href="https://instagram.com/alejandro_hxwl" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-pink-600 transition-colors flex items-center gap-2 group"
            >
                <FaInstagram className="text-lg group-hover:scale-110 transition-transform" />
                <span>@alejandro_hxwl</span>
            </a>

            <span className="hidden md:inline text-slate-300">|</span>

            {/* WHATSAPP */}
            <a 
                href="https://wa.me/51969491079" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-green-600 transition-colors flex items-center gap-2 group"
            >
                <FaWhatsapp className="text-lg group-hover:scale-110 transition-transform" />
                <span>+51 969491079</span>
            </a>

            <span className="hidden md:inline text-slate-300">|</span>

            {/* GITHUB */}
            <a 
                href="https://github.com/delacruzale2003" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-black transition-colors flex items-center gap-2 group"
            >
                <FaGithub className="text-lg group-hover:scale-110 transition-transform" />
                <span>GitHub</span>
            </a>
        </div>
      </div>

      {/* --- SECCIÓN 2: LA APP PRINCIPAL --- */}
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 h-[85vh] md:h-[800px] relative">
        
        {/* BANNER DE ADVERTENCIA */}
        <div className="bg-yellow-400 text-yellow-900 py-2 px-4 text-center shadow-sm z-30 select-none">
            <h1 className="text-xs md:text-sm font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2">
                ⚠ CAMPAÑA MONSTER OXXO • APP DE TEST DE PRUEBA • PROHIBIDO SU USO EXTERNO ⚠
            </h1>
        </div>

        {/* HEADER & GLOBAL CONTROLS */}
        <div className="p-6 border-b border-slate-100 bg-white z-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                        QR Generator <span className="text-indigo-600">Ultimate</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">Herramienta interna v1.0.2</p>
                </div>
                
                {/* TABS DE NAVEGACIÓN */}
                <div className="bg-slate-100 p-1 rounded-xl flex gap-1 self-start md:self-auto">
                    <button 
                        onClick={() => setActiveTab('classic')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'classic' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Clásico (Simple)
                    </button>
                    <button 
                        onClick={() => setActiveTab('pro')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'pro' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Pro (Diseño)
                    </button>
                </div>
            </div>

            {/* INPUT URL GLOBAL */}
            <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">URL Destino (Campaña)</label>
                <div className="relative">
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://tu-sitio.com"
                        className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium font-mono text-sm"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        🔒
                    </div>
                </div>
            </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] -rotate-12 select-none z-0">
                <span className="text-6xl font-black uppercase text-black">Borrador</span>
            </div>

            <div className="relative z-10 h-full">
                {activeTab === 'pro' ? (
                    <QRPro url={url} />
                ) : (
                    <QRClassic url={url} />
                )}
            </div>
        </div>

      </div>
      
      <div className="fixed bottom-4 text-[10px] text-slate-400 opacity-50">
        © 2026 Alejandro De La Cruz. Todos los derechos reservados.
      </div>
    </div>
  )
}

export default App