import type { Plant, PlantSpecies } from './types';

export const PUBLIC_REVALIDATE_SECONDS = 60;

export function getApiBase(): string {
  if (typeof window !== 'undefined') return '/api';
  const url =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5000/api';
  return url.replace(/\/$/, '');
}

function unwrap<T>(json: unknown): T | null {
  if (!json || typeof json !== 'object') return null;
  const record = json as { success?: boolean; data?: T };
  if (record.success === false) return null;
  if ('data' in record && record.data !== undefined) return record.data;
  return json as T;
}

async function getJson(path: string): Promise<unknown | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(`${getApiBase()}${path}`, {
      next: { revalidate: PUBLIC_REVALIDATE_SECONDS },
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchPlantList(): Promise<Plant[]> {
  const json = await getJson('/plants');
  const data = unwrap<Plant[]>(json);
  return Array.isArray(data) ? data : [];
}

export async function fetchPlantById(id: string): Promise<Plant | null> {
  const json = await getJson(`/plants/${encodeURIComponent(id)}`);
  const data = unwrap<Plant>(json);
  if (data && typeof data === 'object' && 'id' in data && data.id) {
    return data;
  }
  const list = await fetchPlantList();
  return list.find((p) => p.id === id) ?? null;
}

export async function fetchSpeciesList(): Promise<PlantSpecies[]> {
  const json = await getJson('/species');
  const data = unwrap<PlantSpecies[]>(json);
  return Array.isArray(data) ? data : [];
}

export async function fetchSpeciesById(id: string): Promise<PlantSpecies | null> {
  const json = await getJson(`/species/${encodeURIComponent(id)}`);
  const data = unwrap<PlantSpecies>(json);
  if (data && typeof data === 'object' && 'id' in data && data.id) {
    return data;
  }
  const list = await fetchSpeciesList();
  return list.find((s) => s.id === id) ?? null;
}

export function plantsForSpecies(plants: Plant[], species: PlantSpecies): Plant[] {
  return plants.filter((p) => {
    if (p.speciesId === species.id) return true;
    if (!p.speciesId) return p.name.toLowerCase() === species.name.toLowerCase();
    return false;
  });
}

export async function fetchPlantsForSpecies(species: PlantSpecies): Promise<Plant[]> {
  if (Array.isArray(species.plants) && species.plants.length > 0) {
    return species.plants;
  }
  const plants = await fetchPlantList();
  return plantsForSpecies(plants, species);
}

export function slimSpecies(list: PlantSpecies[]): PlantSpecies[] {
  return list.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    description: s.description,
    photo_url: s.photo_url,
    created_at: s.created_at,
    updated_at: s.updated_at,
    _count: s._count,
  }));
}
