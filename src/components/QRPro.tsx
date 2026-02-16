import React, { useEffect, useRef, useState, type ChangeEvent } from 'react';
import QRCodeStyling, { 
  type FileExtension, 
  type Options, 
  type DotType, 
  type CornerSquareType 
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
  cornersSquareOptions: { color: '#000000', type: 'extra-rounded' }
};

export const QRPro: React.FC<Props> = ({ url }) => {
  const [fileExt, setFileExt] = useState<FileExtension>('png');
  const [dotType, setDotType] = useState<DotType>('rounded');
  const [cornerType, setCornerType] = useState<CornerSquareType>('extra-rounded');
  const [margin, setMargin] = useState(0);
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [colors, setColors] = useState({ qr: '#000000', bg: '#ffffff' });
  const [isGenerating, setIsGenerating] = useState(false);

  const qrCode = useRef<QRCodeStyling>(new QRCodeStyling(qrOptions));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = '';
      qrCode.current.append(ref.current);
    }
  }, []);

  useEffect(() => {
    if (!qrCode.current) return;
    qrCode.current.update({
      data: url || 'https://example.com',
      margin: margin,
      image: logo,
      dotsOptions: { color: colors.qr, type: dotType },
      backgroundOptions: { color: colors.bg },
      cornersSquareOptions: { color: colors.qr, type: cornerType }
    });
  }, [url, dotType, cornerType, colors, margin, logo]);

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
      {/* Controles Pro */}
      <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-slate-100 custom-scrollbar">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Configuración Avanzada</h3>
        
        <div className="space-y-6">
            <div className="flex gap-2">
                <label className="flex-1 cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold py-3 rounded-lg flex justify-center items-center gap-2">
                    <span>{logo ? 'Cambiar Logo' : 'Subir Logo'}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </label>
                {logo && <button onClick={() => setLogo(undefined)} className="bg-red-50 text-red-500 px-3 rounded-lg border border-red-100">✕</button>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Puntos</label>
                    <div className="flex flex-col gap-1">
                        {['square', 'rounded', 'dots'].map((t) => (
                            <button key={t} onClick={() => setDotType(t as any)} className={`text-xs py-1.5 border rounded ${dotType === t ? 'bg-black text-white' : 'bg-white'}`}>{t}</button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Esquinas</label>
                    <div className="flex flex-col gap-1">
                        {['square', 'extra-rounded', 'dot'].map((t) => (
                            <button key={t} onClick={() => setCornerType(t as any)} className={`text-xs py-1.5 border rounded ${cornerType === t ? 'bg-black text-white' : 'bg-white'}`}>{t}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Download Section */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <label className="text-xs font-bold text-slate-500 block mb-2">Descarga</label>
                <div className="flex gap-2 mb-3">
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

      {/* Preview Pro */}
      <div className="w-full md:w-1/2 bg-slate-50 flex items-center justify-center p-8 relative">
         <div className="bg-white p-4 shadow-xl border border-slate-200 rounded-xl">
            <div ref={ref} className="rounded overflow-hidden [&>svg]:w-full [&>svg]:h-auto max-w-[300px]" />
         </div>
      </div>
    </div>
  );
};