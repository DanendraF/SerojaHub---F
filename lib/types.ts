export type PlantStatus = 'TUMBUH' | 'SIAP_PANEN' | 'PANEN' | 'SELESAI';

export type Plant = {
  id: string;
  name: string;
  type: string;
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
