'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CalendarDays,
  ExternalLink,
  Leaf,
  MapPin,
  Pencil,
  QrCode,
  Trash2,
  X,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePlants } from '@/lib/plant-context';
import { useToast } from '@/hooks/use-toast';
import { formatTanggal, hariMenujuPanen } from '@/lib/format';
import type { Plant } from '@/lib/types';

type PlantPreviewSheetProps = {
  plant: Plant | null;
  onClose: () => void;
};

const STATUS_MAP = {
  TUMBUH:     { label: 'Tumbuh',      class: 'bg-emerald-100 text-emerald-700' },
  SIAP_PANEN: { label: 'Siap Panen',  class: 'bg-amber-100 text-amber-700' },
  PANEN:      { label: 'Panen',       class: 'bg-blue-100 text-blue-700' },
  SELESAI:    { label: 'Selesai',     class: 'bg-stone-100 text-stone-600' },
};

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm text-foreground leading-relaxed whitespace-pre-wrap">{value}</p>
    </div>
  );
}

export function PlantPreviewSheet({ plant, onClose }: PlantPreviewSheetProps) {
  const router = useRouter();
  const { deletePlant } = usePlants();
  const { toast } = useToast();

  if (!plant) return null;

  const days = hariMenujuPanen(plant.estimated_harvest_date);
  const nearing = days >= 0 && days <= 7;
  const overdue = days < 0;
  const status = STATUS_MAP[plant.status] ?? STATUS_MAP['TUMBUH'];
  const dayLabel = days < 0
    ? `${Math.abs(days)} hari lalu`
    : days === 0 ? 'Hari ini'
    : `${days} hari lagi`;

  const handleDelete = async () => {
    try {
      await deletePlant(plant.id);
      toast({ title: 'Tanaman dihapus', description: `"${plant.name}" telah dihapus.` });
      onClose();
    } catch (e: any) {
      toast({ title: 'Gagal menghapus', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <Sheet open={!!plant} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md overflow-hidden"
      >
        {/* â”€â”€ FOTO HEADER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="relative h-52 shrink-0 overflow-hidden">
          <img
            src={plant.photo_url || 'https://via.placeholder.com/400x300?text=ðŸŒ¿'}
            alt={plant.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Close btn */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Status badges */}
          <div className="absolute bottom-3 left-4 flex gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${status.class}`}>
              {status.label}
            </span>
            {nearing && (
              <span className="rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-white">
                ðŸŒ¾ Siap Panen
              </span>
            )}
            {overdue && (
              <span className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white">
                âš ï¸ Lewat Panen
              </span>
            )}
          </div>
        </div>

        {/* â”€â”€ CONTENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="flex-1 overflow-y-auto">
          {/* Nama & jenis */}
          <div className="border-b border-border px-5 py-4">
            <SheetHeader>
              <SheetTitle className="text-left text-xl">{plant.name}</SheetTitle>
            </SheetHeader>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge className="rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                {plant.type === 'Buah' ? 'ðŸŽ' : 'ðŸ¥¬'} {plant.type}
              </Badge>
              {plant.lokasi_bedeng && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {plant.lokasi_bedeng}
                </span>
              )}
            </div>
          </div>

          {/* Jadwal */}
          <div className="border-b border-border px-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tanggal Tanam</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium">
                  <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                  {formatTanggal(plant.planting_date)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Perkiraan Panen</p>
                <p className={`mt-1 flex items-center gap-1.5 text-sm font-medium ${nearing ? 'text-amber-600' : overdue ? 'text-rose-600' : ''}`}>
                  <CalendarDays className="h-3.5 w-3.5" />
                  {dayLabel}
                </p>
                <p className="text-xs text-muted-foreground">{formatTanggal(plant.estimated_harvest_date)}</p>
              </div>
            </div>
          </div>

          {/* Detail info */}
          <div className="space-y-4 px-5 py-4">
            <InfoRow label="Deskripsi" value={plant.description} />
            <InfoRow label="Manfaat" value={plant.manfaat} />
            <InfoRow label="Cara Tanam" value={plant.cara_tanam} />
            <InfoRow label="Catatan Pengelola" value={plant.catatan_pengelola} />
            {!plant.description && !plant.manfaat && !plant.cara_tanam && !plant.catatan_pengelola && (
              <div className="flex flex-col items-center py-6 text-center">
                <Leaf className="h-8 w-8 text-muted-foreground/40" />
                <p className="mt-2 text-sm text-muted-foreground">Belum ada informasi detail</p>
              </div>
            )}
          </div>
        </div>

        {/* â”€â”€ ACTION FOOTER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="shrink-0 border-t border-border bg-card p-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              className="h-10 rounded-xl text-sm"
              onClick={() => router.push(`/edit-tanaman/${plant.id}`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Link href={`/qr/jenis/${plant.speciesId}`} className="w-full">
              <Button
                variant="secondary"
                className="w-full h-10 rounded-xl text-sm"
              >
                <QrCode className="mr-2 h-4 w-4" />
                QR Code
              </Button>
            </Link>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="h-10 rounded-xl text-sm"
              onClick={() => window.open(`/tanaman/${plant.id}`, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Lihat Publik
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 rounded-xl text-sm text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus tanaman ini?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Data <strong>"{plant.name}"</strong> akan dihapus permanen dari database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
                  <AlertDialogAction
                    className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleDelete}
                  >
                    Ya, Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
