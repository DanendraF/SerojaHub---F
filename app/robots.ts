import { MetadataRoute } from 'next';

const SITE_URL = 'https://seroja-hub-f.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/beranda/', '/tambah-tanaman/', '/tambah-jenis/', '/edit-tanaman/', '/edit-jenis/', '/masuk/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}