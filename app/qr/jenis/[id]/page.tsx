'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, Download, Printer } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  PRINT_SIZES,
  QrPrintLabel,
  downloadQrLabelPng,
  type PrintSize,
} from '@/components/qr-print-label';
import { cn } from '@/lib/utils';

export default function QRJenisPage({ params }: { params: { id: string } }) {
  const [species, setSpecies] = useState<any>(null);
  const [origin, setOrigin] = useState('');
  const [printSize, setPrintSize] = useState<PrintSize>('a6');
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
    fetch(`/api/species/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSpecies(data.data);
      });
  }, [params.id]);

  const qrValue = species ? `${origin}/tanaman?jenis=${species.id}` : '';

  const handleDownload = async () => {
    if (!cardRef.current || !species) return;
    const svg = cardRef.current.querySelector('svg');
    if (!svg) {
      alert('QR Code tidak ditemukan untuk diunduh.');
      return;
    }

    setDownloading(true);
    try {
      await downloadQrLabelPng({
        svg,
        title: species.name,
        subtitle: species.category,
        url: qrValue,
        filename: `QR-Jenis-${species.name.replace(/\s+/g, '-')}.png`,
        size: printSize,
      });
    } finally {
      setDownloading(false);
    }
  };

  if (!species) {
    return <div className="p-8 text-center text-green-700">Memuat...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f9f5] p-6 print:bg-white print:p-0">
      <div className="mx-auto max-w-3xl">
        <div className="print:hidden mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/jenis-tanaman"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-green-700"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Kembali
          </Link>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="rounded-full bg-white text-green-700 hover:bg-green-50"
              onClick={() => window.print()}
            >
              <Printer className="mr-2 h-4 w-4" /> Cetak
            </Button>
            <Button
              className="rounded-full bg-green-600 hover:bg-green-700"
              onClick={handleDownload}
              disabled={downloading}
            >
              <Download className="mr-2 h-4 w-4" />
              {downloading ? 'Menyiapkan…' : 'Unduh Label'}
            </Button>
          </div>
        </div>

        <div className="print:hidden mb-6 grid grid-cols-3 gap-2">
          {PRINT_SIZES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPrintSize(item.id)}
              className={cn(
                'rounded-xl border px-2 py-2.5 text-center transition',
                printSize === item.id
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-emerald-300',
              )}
            >
              <span className="block text-sm font-bold">{item.label}</span>
              <span className="mt-0.5 block text-[11px] opacity-70">{item.hint}</span>
            </button>
          ))}
        </div>

        <div ref={cardRef} className="qr-print-stage">
          <QrPrintLabel
            qrValue={qrValue}
            title={species.name}
            subtitle={species.category}
            size={printSize}
          />
        </div>
      </div>
    </div>
  );
}
