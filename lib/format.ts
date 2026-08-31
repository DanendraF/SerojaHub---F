export function formatTanggal(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function hariMenujuPanen(harvestIso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const harvest = new Date(harvestIso);
  harvest.setHours(0, 0, 0, 0);
  const diff = harvest.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
