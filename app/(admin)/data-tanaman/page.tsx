'use client';

import { useRouter } from 'next/navigation';
import {
  CalendarClock,
  Leaf,
  Pencil,
  Plus,
  QrCode,
  Search,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
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
import { AdminShell } from '@/components/admin-shell';
import { usePlants } from '@/lib/plant-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatTanggal, hariMenujuPanen } from '@/lib/format';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { PlantPreviewSheet } from '@/components/plant-preview-sheet';
import type { Plant } from '@/lib/types';

const STATUS_FILTER = ['Semua', 'Buah', 'Sayur'] as const;
type FilterType = (typeof STATUS_FILTER)[number];

export default function DataTanamanPage() {
  const { plants, deletePlant, isLoading } = usePlants();
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('Semua');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  const filtered = plants.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'Semua' || p.type === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = async (id: string, name: string) => {
    try {
      await deletePlant(id);
      toast({ title: 'Tanaman dihapus', description: `"${name}" telah dihapus dari daftar.` });
    } catch (error: any) {
      toast({ title: 'Gagal menghapus', description: error.message || 'Terjadi kesalahan.', variant: 'destructive' });
    }
  };

  return (
    <AdminShell>
      {/* ── HEADER ──────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Data Tanaman</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {plants.length} tanaman terdaftar di Kebun Seroja
          </p>
        </div>
        <Button
          className="h-10 shrink-0 rounded-full px-4"
          onClick={() => router.push('/tambah-tanaman')}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Tambah Tanaman
        </Button>
      </div>

      {/* ── SEARCH & FILTER ─────────────────────────── */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama tanaman..."
            className="h-10 rounded-xl pl-10"
          />
        </div>
        <div className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 p-1">
          <SlidersHorizontal className="ml-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          {STATUS_FILTER.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── LIST ────────────────────────────────────── */}
      <div className="mt-4 space-y-2.5">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl border border-border bg-muted/30" />
          ))
        ) : filtered.map((plant) => {
          const days = hariMenujuPanen(plant.estimated_harvest_date);
          const nearing = days >= 0 && days <= 7;
          const overdue = days < 0;

          return (
            <div
              key={plant.id}
              className="group flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md sm:flex-row sm:items-center"
            >
              {/* Foto — klik buka preview */}
              <button
                onClick={() => setSelectedPlant(plant)}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl"
              >
                <img
                  src={plant.photo_url || 'https://via.placeholder.com/150'}
                  alt={plant.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {nearing && <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-amber-400 shadow" />}
                {overdue && <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500 shadow" />}
              </button>

              {/* Info — klik buka preview */}
              <button
                onClick={() => setSelectedPlant(plant)}
                className="min-w-0 flex-1 text-left"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-bold group-hover:text-primary transition-colors">{plant.name}</h2>
                  <Badge className="rounded-lg bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">
                    {plant.type}
                  </Badge>
                  {nearing && (
                    <Badge className="rounded-lg bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 hover:bg-amber-100">
                      🌾 Siap Panen
                    </Badge>
                  )}
                  {overdue && (
                    <Badge className="rounded-lg bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700 hover:bg-rose-100">
                      ⚠️ Lewat Panen
                    </Badge>
                  )}
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarClock className="h-3.5 w-3.5" />
                  Panen: {formatTanggal(plant.estimated_harvest_date)}
                  {plant.lokasi_bedeng && (
                    <span className="ml-2 text-muted-foreground/70">· {plant.lokasi_bedeng}</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-muted-foreground/60 group-hover:text-primary/60 transition-colors">
                  Klik untuk pratinjau →
                </p>
              </button>

              {/* Actions */}
              <div className="flex shrink-0 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-9 rounded-xl px-3 text-xs"
                  onClick={() => router.push(`/edit-tanaman/${plant.id}`)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="ml-1.5 hidden sm:inline">Ubah</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-9 rounded-xl px-3 text-xs"
                  onClick={() => router.push(`/qr/${plant.id}`)}
                >
                  <QrCode className="h-3.5 w-3.5" />
                  <span className="ml-1.5 hidden sm:inline">QR</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 rounded-xl px-3 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus tanaman ini?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Data <strong>"{plant.name}"</strong> akan dihapus secara permanen dari database. Tindakan ini tidak bisa dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
                      <AlertDialogAction
                        className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => handleDelete(plant.id, plant.name)}
                      >
                        Ya, Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          );
        })}

        {/* Empty states */}
        {!isLoading && filtered.length === 0 && plants.length > 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Search className="h-7 w-7" />
            </div>
            <p className="mt-3 font-semibold text-muted-foreground">Tidak ditemukan</p>
            <p className="mt-1 text-sm text-muted-foreground/70">Tidak ada tanaman yang cocok dengan "{search}"</p>
          </div>
        )}

        {!isLoading && plants.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Leaf className="h-7 w-7" />
            </div>
            <p className="mt-3 font-semibold text-muted-foreground">Belum ada tanaman</p>
            <p className="mt-1 text-sm text-muted-foreground/70">Mulai dengan mendaftarkan tanaman pertama</p>
            <Button size="sm" className="mt-5 h-9 rounded-xl px-5" onClick={() => router.push('/tambah-tanaman')}>
              <Plus className="mr-1.5 h-4 w-4" />
              Tambah Tanaman
            </Button>
          </div>
        )}
      </div>

      {/* ── PREVIEW SHEET ───────────────────────────── */}
      <PlantPreviewSheet
        plant={selectedPlant}
        onClose={() => setSelectedPlant(null)}
      />
    </AdminShell>
  );
}
