'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CalendarDays, Leaf, MapPin, Search, Sprout } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { useSpecies } from '@/lib/species-context';
import { usePlants } from '@/lib/plant-context';
import { formatTanggal, hariMenujuPanen } from '@/lib/format';
import type { Plant, PlantSpecies } from '@/lib/types';

const TYPE_FILTERS = ['Semua', 'Buah', 'Sayur'] as const;
type TypeFilter = (typeof TYPE_FILTERS)[number];

function harvestMeta(plant: Plant) {
  const days = hariMenujuPanen(plant.estimated_harvest_date);
  if (days < 0) return { label: 'Lewat panen', cls: 'bg-rose-100 text-rose-700' };
  if (days <= 7) return { label: 'Siap panen', cls: 'bg-amber-100 text-amber-700' };
  return { label: `${days} hari lagi`, cls: 'bg-emerald-100 text-emerald-700' };
}

function SpeciesPlantData({ species, plants, isLoading }: {
  species: PlantSpecies | undefined;
  plants: Plant[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-3 px-4 pb-20 sm:px-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-white ring-1 ring-stone-200/50" />
        ))}
      </div>
    );
  }

  if (!species) {
    return (
      <div className="mx-auto max-w-lg px-4 pb-20 text-center">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200/50">
          <h3 className="text-lg font-bold text-stone-900">Jenis tanaman tidak ditemukan</h3>
          <p className="mt-1 text-sm text-stone-500">QR mungkin sudah tidak berlaku.</p>
          <Link href="/tanaman" className="mt-4 inline-block text-sm font-semibold text-emerald-700 hover:underline">
            Lihat semua tanaman
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-b from-emerald-50 to-[#f7f9f5] pt-24 pb-8 sm:pt-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link href="/tanaman" className="text-sm font-semibold text-emerald-700 hover:underline">
            ← Semua tanaman
          </Link>
          <div className="mt-4 flex items-start gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-stone-200/60 sm:h-24 sm:w-24">
              {species.photo_url ? (
                <img src={species.photo_url} alt={species.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-stone-300">
                  <Leaf className="h-8 w-8" />
                </div>
              )}
            </div>
            <div>
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                species.category === 'Sayur' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
              }`}>
                {species.category}
              </span>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-stone-900">
                {species.name}
              </h1>
              <p className="mt-1 text-sm text-stone-500">
                Data tanaman {species.name} di Kebun Seroja — {plants.length} titik tanam.
              </p>
            </div>
          </div>
          {species.description && (
            <p className="mt-4 text-sm leading-relaxed text-stone-600">{species.description}</p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        {plants.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-stone-200/50">
            <Sprout className="mx-auto h-8 w-8 text-emerald-500" />
            <p className="mt-3 font-semibold text-stone-800">Belum ada data bedeng {species.name}</p>
            <p className="mt-1 text-sm text-stone-500">Pengelola belum mendaftarkan titik tanam untuk jenis ini.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {plants.map((plant) => {
              const meta = harvestMeta(plant);
              return (
                <Link
                  key={plant.id}
                  href={`/tanaman/${plant.id}`}
                  className="group flex gap-4 overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200/50 transition hover:shadow-md hover:ring-emerald-200"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                    <img
                      src={plant.photo_url || species.photo_url || 'https://placehold.co/160x160/e7f5e9/4ade80?text=🌿'}
                      alt={plant.name}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold text-stone-900 group-hover:text-emerald-700">{plant.name}</h2>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.cls}`}>
                        {meta.label}
                      </span>
                    </div>
                    {plant.lokasi_bedeng && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-stone-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {plant.lokasi_bedeng}
                      </p>
                    )}
                    <p className="mt-1 flex items-center gap-1 text-xs text-stone-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Panen {formatTanggal(plant.estimated_harvest_date)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {(species.manfaat || species.cara_tanam) && (
          <div className="mt-8 space-y-4">
            {species.manfaat && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                <h3 className="font-bold text-stone-800">Manfaat</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone-600">{species.manfaat}</p>
              </div>
            )}
            {species.cara_tanam && (
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <h3 className="font-bold text-stone-800">Cara Tanam</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone-600">{species.cara_tanam}</p>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}

function TanamanListContent() {
  const searchParams = useSearchParams();
  const jenisId = searchParams.get('jenis');
  const { species, isLoading } = useSpecies();
  const { plants, isLoading: plantsLoading } = usePlants();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('Semua');

  if (jenisId) {
    const selected = species.find((s) => s.id === jenisId);
    const speciesPlants = plants.filter((p) => {
      if (p.speciesId === jenisId) return true;
      if (!p.speciesId && selected) {
        return p.name.toLowerCase() === selected.name.toLowerCase();
      }
      return false;
    });

    return (
      <div className="min-h-screen bg-[#f7f9f5]">
        <SiteHeader />
        <SpeciesPlantData
          species={isLoading ? undefined : selected}
          plants={speciesPlants}
          isLoading={isLoading || plantsLoading}
        />
      </div>
    );
  }

  const filtered = species.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.category ?? '').toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'Semua' || s.category === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="min-h-screen bg-[#f7f9f5]">
      <SiteHeader />

      <section className="bg-gradient-to-b from-emerald-50 to-[#f7f9f5] pt-24 pb-10 sm:pt-32 sm:pb-12">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-sm font-semibold text-emerald-700 shadow-sm">
            <Leaf className="h-3.5 w-3.5" />
            Kebun Komunitas Seroja
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
            Katalog Tanaman
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone-500 sm:text-base">
            Kenali berbagai jenis tanaman yang dibudidayakan di kebun kami.
          </p>

          <div className="mx-auto mt-6 max-w-lg space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari jenis tanaman..."
                className="h-12 w-full rounded-full border-0 bg-white pl-10 pr-4 text-stone-900 shadow-sm ring-1 ring-inset ring-stone-200 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm"
              />
            </div>

            <div className="flex justify-center gap-2">
              {TYPE_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setTypeFilter(f)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    typeFilter === f
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white text-stone-600 ring-1 ring-inset ring-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/50">
                <div className="aspect-[3/2] w-full rounded-t-2xl bg-stone-100" />
                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <div className="h-4 w-1/3 rounded bg-stone-100" />
                  <div className="mt-2 h-5 w-2/3 rounded bg-stone-100" />
                  <div className="mt-auto pt-3">
                    <div className="h-4 w-full rounded bg-stone-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-stone-100 shadow-sm">
            <h3 className="text-lg font-bold text-stone-900">Tidak ada hasil</h3>
            <p className="mt-1 text-stone-500">Coba kata kunci lain atau ubah filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            {filtered.map((s) => (
              <Link
                href={`/tanaman?jenis=${s.id}`}
                key={s.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/50 transition-all hover:shadow-md hover:ring-emerald-200"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-stone-100">
                  {s.photo_url ? (
                    <img
                      src={s.photo_url}
                      alt={s.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-stone-300">
                      <Leaf className="h-10 w-10 opacity-20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="absolute left-2 top-2 sm:left-3 sm:top-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${
                      s.category === 'Sayur' ? 'bg-emerald-500/90 text-white' : 'bg-orange-500/90 text-white'
                    }`}>
                      {s.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <h3 className="font-bold text-stone-900 line-clamp-1 group-hover:text-emerald-700">
                    {s.name}
                  </h3>
                  {s._count && (
                    <p className="mt-1 text-[11px] font-medium text-emerald-600 sm:text-xs">
                      {s._count.plants} Titik Tanam Aktif
                    </p>
                  )}
                  <div className="mt-2 text-xs text-stone-500 line-clamp-2">
                    {s.description || 'Lihat data tanaman jenis ini.'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function TanamanListPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f9f5]">
          <SiteHeader />
          <div className="pt-32 text-center text-sm text-stone-500">Memuat...</div>
        </div>
      }
    >
      <TanamanListContent />
    </Suspense>
  );
}
