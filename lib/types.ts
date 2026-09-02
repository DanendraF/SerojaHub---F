export type PlantStatus = 'TUMBUH' | 'SIAP_PANEN' | 'PANEN' | 'SELESAI';

export type PlantSpecies = {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  manfaat?: string | null;
  cara_tanam?: string | null;
  photo_url?: string | null;
  created_at: string;
  updated_at: string;
  _count?: { plants: number };
  plants?: Plant[];
};

export type Plant = {
  id: string;
  name: string;
  type: string;
  speciesId?: string | null;
  species?: PlantSpecies | null;
  lokasi_bedeng?: string | null;
  planting_date: string;
  estimated_harvest_date: string;
  photo_url?: string | null;
  description?: string | null;
  cara_tanam?: string | null;
  manfaat?: string | null;
  catatan_pengelola?: string | null;
  status: PlantStatus;
  created_at: string;
  updated_at: string;
};
