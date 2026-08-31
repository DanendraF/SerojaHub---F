'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  Leaf,
  List,
  Plus,
  Printer,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { AdminShell } from '@/components/admin-shell';
import { usePlants } from '@/lib/plant-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function QRPage() {
  const { getPlant } = usePlants();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const plant = getPlant(params.id);

  if (!plant) {
    return (
      <AdminShell>
        <div className="py-20 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <Leaf className="h-8 w-8" />
          </span>
          <h1 className="mt-4 text-2xl font-bold">Tanaman tidak ditemukan</h1>
          <Button
            className="mt-6 h-14 px-8 text-lg"
            onClick={() => router.push('/data-tanaman')}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Kembali
          </Button>
        </div>
      </AdminShell>
    );
  }

  const detailUrl = `${origin}/tanaman/${plant.id}`;

  const handleDownload = () => {
    const svg = printRef.current?.querySelector('.my-5 svg');
    if (!svg) return;

    const svgClone = svg.cloneNode(true) as SVGElement;
    svgClone.setAttribute('width', '400');
    svgClone.setAttribute('height', '400');

    const svgData = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 550;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // 1. Background putih
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 550);

      // 2. Border hijau emerald
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 10;
      ctx.strokeRect(5, 5, 390, 540);

      // 3. Header Text
      ctx.fillStyle = '#065f46';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('KEBUN SEROJA', 200, 55);

      // 4. Subtitle
      ctx.fillStyle = '#78716c';
      ctx.font = '13px sans-serif';
      ctx.fillText('Scan QR code untuk info tanaman', 200, 80);

      // 5. Divider Atas
      ctx.strokeStyle = '#e7e5e4';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, 95);
      ctx.lineTo(360, 95);
      ctx.stroke();

      // 6. Draw QR Code
      ctx.drawImage(img, 80, 115, 240, 240);

      // 7. Divider Bawah
      ctx.strokeStyle = '#e7e5e4';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, 380);
      ctx.lineTo(360, 380);
      ctx.stroke();

      // 8. Nama Tanaman
      ctx.fillStyle = '#1c1917';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(plant.name.toUpperCase(), 200, 420);

      // 9. Jenis Tanaman
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(plant.type, 200, 450);

      // 10. Lokasi Bedeng
      if (plant.lokasi_bedeng) {
        ctx.fillStyle = '#78716c';
        ctx.font = '13px sans-serif';
        ctx.fillText('📍 ' + plant.lokasi_bedeng, 200, 480);
      }

      // 11. Footer URL
      ctx.fillStyle = '#a8a29e';
      ctx.font = '9px sans-serif';
      ctx.fillText(detailUrl, 200, 520);

      URL.revokeObjectURL(svgUrl);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement('a');
        link.download = `qr-${plant.name.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);

        toast({
          title: 'QR code diunduh',
          description: 'Kartu QR siap cetak telah disimpan.',
        });
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      toast({
        title: 'Gagal mengunduh',
        description: 'Terjadi kesalahan saat membuat file PNG.',
        variant: 'destructive',
      });
    };
    img.src = svgUrl;
  };

  return (
    <AdminShell>
      <div className="print:hidden">
        <Button
          variant="ghost"
          className="mb-6 h-12 px-4 text-base text-muted-foreground hover:text-primary"
          onClick={() => router.push('/data-tanaman')}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Kembali ke Data Tanaman
        </Button>
      </div>

      {/* Success banner */}
      <div className="print:hidden mb-5 flex items-center gap-3 rounded-md border border-success/20 bg-success/10 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-success/15 text-success">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <div>
          <p className="text-base font-bold text-success">
            QR Code Berhasil Dibuat!
          </p>
          <p className="text-sm text-muted-foreground">
            Unduh atau cetak QR code ini dan tempelkan di dekat tanaman.
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* QR card (printable) */}
        <div ref={printRef}>
          <Card className="border border-border p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Leaf className="h-6 w-6" />
            </div>
            <h1 className="mt-3 text-xl font-bold text-primary">
              Kebun Seroja
            </h1>
            <p className="text-sm text-muted-foreground">
              Scan QR code untuk info tanaman
            </p>

            <div className="my-5 flex justify-center rounded-md border border-border bg-card p-5">
              <QRCodeSVG
                value={detailUrl}
                size={200}
                level="M"
                fgColor="hsl(30 15% 15%)"
                bgColor="hsl(0 0% 100%)"
              />
            </div>

            <h2 className="text-lg font-bold">{plant.name}</h2>
            <p className="text-sm text-muted-foreground">{plant.type}</p>
            <p className="mt-1.5 break-all text-xs text-muted-foreground">
              {detailUrl}
            </p>
          </Card>
        </div>

        {/* Actions sidebar */}
        <div className="print:hidden flex flex-col gap-4">
          <Card className="border border-border p-5">
            <h3 className="text-base font-bold">Unduh atau Cetak</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Simpan QR code sebagai gambar PNG atau cetak langsung.
            </p>
            <div className="mt-4 space-y-2.5">
              <Button
                className="h-12 w-full text-base"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-5 w-5" />
                Unduh QR Code (PNG)
              </Button>
              <Button
                variant="secondary"
                className="h-12 w-full text-base"
                onClick={() => window.print()}
              >
                <Printer className="mr-2 h-5 w-5" />
                Cetak
              </Button>
            </div>
          </Card>

          <Card className="border border-border p-5">
            <h3 className="text-base font-bold">Langkah Berikutnya</h3>
            <div className="mt-3 space-y-1">
              <Button
                variant="ghost"
                className="h-11 w-full justify-start text-base"
                onClick={() => router.push('/data-tanaman')}
              >
                <List className="mr-2.5 h-5 w-5 text-muted-foreground" />
                Lihat semua tanaman
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="h-11 w-full justify-start text-base"
                onClick={() => router.push('/tambah-tanaman')}
              >
                <Plus className="mr-2.5 h-5 w-5 text-muted-foreground" />
                Tambah tanaman lain
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
