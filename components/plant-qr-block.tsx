'use client';

import { useEffect, useState } from 'react';
import { QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export function PlantQrBlock({ plantId }: { plantId: string }) {
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const detailUrl = origin ? `${origin}/tanaman/${plantId}` : '';

  if (!detailUrl) return null;

  return (
    <div className="mt-4 flex flex-col items-center rounded-2xl border border-stone-100 bg-white p-6 text-center shadow-sm">
      <div className="mb-1 flex items-center gap-2">
        <QrCode className="h-4 w-4 text-stone-400" />
        <p className="text-sm font-bold text-stone-700">QR Code Tanaman Ini</p>
      </div>
      <p className="mb-4 text-xs text-stone-400">Scan untuk membuka halaman ini</p>
      <div className="rounded-xl border border-stone-100 bg-white p-3 shadow-inner">
        <QRCodeSVG value={detailUrl} size={130} level="M" fgColor="#1c1917" bgColor="#ffffff" />
      </div>
      <p className="mt-3 max-w-xs break-all text-[11px] text-stone-300">{detailUrl}</p>
    </div>
  );
}
