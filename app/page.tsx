import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Database, MapPin, QrCode } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { HomeGallery } from '@/components/home-gallery';
import { SmartImage } from '@/components/smart-image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Beranda - Seroja Knowledge Hub',
  description:
    'Selamat datang di Seroja Knowledge Hub, sistem informasi digital Kebun Seroja. Temukan informasi lengkap tanaman, cara tanam, manfaat, dan jadwal panen dengan teknologi QR Code.',
  alternates: {
    canonical: 'https://seroja-hub-f.vercel.app',
  },
  openGraph: {
    title: 'Seroja Knowledge Hub - Informasi Tanaman Kebun Seroja',
    description:
      'Sistem informasi digital Kebun Seroja. Scan QR Code untuk mengetahui jenis, manfaat, dan cara tanam setiap tanaman.',
    url: 'https://seroja-hub-f.vercel.app',
    images: [{ url: 'https://seroja-hub-f.vercel.app/images/depan.jpeg', width: 1200, height: 630 }],
  },
};

const features = [
  {
    icon: Database,
    title: 'Data Tanaman',
    desc: 'Daftar dan informasi lengkap tanaman yang ada di Kebun Seroja.',
  },
  {
    icon: BookOpen,
    title: 'Informasi & Edukasi',
    desc: 'Kenali jenis, manfaat, serta cara merawat berbagai tanaman.',
  },
  {
    icon: QrCode,
    title: 'Kelola dengan Mudah',
    desc: 'Pengelola dapat memperbarui data dan mencetak QR Code tanaman.',
  },
];

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Kebun Seroja',
    alternateName: 'Seroja Knowledge Hub',
    description:
      'Kebun komunitas yang dikelola oleh KWT Seroja. Sistem informasi digital tanaman dilengkapi QR Code untuk edukasi warga.',
    url: 'https://seroja-hub-f.vercel.app',
    logo: 'https://seroja-hub-f.vercel.app/Logo.png',
    image: 'https://seroja-hub-f.vercel.app/images/depan.jpeg',
    sameAs: [],
    hasMap: '',
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />

      <section className="relative overflow-hidden min-h-screen w-full flex items-center justify-center pt-24 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <SmartImage
            src="/images/bg2.jpg"
            alt="Kebun Seroja"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/50" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 text-white">
              <div className="inline-flex items-center gap-2 rounded-md bg-emerald-800/80 text-white px-3 py-1 text-xs font-medium border border-emerald-600/30 backdrop-blur-xs">
                <MapPin className="h-3.5 w-3.5 text-emerald-300" />
                <span>Kebun Komunitas Seroja</span>
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-sm">
                Seroja Knowledge Hub
              </h1>

              <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed font-normal drop-shadow-xs max-w-xl">
                Sistem informasi tanaman untuk Kebun Seroja. Scan QR code di
                setiap tanaman untuk mengetahui jenis, cara tanam, dan manfaatnya.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/tanaman">
                  <Button
                    size="lg"
                    className="h-11 w-full sm:w-auto rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white px-6 text-sm font-medium shadow-xs"
                  >
                    Lihat Daftar Tanaman
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/beranda">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-11 w-full sm:w-auto rounded-lg border-white/40 bg-white/10 hover:bg-white/20 text-white px-6 text-sm font-medium backdrop-blur-xs"
                  >
                    Masuk Panel Pengelola
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <HomeGallery />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#faf8f5] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800">
              Sistem Informasi
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-stone-900 sm:text-4xl">
              Semua Informasi Kebun dalam Satu Tempat
            </h2>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {features.map((f) => (
              <Card
                key={f.title}
                className="rounded-3xl border border-amber-900/10 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100/80 text-emerald-800 shadow-inner">
                  <f.icon className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-xl font-extrabold text-stone-900">{f.title}</h3>
                <p className="mt-3 text-base text-stone-600 leading-relaxed font-medium">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-emerald-900/5 py-20 border-y border-amber-900/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 sm:grid-cols-2">
            <div>
              <span className="inline-block rounded-full bg-amber-100 px-3.5 py-1 text-xs font-bold text-amber-900">
                Kebun Komunitas Warga
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-stone-900 leading-tight">
                Tentang Kebun Seroja
              </h2>
              <p className="mt-4 text-base sm:text-lg text-stone-700 leading-relaxed font-medium">
                Kebun Seroja adalah kebun komunitas yang dikelola bersama oleh Kelompok
                Wanita Tani (KWT) Seroja. Kami menanam berbagai jenis sayuran
                organik secara gotong-royong untuk kebutuhan warga sekitar.
              </p>
              <p className="mt-3 text-base sm:text-lg text-stone-700 leading-relaxed font-medium">
                Melalui Seroja Knowledge Hub, setiap tanaman dilengkapi QR code edukatif
                agar warga dan pengunjung dapat belajar langsung cara merawat dan mengolahnya.
              </p>
              <div className="mt-8">
                <Link href="/tanaman">
                  <Button size="lg" className="h-13 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-amber-50 px-8 text-base font-bold shadow-md">
                    Jelajahi Tanaman Kami
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl shadow-xl border-4 border-white bg-white aspect-[4/3]">
              <SmartImage
                src="/images/depan.jpeg"
                alt="Tampak Depan Kebun Komunitas Seroja"
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#faf8f5] border-t border-amber-900/10 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4">
            <SmartImage src="/Logo.png" alt="Kebun Seroja" width={40} height={40} className="h-10 w-10 object-contain shrink-0" />
            <SmartImage src="/LOGO_UNIT_3.png" alt="KKN Unit 3" width={40} height={40} className="h-10 w-10 object-contain shrink-0" />
            <span className="text-xl font-extrabold text-stone-900">
              Kebun Seroja
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold text-stone-600">
            Seroja Knowledge Hub &copy; 2026 - Dikelola Bersama KWT Kebun Seroja
          </p>
          <p className="mt-1.5 text-xs font-medium text-stone-500">
            Dibuat oleh <span className="font-semibold text-emerald-800">Danendra Farrel Adriansyah</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
