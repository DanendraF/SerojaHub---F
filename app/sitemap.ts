import { MetadataRoute } from 'next';
import { fetchSpeciesList } from '@/lib/public-data';

const SITE_URL = 'https://seroja-hub-f.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/tanaman`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  try {
    const species = await fetchSpeciesList();
    const speciesPages: MetadataRoute.Sitemap = species.map((s) => ({
      url: `${SITE_URL}/tanaman?jenis=${s.id}`,
      lastModified: new Date(s.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
    return [...staticPages, ...speciesPages];
  } catch {
    return staticPages;
  }
}