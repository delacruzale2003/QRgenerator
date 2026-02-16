import React, { useRef, useState, type ChangeEvent } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface Props {
  url: string;
}

export const QRClassic: React.FC<Props> = ({ url }) => {
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('L');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [padding, setPadding] = useState(20); // Nuevo estado para Padding
  const [logo, setLogo] = useState<string>(''); // Nuevo estado para Logo
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lógica para manejar la subida del logo
  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Lógica avanzada de descarga con Padding
  const downloadQR = () => {
    const sourceCanvas = canvasRef.current;
    if (!sourceCanvas) return;

    // 1. Crear un canvas temporal más grande para incluir el padding
    const newCanvas = document.createElement('canvas');
    const ctx = newCanvas.getContext('2d');
    
    if (ctx) {
        // El tamaño final será el del QR + el doble del padding (izquierda/derecha y arriba/abajo)
        newCanvas.width = sourceCanvas.width + (padding * 2);
        newCanvas.height = sourceCanvas.height + (padding * 2);

        // 2. Pintar el fondo del color seleccionado
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

        // 3. Dibujar el QR original en el centro
        ctx.drawImage(sourceCanvas, padding, padding);

        // 4. Descargar
        const image = newCanvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "qr-classic-padded.png";
        link.click();
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Controles */}
      <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-slate-100 custom-scrollbar">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Configuración Clásica</h3>
        
        <div className="space-y-6">
          
          {/* Nivel de Corrección */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500">Densidad (Complejidad)</label>
            <div className="grid grid-cols-4 gap-2">
              {['L', 'M', 'Q', 'H'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l as any)}
                  className={`py-2 text-xs font-bold rounded border ${
                    level === l ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'
                  }`}
                >
                  {l === 'L' ? 'Baja' : l === 'M' ? 'Media' : l === 'Q' ? 'Alta' : 'Max'}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400">
              * Usa 'Baja' para que el QR sea más simple y fácil de leer.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Imagen / Logo */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500">Logo Central (Opcional)</label>
            <div className="flex gap-2">
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 px-4 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                    {logo ? 'Cambiar Imagen' : 'Subir Imagen'}
                </button>
                {logo && (
                    <button onClick={() => setLogo('')} className="px-3 bg-red-50 text-red-500 border border-red-100 rounded-lg">✕</button>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Colores */}
          <div className="flex gap-4">
             <div className="flex-1 space-y-2">
                <label className="text-xs font-semibold text-slate-500">Color QR</label>
                <div className="flex items-center gap-2 border p-2 rounded bg-white">
                    <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none bg-transparent" />
                    <span className="text-xs text-slate-500 font-mono">{fgColor}</span>
                </div>
             </div>
             <div className="flex-1 space-y-2">
                <label className="text-xs font-semibold text-slate-500">Fondo</label>
                <div className="flex items-center gap-2 border p-2 rounded bg-white">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none bg-transparent" />
                    <span className="text-xs text-slate-500 font-mono">{bgColor}</span>
                </div>
             </div>
          </div>

          {/* Slider de Padding (Nuevo) */}
          <div className="space-y-2">
            <div className="flex justify-between">
                <label className="text-xs font-semibold text-slate-500">Margen (Padding)</label>
                <span className="text-xs text-slate-400">{padding}px</span>
            </div>
            <input 
                type="range" 
                min="0" 
                max="50" 
                step="5"
                value={padding} 
                onChange={(e) => setPadding(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black" 
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg">
            <p className="text-[10px] text-yellow-700">
                <strong>Nota:</strong> Este modo "Clásico" solo genera puntos cuadrados. Si deseas puntos redondos, cambia a la pestaña <strong>Pro</strong>.
            </p>
          </div>

          <button 
            onClick={downloadQR}
            className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2"
          >
            <span>Descargar PNG</span>
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="w-full md:w-1/2 bg-slate-50 flex items-center justify-center p-8 relative overflow-hidden">
          {/* Fondo decorativo sutil */}
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

          <div className="relative z-10 flex flex-col items-center gap-4">
              <div 
                className="bg-white shadow-xl border border-slate-200 transition-all duration-300"
                style={{ padding: `${padding}px`, backgroundColor: bgColor }} // Aplicamos el padding visualmente aquí
              >
                <QRCodeCanvas
                    ref={canvasRef}
                    value={url || 'https://example.com'}
                    size={280} // Tamaño fijo para la preview
                    bgColor={bgColor}
                    fgColor={fgColor}
                    level={level}
                    includeMargin={false} // Desactivamos el margen nativo para usar nuestro padding custom
                    imageSettings={logo ? {
                        src: logo,
                        height: 50,
                        width: 50,
                        excavate: true, // "Excava" los puntos para que no tapen el logo
                    } : undefined}
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Vista Previa Real</p>
          </div>
      </div>
    </div>
  );
};