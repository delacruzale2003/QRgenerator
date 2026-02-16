import { useState } from 'react';
import { QRPro } from './components/QRPro';
import { QRClassic } from './components/QRCodeClassic';

function App() {
  const [url, setUrl] = useState<string>('https://promomonsteroxxo.ptm.pe');
  const [activeTab, setActiveTab] = useState<'pro' | 'classic'>('classic'); // Empezamos en Classic por lo que dijo tu cliente

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-8 font-sans text-slate-800">
      
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 h-[85vh] md:h-[800px]">
        
        {/* HEADER & GLOBAL CONTROLS */}
        <div className="p-6 border-b border-slate-100 bg-white z-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    QR Generator <span className="text-indigo-600">Ultimate</span>
                </h1>
                
                {/* TABS DE NAVEGACIÓN */}
                <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
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
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">URL Destino</label>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://tu-sitio.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium"
                />
            </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-hidden">
            {activeTab === 'pro' ? (
                <QRPro url={url} />
            ) : (
                <QRClassic url={url} />
            )}
        </div>

      </div>
      
      <div className="fixed bottom-4 text-xs text-slate-400">
        Hecho con React + Vite
      </div>
    </div>
  )
}

export default App