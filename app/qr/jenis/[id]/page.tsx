'use client';

import { useEffect, useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ChevronLeft, Download, Printer } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function QRJenisPage({ params }: { params: { id: string } }) {
  const [species, setSpecies] = useState<any>(null);
  const [origin, setOrigin] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    fetch(`/api/species/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSpecies(data.data);
      });
  }, [params.id]);

  const handleDownload = () => {
    if (!cardRef.current || !species) return;

    const svg = cardRef.current.querySelector('.qr-wrapper svg');
    if (!svg) {
      alert('QR Code tidak ditemukan untuk diunduh.');
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 550;

    // Draw card background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#f0fdf4';
    ctx.fillRect(0, 0, canvas.width, 100);
    ctx.fillStyle = '#166534';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('KEBUN SEROJA', canvas.width / 2, 45);
    ctx.font = '16px Arial';
    ctx.fillStyle = '#15803d';
    ctx.fillText('Pindai untuk info lengkap', canvas.width / 2, 75);

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 75, 130, 250, 250);
      
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 28px Arial';
      ctx.fillText(species.name.toUpperCase(), canvas.width / 2, 440);
      
      ctx.fillStyle = '#6b7280';
      ctx.font = '18px Arial';
      ctx.fillText(species.category, canvas.width / 2, 470);
      
      const link = document.createElement('a');
      link.download = `QR-Jenis-${species.name.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (!species) return <div className="p-8 text-center text-green-700">Memuat...</div>;

  const qrValue = `${origin}/jenis/${species.id}`;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/jenis-tanaman" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-green-700">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Kembali
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full bg-white text-green-700 hover:bg-green-50" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-2" /> Cetak
            </Button>
            <Button className="rounded-full bg-green-600 hover:bg-green-700" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" /> Unduh Label
            </Button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[500px]" ref={cardRef}>
          <div className="text-center w-full bg-green-50 rounded-2xl py-6 mb-8 border border-green-100">
            <h2 className="text-2xl font-black text-green-900 tracking-wider">KEBUN SEROJA</h2>
            <p className="text-green-700 font-medium mt-1">Pindai untuk info lengkap</p>
          </div>
          
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 qr-wrapper mb-8">
            <QRCodeSVG value={qrValue} size={220} level="H" includeMargin={false} />
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-2">
              {species.name}
            </h1>
            <span className="inline-block px-4 py-1 bg-gray-100 text-gray-600 font-medium rounded-full text-lg">
              {species.category}
            </span>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .max-w-xl, .max-w-xl * { visibility: visible; }
          .max-w-xl { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; }
          .flex.items-center.justify-between.mb-8 { display: none !important; }
        }
      `}} />
    </div>
  );
}