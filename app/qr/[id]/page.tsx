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
import { AdminShell } from '@/components/admin-shell';
import {
  PRINT_SIZES,
  QrPrintLabel,
  downloadQrLabelPng,
  type PrintSize,
} from '@/components/qr-print-label';
import { usePlants } from '@/lib/plant-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function QRPage() {
  const { getPlant } = usePlants();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState('');
  const [printSize, setPrintSize] = useState<PrintSize>('a6');
  const [downloading, setDownloading] = useState(false);

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

  const handleDownload = async () => {
    const svg = printRef.current?.querySelector('svg');
    if (!svg) return;
    setDownloading(true);
    try {
      await downloadQrLabelPng({
        svg,
        title: plant.name,
        subtitle: plant.type,
        location: plant.lokasi_bedeng,
        url: detailUrl,
        filename: `qr-${plant.name.replace(/\s+/g, '-').toLowerCase()}.png`,
        size: printSize,
      });
      toast({
        title: 'QR code diunduh',
        description: 'Kartu QR siap cetak telah disimpan.',
      });
    } catch {
      toast({
        title: 'Gagal mengunduh',
        description: 'Terjadi kesalahan saat membuat file PNG.',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
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

      <div className="print:hidden mb-5 flex items-center gap-3 rounded-md border border-success/20 bg-success/10 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-success/15 text-success">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <div>
          <p className="text-base font-bold text-success">
            QR Code Berhasil Dibuat!
          </p>
          <p className="text-sm text-muted-foreground">
            Pilih ukuran label, lalu unduh atau cetak dan tempelkan di dekat tanaman.
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start print:block">
        <div ref={printRef} className="qr-print-stage">
          <QrPrintLabel
            qrValue={detailUrl}
            title={plant.name}
            subtitle={plant.type}
            location={plant.lokasi_bedeng}
            size={printSize}
          />
        </div>

        <div className="print:hidden flex flex-col gap-4">
          <Card className="border border-border p-5">
            <h3 className="text-base font-bold">Ukuran cetak</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Pilih ukuran label sesuai kertas atau tempat menempel.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {PRINT_SIZES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPrintSize(item.id)}
                  className={cn(
                    'rounded-xl border px-2 py-2.5 text-center transition',
                    printSize === item.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                      : 'border-border bg-white text-stone-600 hover:border-emerald-300',
                  )}
                >
                  <span className="block text-sm font-bold">{item.label}</span>
                  <span className="mt-0.5 block text-[11px] opacity-70">{item.hint}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="border border-border p-5">
            <h3 className="text-base font-bold">Unduh atau Cetak</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Simpan sebagai PNG atau cetak langsung. Hanya label yang tercetak.
            </p>
            <div className="mt-4 space-y-2.5">
              <Button
                className="h-12 w-full text-base"
                onClick={handleDownload}
                disabled={downloading}
              >
                <Download className="mr-2 h-5 w-5" />
                {downloading ? 'Menyiapkan…' : 'Unduh QR Code (PNG)'}
              </Button>
              <Button
                variant="secondary"
                className="h-12 w-full text-base"
                onClick={() => window.print()}
              >
                <Printer className="mr-2 h-5 w-5" />
                Cetak Label
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
