import React, { useEffect, useRef, useState, type ChangeEvent } from 'react';
import QRCodeStyling, { 
  type FileExtension, 
  type Options, 
  type DotType, 
  type CornerSquareType,
  type ErrorCorrectionLevel 
} from 'qr-code-styling';

interface Props {
  url: string;
}

const qrOptions: Options = {
  width: 300, height: 300, type: 'svg', margin: 0,
  image: '',
  dotsOptions: { color: '#000000', type: 'rounded' },
  backgroundOptions: { color: '#ffffff' },
  imageOptions: { crossOrigin: 'anonymous', margin: 10 },
  cornersSquareOptions: { color: '#000000', type: 'extra-rounded' },
  qrOptions: { errorCorrectionLevel: 'L' }
};

export const QRPro: React.FC<Props> = ({ url }) => {
  // Estados de configuración
  const [fileExt, setFileExt] = useState<FileExtension>('png');
  const [dotType, setDotType] = useState<DotType>('rounded');
  const [cornerType, setCornerType] = useState<CornerSquareType>('extra-rounded');
  const [ecLevel, setEcLevel] = useState<ErrorCorrectionLevel>('L'); // ¡Recuperado! Vital para simplicidad
  
  // Estos eran los estados que no se usaban (Ahora sí tienen controles)
  const [margin, setMargin] = useState(0); 
  const [colors, setColors] = useState({ qr: '#000000', bg: '#ffffff' });
  
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);

  const qrCode = useRef<QRCodeStyling>(new QRCodeStyling(qrOptions));
  const ref = useRef<HTMLDivElement>(null);

  // 1. Inicialización
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = '';
      qrCode.current.append(ref.current);
    }
  }, []);

  // 2. Actualización Dinámica
  useEffect(() => {
    if (!qrCode.current) return;
    qrCode.current.update({
      data: url || 'https://example.com',
      margin: margin,
      image: logo,
      dotsOptions: { color: colors.qr, type: dotType },
      backgroundOptions: { color: colors.bg },
      cornersSquareOptions: { color: colors.qr, type: cornerType },
      qrOptions: { errorCorrectionLevel: ecLevel } // Actualiza la densidad
    });
  }, [url, dotType, cornerType, colors, margin, logo, ecLevel]);

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleDownload = async (size: number) => {
    setIsGenerating(true);
    setTimeout(async () => {
      try {
        await qrCode.current.update({ width: size, height: size });
        await qrCode.current.download({ name: `qr-pro-${size}px`, extension: fileExt });
        await qrCode.current.update({ width: 300, height: 300 });
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* --- PANEL DE CONTROLES --- */}
      <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-slate-100 custom-scrollbar">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Configuración Avanzada</h3>
        
        <div className="space-y-6">
            
            {/* 1. COMPLEJIDAD (Vital para tu cliente) */}
            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 space-y-2">
                <label className="text-[10px] uppercase font-bold text-indigo-800 flex justify-between">
                    <span>Densidad (Puntos)</span>
                    <span>{ecLevel}</span>
                </label>
                <div className="flex gap-1">
                    {['L', 'M', 'Q', 'H'].map((lvl) => (
                         <button key={lvl} onClick={() => setEcLevel(lvl as any)} className={`flex-1 py-1 text-xs font-bold rounded ${ecLevel === lvl ? 'bg-indigo-600 text-white shadow' : 'bg-white text-indigo-400 border border-indigo-200'}`}>
                            {lvl}
                         </button>
                    ))}
                </div>
                <p className="text-[10px] text-indigo-400">Usa 'L' para un diseño redondo simple.</p>
            </div>

            {/* 2. LOGO */}
            <div className="flex gap-2">
                <label className="flex-1 cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold py-3 rounded-lg flex justify-center items-center gap-2">
                    <span>{logo ? 'Cambiar Logo' : 'Subir Logo'}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </label>
                {logo && <button onClick={() => setLogo(undefined)} className="bg-red-50 text-red-500 px-3 rounded-lg border border-red-100">✕</button>}
            </div>

            {/* 3. COLORES (CORREGIDO: Ahora se usan) */}
            <div className="flex gap-4">
                <div className='flex-1 space-y-1'>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Color QR</label>
                    <div className="flex items-center gap-2 border p-1 rounded-lg">
                        <input type="color" value={colors.qr} onChange={(e) => setColors({...colors, qr: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"/>
                        <span className="text-xs text-slate-500 font-mono">{colors.qr}</span>
                    </div>
                </div>
                <div className='flex-1 space-y-1'>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Fondo</label>
                    <div className="flex items-center gap-2 border p-1 rounded-lg">
                        <input type="color" value={colors.bg} onChange={(e) => setColors({...colors, bg: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"/>
                        <span className="text-xs text-slate-500 font-mono">{colors.bg}</span>
                    </div>
                </div>
            </div>

            {/* 4. FORMAS (Puntos y Esquinas) */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Puntos</label>
                    <div className="flex flex-col gap-1">
                        {['square', 'rounded', 'dots'].map((t) => (
                            <button key={t} onClick={() => setDotType(t as any)} className={`text-xs py-1.5 border rounded ${dotType === t ? 'bg-black text-white' : 'bg-white text-slate-600'}`}>{t}</button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Esquinas</label>
                    <div className="flex flex-col gap-1">
                        {['square', 'extra-rounded', 'dot'].map((t) => (
                            <button key={t} onClick={() => setCornerType(t as any)} className={`text-xs py-1.5 border rounded ${cornerType === t ? 'bg-black text-white' : 'bg-white text-slate-600'}`}>{t}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 5. MARGEN / PADDING (CORREGIDO: Ahora se usa) */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Margen</span>
                    <span>{margin}px</span>
                </div>
                <input type="range" min="0" max="50" step="5" value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black" />
            </div>

            <hr className="border-slate-100" />

            {/* 6. DESCARGA */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                <div className="flex gap-2">
                    {['png', 'jpeg', 'svg'].map((ext) => (
                        <button key={ext} onClick={() => setFileExt(ext as any)} className={`flex-1 text-xs py-1 rounded border ${fileExt === ext ? 'bg-slate-800 text-white' : 'bg-white'}`}>{ext}</button>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleDownload(1000)} disabled={isGenerating} className="bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-xs font-bold hover:bg-slate-50">HD (1000px)</button>
                    <button onClick={() => handleDownload(2000)} disabled={isGenerating} className="bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-700">4K (2000px)</button>
                </div>
            </div>
        </div>
      </div>

      {/* --- PREVIEW --- */}
      <div className="w-full md:w-1/2 bg-slate-50 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
         <div className="bg-white p-4 shadow-xl border border-slate-200 rounded-xl relative z-10">
            <div ref={ref} className="rounded overflow-hidden [&>svg]:w-full [&>svg]:h-auto max-w-[300px]" />
         </div>
      </div>
    </div>
  );
};