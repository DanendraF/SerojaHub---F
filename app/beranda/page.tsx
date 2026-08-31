'use client';

import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Leaf,
  List,
  Plus,
  Sprout,
  TrendingUp,
} from 'lucide-react';
import { AdminShell } from '@/components/admin-shell';
import { usePlants } from '@/lib/plant-context';
import { Button } from '@/components/ui/button';
import { formatTanggal, hariMenujuPanen } from '@/lib/format';
import type { Plant } from '@/lib/types';

function getPlantStatus(p: Plant): { status: 'harvest' | 'growing' | 'overdue'; days: number } {
  const days = hariMenujuPanen(p.estimated_harvest_date);
  if (days < 0) return { status: 'overdue', days };
  if (days <= 7) return { status: 'harvest', days };
  return { status: 'growing', days };
}

const statusConfig = {
  harvest: { dot: 'bg-amber-400', badge: 'bg-amber-100 text-amber-700', label: 'Siap Panen' },
  growing: { dot: 'bg-emerald-400', badge: 'bg-emerald-100 text-emerald-700', label: 'Tumbuh' },
  overdue: { dot: 'bg-rose-400', badge: 'bg-rose-100 text-rose-700', label: 'Lewat Panen' },
} as const;

export default function BerandaPage() {
  const { plants } = usePlants();
  const router = useRouter();

  const total = plants.length;
  const plantStatuses = plants.map((p) => ({ plant: p, ...getPlantStatus(p) }));
  const nearingHarvest = plantStatuses.filter((s) => s.status === 'harvest');
  const growing = plantStatuses.filter((s) => s.status === 'growing');
  const overdue = plantStatuses.filter((s) => s.status === 'overdue');
  const recentPlants = [...plants]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  const stats = [
    { label: 'Total Tanaman', value: total, icon: Sprout, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Siap Panen', value: nearingHarvest.length, icon: CalendarClock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Masih Tumbuh', value: growing.length, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Lewat Panen', value: overdue.length, icon: CheckCircle2, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  ];

  const now = new Date();
  const greeting = now.getHours() < 11 ? 'Selamat Pagi' : now.getHours() < 15 ? 'Selamat Siang' : now.getHours() < 18 ? 'Selamat Sore' : 'Selamat Malam';

  return (
    <AdminShell>
      {/* ── GREETING HEADER ─────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 p-6 text-white shadow-lg">
        <div className="relative z-10">
          <p className="text-sm font-medium text-emerald-100">👋 {greeting}, Pengelola!</p>
          <h1 className="mt-1 text-2xl font-bold">Kebun Seroja</h1>
          <p className="mt-1 text-sm text-emerald-100 opacity-90">{formatTanggal(now.toISOString())}</p>
          <Button
            size="sm"
            onClick={() => router.push('/tambah-tanaman')}
            className="mt-4 h-9 rounded-xl bg-white px-4 text-sm font-semibold text-emerald-700 shadow hover:bg-emerald-50"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Tambah Tanaman
          </Button>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -right-2 h-24 w-24 rounded-full bg-white/5" />
        <Leaf className="absolute bottom-4 right-10 h-20 w-20 text-white/10" />
      </div>

      {/* ── STATS ────────────────────────────────────────── */}
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-2xl border ${s.border} ${s.bg} p-4`}>
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ${s.color}`}>
              <s.icon className="h-4.5 w-4.5" />
            </div>
            <p className={`mt-3 text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── MAIN GRID ────────────────────────────────────── */}
      <div className="mt-5 grid gap-5 lg:grid-cols-5">
        {/* Jadwal Panen */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <div>
              <h2 className="font-bold">Jadwal Panen</h2>
              <p className="text-xs text-muted-foreground">Diurutkan dari yang paling dekat</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 rounded-lg px-3 text-xs text-primary"
              onClick={() => router.push('/data-tanaman')}
            >
              Lihat semua
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>

          {plantStatuses.length > 0 ? (
            <div className="divide-y divide-border/60">
              {[...plantStatuses]
                .sort((a, b) => a.days - b.days)
                .map(({ plant, status, days }) => {
                  const cfg = statusConfig[status];
                  const dayLabel =
                    days < 0
                      ? `${Math.abs(days)} hari lalu`
                      : days === 0
                      ? 'Hari ini'
                      : `${days} hari lagi`;
                  return (
                    <button
                      key={plant.id}
                      onClick={() => router.push(`/tanaman/${plant.id}`)}
                      className="group flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-muted/40"
                    >
                      <img
                        src={plant.photo_url || 'https://via.placeholder.com/80'}
                        alt={plant.name}
                        className="h-11 w-11 shrink-0 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{plant.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {formatTanggal(plant.estimated_harvest_date)}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${cfg.badge}`}>
                        {dayLabel}
                      </span>
                    </button>
                  );
                })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <CalendarClock className="h-7 w-7" />
              </div>
              <p className="mt-3 text-sm font-medium text-muted-foreground">Belum ada tanaman terdaftar</p>
            </div>
          )}
        </div>

        {/* Tanaman Terbaru */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:col-span-2">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="font-bold">Tanaman Terbaru</h2>
            <p className="text-xs text-muted-foreground">Ditambahkan paling akhir</p>
          </div>
          {recentPlants.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5 p-3">
              {recentPlants.map((plant) => {
                const { status } = getPlantStatus(plant);
                const cfg = statusConfig[status];
                return (
                  <button
                    key={plant.id}
                    onClick={() => router.push(`/tanaman/${plant.id}`)}
                    className="group overflow-hidden rounded-xl border border-border bg-muted/20 text-left transition-all hover:border-primary/40 hover:shadow-sm"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={plant.photo_url || 'https://via.placeholder.com/150'}
                        alt={plant.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className={`absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white ${cfg.dot} shadow`} />
                    </div>
                    <div className="p-2">
                      <p className="truncate text-xs font-bold">{plant.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{plant.type}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Sprout className="h-7 w-7" />
              </div>
              <p className="mt-3 text-sm font-medium text-muted-foreground">Belum ada tanaman</p>
            </div>
          )}
        </div>
      </div>

      {/* ── QUICK ACTIONS ────────────────────────────────── */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          {
            label: 'Tambah Tanaman',
            desc: 'Daftarkan tanaman baru',
            icon: Plus,
            iconBg: 'bg-emerald-500',
            path: '/tambah-tanaman',
          },
          {
            label: 'Data Tanaman',
            desc: 'Kelola semua tanaman',
            icon: List,
            iconBg: 'bg-blue-500',
            path: '/data-tanaman',
          },
          {
            label: 'Halaman Publik',
            desc: 'Lihat sebagai pengunjung',
            icon: Sprout,
            iconBg: 'bg-violet-500',
            path: '/tanaman',
          },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => router.push(item.path)}
            className="group flex items-center gap-3.5 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 hover:shadow-sm"
          >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconBg} text-white shadow-sm`}>
              <item.icon className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </button>
        ))}
      </div>
    </AdminShell>
  );
}
