import Link from 'next/link';
import { CalendarDays, Leaf, MapPin, Sprout } from 'lucide-react';
import { SmartImage } from '@/components/smart-image';
import { formatTanggal, hariMenujuPanen } from '@/lib/format';
import type { Plant, PlantSpecies } from '@/lib/types';

function harvestMeta(plant: Plant) {
  const days = hariMenujuPanen(plant.estimated_harvest_date);
  if (days < 0) return { label: 'Lewat panen', cls: 'bg-rose-100 text-rose-700' };
  if (days <= 7) return { label: 'Siap panen', cls: 'bg-amber-100 text-amber-700' };
  return { label: `${days} hari lagi`, cls: 'bg-emerald-100 text-emerald-700' };
}

export function SpeciesPlantData({
  species,
  plants,
}: {
  species: PlantSpecies;
  plants: Plant[];
}) {
  return (
    <>
      <section className="bg-gradient-to-b from-emerald-50 to-[#f7f9f5] pt-24 pb-8 sm:pt-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link href="/tanaman" className="text-sm font-semibold text-emerald-700 hover:underline">
            ← Semua tanaman
          </Link>
          <div className="mt-4 flex items-start gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-stone-100 ring-1 ring-stone-200/60 sm:h-24 sm:w-24">
              {species.photo_url ? (
                <SmartImage
                  src={species.photo_url}
                  alt={species.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-stone-300">
                  <Leaf className="h-8 w-8" />
                </div>
              )}
            </div>
            <div>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  species.category === 'Sayur'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-orange-100 text-orange-800'
                }`}
              >
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
            <p className="mt-1 text-sm text-stone-500">
              Pengelola belum mendaftarkan titik tanam untuk jenis ini.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {plants.map((plant) => {
              const meta = harvestMeta(plant);
              const photo = plant.photo_url || species.photo_url;
              return (
                <Link
                  key={plant.id}
                  href={`/tanaman/${plant.id}`}
                  className="group flex gap-4 overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200/50 transition hover:shadow-md hover:ring-emerald-200"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                    {photo ? (
                      <SmartImage
                        src={photo}
                        alt={plant.name}
                        fill
                        sizes="80px"
                        className="object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-stone-300">
                        <Leaf className="h-8 w-8" />
                      </div>
                    )}
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
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone-600">
                  {species.manfaat}
                </p>
              </div>
            )}
            {species.cara_tanam && (
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <h3 className="font-bold text-stone-800">Cara Tanam</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone-600">
                  {species.cara_tanam}
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}
