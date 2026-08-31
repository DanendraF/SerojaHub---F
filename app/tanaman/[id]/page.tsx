'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CalendarDays,
  Leaf,
  MapPin,
  QrCode,
  Sprout,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { SiteHeader } from '@/components/site-header';
import { usePlants } from '@/lib/plant-context';
import { formatTanggal, hariMenujuPanen } from '@/lib/format';

function InfoSection({
  emoji,
  title,
  content,
  accent,
}: {
  emoji: string;
  title: string;
  content?: string | null;
  accent: string;
}) {
  if (!content) return null;
  return (
    <div className={`rounded-2xl border p-5 ${accent}`}>
      <div className="mb-3 flex items-center gap-2.5">
        <span className="text-xl">{emoji}</span>
        <h3 className="font-bold text-stone-800">{title}</h3>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-600">{content}</p>
    </div>
  );
}

export default function TanamanDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getPlant, isLoading } = usePlants();
  const [origin, setOrigin] = useState('');

  useEffect(() => { setOrigin(window.location.origin); }, []);

  const plant = getPlant(params.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f9f5]">
        <SiteHeader />
        <div className="mt-16 h-72 w-full animate-pulse bg-stone-200" />
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
          <div className="h-6 w-1/2 animate-pulse rounded-lg bg-stone-200" />
          <div className="h-4 w-full animate-pulse rounded bg-stone-200" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-stone-200" />
        </div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen bg-[#f7f9f5]">
        <SiteHeader />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <span className="text-5xl">🌿</span>
          <h1 className="mt-4 text-xl font-bold text-stone-800">Tanaman tidak ditemukan</h1>
          <p className="mt-2 text-sm text-stone-500">Mungkin sudah dipindahkan atau dihapus.</p>
          <button
            onClick={() => router.push('/tanaman')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar
          </button>
        </div>
      </div>
    );
  }

  const days = hariMenujuPanen(plant.estimated_harvest_date);
  const nearing = days >= 0 && days <= 7;
  const overdue = days < 0;
  const detailUrl = origin ? `${origin}/tanaman/${plant.id}` : `/tanaman/${plant.id}`;
  const typeEmoji = plant.type === 'Buah' ? '🍎' : plant.type === 'Sayur' ? '🥬' : '🌿';

  const harvestBadge = overdue
    ? { label: `${Math.abs(days)} hari lalu`, cls: 'bg-rose-100 text-rose-700 border-rose-200' }
    : nearing
    ? { label: 'Siap Panen 🌾', cls: 'bg-amber-100 text-amber-700 border-amber-200' }
    : { label: `${days} hari lagi`, cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' };

  return (
    <div className="min-h-screen bg-[#f7f9f5]">
      <SiteHeader />

      {/* FOTO HERO */}
      <div className="relative mt-16 h-64 w-full overflow-hidden sm:h-80 md:h-96">
        <img
          src={plant.photo_url || 'https://placehold.co/1200x500/e7f5e9/4ade80?text=Plant'}
          alt={plant.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <button
          onClick={() => router.push('/tanaman')}
          className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-black/50"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali
        </button>

        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          <div className="mb-2 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/30 bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
              {typeEmoji} {plant.type}
            </span>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${harvestBadge.cls}`}>
              {harvestBadge.label}
            </span>
            {plant.lokasi_bedeng && (
              <span className="flex items-center gap-1 rounded-full border border-white/30 bg-white/20 px-2.5 py-0.5 text-xs text-white backdrop-blur-sm">
                <MapPin className="h-3 w-3" />
                {plant.lokasi_bedeng}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-white drop-shadow sm:text-3xl">{plant.name}</h1>
        </div>
      </div>

      {/* KONTEN */}
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">

        {/* Jadwal */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-stone-100 bg-white p-4 shadow-sm">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Sprout className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-stone-400">Ditanam</p>
              <p className="text-sm font-bold leading-snug text-stone-800">{formatTanggal(plant.planting_date)}</p>
            </div>
          </div>
          <div className={`flex items-center gap-3 rounded-2xl border p-4 shadow-sm ${nearing ? 'border-amber-200 bg-amber-50' : overdue ? 'border-rose-200 bg-rose-50' : 'border-stone-100 bg-white'}`}>
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${nearing ? 'bg-amber-100 text-amber-600' : overdue ? 'bg-rose-100 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <CalendarDays className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-stone-400">Estimasi Panen</p>
              <p className="text-sm font-bold leading-snug text-stone-800">{formatTanggal(plant.estimated_harvest_date)}</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 space-y-3">
          <InfoSection emoji="📋" title="Deskripsi" content={plant.description} accent="border-stone-100 bg-white" />
          <InfoSection emoji="💚" title="Manfaat untuk Kesehatan" content={plant.manfaat} accent="border-emerald-100 bg-emerald-50/50" />
          <InfoSection emoji="🌱" title="Cara Tanam" content={plant.cara_tanam} accent="border-blue-100 bg-blue-50/50" />
          <InfoSection emoji="📝" title="Catatan Pengelola" content={plant.catatan_pengelola} accent="border-amber-100 bg-amber-50/50" />
        </div>

        {/* QR */}
        {origin && (
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
        )}

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between border-t border-stone-100 pt-6">
          <button
            onClick={() => router.push('/tanaman')}
            className="flex items-center gap-1.5 text-sm font-semibold text-stone-500 transition hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Semua Tanaman
          </button>
          <span className="flex items-center gap-1.5 text-xs text-stone-400">
            <Leaf className="h-3.5 w-3.5 text-emerald-500" />
            Kebun Komunitas Seroja
          </span>
        </div>
      </div>
    </div>
  );
}