import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { SpeciesPlantData } from '@/components/species-plant-data';
import { TanamanCatalog } from '@/components/tanaman-catalog';
import {
  PUBLIC_REVALIDATE_SECONDS,
  fetchPlantsForSpecies,
  fetchSpeciesById,
  fetchSpeciesList,
  slimSpecies,
} from '@/lib/public-data';

export const revalidate = PUBLIC_REVALIDATE_SECONDS;

export default async function TanamanListPage({
  searchParams,
}: {
  searchParams: { jenis?: string };
}) {
  const jenisId = searchParams.jenis;

  if (jenisId) {
    const species = await fetchSpeciesById(jenisId);
    if (!species) {
      return (
        <div className="min-h-screen bg-[#f7f9f5]">
          <SiteHeader />
          <div className="mx-auto max-w-lg px-4 pb-20 pt-32 text-center">
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200/50">
              <h3 className="text-lg font-bold text-stone-900">Jenis tanaman tidak ditemukan</h3>
              <p className="mt-1 text-sm text-stone-500">QR mungkin sudah tidak berlaku.</p>
              <Link
                href="/tanaman"
                className="mt-4 inline-block text-sm font-semibold text-emerald-700 hover:underline"
              >
                Lihat semua tanaman
              </Link>
            </div>
          </div>
        </div>
      );
    }

    const plants = await fetchPlantsForSpecies(species);

    return (
      <div className="min-h-screen bg-[#f7f9f5]">
        <SiteHeader />
        <SpeciesPlantData species={species} plants={plants} />
      </div>
    );
  }

  const species = slimSpecies(await fetchSpeciesList());

  return (
    <div className="min-h-screen bg-[#f7f9f5]">
      <SiteHeader />
      <TanamanCatalog species={species} />
    </div>
  );
}
