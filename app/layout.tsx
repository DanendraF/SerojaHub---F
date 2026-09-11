import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/lib/providers';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

const SITE_URL = 'https://seroja-hub-f.vercel.app';
const SITE_NAME = 'Seroja Knowledge Hub';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Seroja Knowledge Hub - Informasi Tanaman Kebun Seroja',
    template: '%s | Seroja Knowledge Hub',
  },
  verification: {
    google: 'google39c0e85a131b48fe',
  },
  description:
    'Seroja Knowledge Hub adalah sistem informasi digital tanaman Kebun Seroja. Scan QR Code untuk melihat jenis tanaman, cara tanam, manfaat, dan jadwal panen. Dikelola oleh KWT Kebun Seroja.',
  keywords: [
    'Kebun Seroja',
    'Seroja',
    'Seroja Knowledge Hub',
    'tanaman Seroja',
    'kebun komunitas',
    'KWT Seroja',
    'informasi tanaman',
    'scan QR tanaman',
    'tanaman organik',
    'kebun warga',
    'edukasi tanaman',
    'cara tanam',
    'manfaat tanaman',
    'jadwal panen',
    'sayuran organik',
    'buah-buahan',
  ],
  authors: [{ name: 'Danendra Farrel Adriansyah' }],
  creator: 'Danendra Farrel Adriansyah',
  publisher: 'KWT Kebun Seroja',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Seroja Knowledge Hub - Informasi Tanaman Kebun Seroja',
    description:
      'Sistem informasi digital tanaman Kebun Seroja. Scan QR Code untuk melihat detail tanaman, cara tanam, manfaat, dan jadwal panen.',
    images: [
      {
        url: `${SITE_URL}/images/depan.jpeg`,
        width: 1200,
        height: 630,
        alt: 'Tampak Depan Kebun Seroja',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Seroja Knowledge Hub - Informasi Tanaman Kebun Seroja',
    description:
      'Scan QR Code tanaman di Kebun Seroja untuk melihat jenis, manfaat, cara tanam, dan jadwal panen.',
    images: [`${SITE_URL}/images/depan.jpeg`],
  },
  icons: {
    icon: '/Logo.png',
    shortcut: '/Logo.png',
    apple: '/Logo.png',
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={jakarta.className}>
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
