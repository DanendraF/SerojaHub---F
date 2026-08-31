'use client';

import Link from 'next/link';
import { CalendarDays, Leaf, MapPin, Search } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { usePlants } from '@/lib/plant-context';
import { formatTanggal, hariMenujuPanen } from '@/lib/format';
import { useState } from 'react';

const TYPE_FILTERS = ['Semua', 'Buah', 'Sayur'] as const;
type TypeFilter = (typeof TYPE_FILTERS)[number];

export default function TanamanListPage() {
  const { plants, isLoading } = usePlants();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('Semua');

  const filtered = plants.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.type ?? '').toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'Semua' || p.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="min-h-screen bg-[#f7f9f5]">
      <SiteHeader />

      {/* ── HERO ───────────────────────────────────── */}
      <section className="bg-gradient-to-b from-emerald-50 to-[#f7f9f5] pt-24 pb-10 sm:pt-32 sm:pb-12">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm">
            <Leaf className="h-3.5 w-3.5" />
            Kebun Komunitas Seroja
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
            Daftar Tanaman Kebun
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone-500 sm:text-base">
            Scan QR code di kebun atau cari tanaman di sini untuk info lengkapnya.
          </p>

          {/* Search + filter */}
          <div className="mx-auto mt-6 max-w-lg space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama tanaman..."
                className="w-full rounded-2xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm text-stone-800 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div className="flex justify-center gap-2">
              {TYPE_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setTypeFilter(f)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                    typeFilter === f
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-emerald-400 hover:text-emerald-700'
                  }`}
                >
                  {f === 'Buah' ? '🍎 ' : f === 'Sayur' ? '🥬 ' : ''}
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GRID ───────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        {/* Result count */}
        {!isLoading && filtered.length > 0 && (
          <p className="mb-4 text-xs text-stone-400">
            {filtered.length} tanaman ditemukan
          </p>
        )}

        {/* Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="aspect-[3/2] animate-pulse bg-stone-100" />
                <div className="space-y-2 p-3">
                  <div className="h-3.5 w-3/4 animate-pulse rounded bg-stone-100" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-stone-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cards */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {filtered.map((plant) => {
              const days = hariMenujuPanen(plant.estimated_harvest_date);
              const nearing = days >= 0 && days <= 7;
              const emoji = plant.type === 'Buah' ? '🍎' : plant.type === 'Sayur' ? '🥬' : '🌿';

              return (
                <Link
                  key={plant.id}
                  href={`/tanaman/${plant.id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                >
                  {/* Foto — rasio tetap 3:2 */}
                  <div className="relative aspect-[3/2] overflow-hidden bg-stone-100">
                    <img
                      src={plant.photo_url || 'https://placehold.co/300x200/e7f5e9/4ade80?text=🌿'}
                      alt={plant.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />

                    {/* Jenis pill */}
                    <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-stone-700 backdrop-blur-sm shadow-sm">
                      {emoji} {plant.type}
                    </span>

                    {/* Siap panen */}
                    {nearing && (
                      <span className="absolute right-2 top-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
                        Siap Panen
                      </span>
                    )}
                  </div>

                  {/* Info — tinggi tetap */}
                  <div className="flex flex-1 flex-col justify-between p-3">
                    <div>
                      <h2 className="line-clamp-1 text-sm font-bold text-stone-900 transition-colors group-hover:text-emerald-700">
                        {plant.name}
                      </h2>
                      {plant.lokasi_bedeng && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-stone-400">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="line-clamp-1">{plant.lokasi_bedeng}</span>
                        </p>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-stone-400">
                      <CalendarDays className="h-3 w-3 flex-shrink-0" />
                      <span className="line-clamp-1">Panen {formatTanggal(plant.estimated_harvest_date)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty — search */}
        {!isLoading && plants.length > 0 && filtered.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <span className="text-4xl">🔍</span>
            <p className="mt-3 font-semibold text-stone-600">Tidak ditemukan</p>
            <p className="mt-1 text-sm text-stone-400">Coba kata kunci atau filter lain</p>
          </div>
        )}

        {/* Empty — no plants */}
        {!isLoading && plants.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <span className="text-4xl">🌱</span>
            <p className="mt-3 font-semibold text-stone-600">Kebun masih kosong</p>
            <p className="mt-1 text-sm text-stone-400">Tanaman akan segera hadir</p>
          </div>
        )}
      </section>
    </div>
  );
}
