'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Leaf, MapPin, QrCode, Sprout, ChevronLeft, ChevronRight } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const heroImage = '/images/bg2.jpg';

// Daftar gambar slider galeri kebun (User dapat menambahkan/mengganti gambar di folder public/images)
const heroSlides = [
  { url: '/images/bg2.jpg', title: 'Kebun Komunitas Seroja' },
  { url: '/images/slide1.jpg', title: 'Aktivitas Warga Kebun' },
  { url: '/images/slide2.jpg', title: 'Hasil Tanaman Organik Fresh' },
  { url: '/images/slide3.jpg', title: 'Sudut Edukasi QR Code' },
  { url: '/images/bg.jpeg', title: 'Suasana Kebun Seroja' },
];

const features = [
  {
    icon: QrCode,
    title: 'Scan QR Code',
    desc: 'Setiap tanaman punya QR code. Scan dengan HP untuk lihat info lengkap tanaman.',
  },
  {
    icon: Leaf,
    title: 'Info Lengkap',
    desc: 'Lihat foto, jenis, tanggal tanam, perkiraan panen, dan manfaat setiap tanaman.',
  },
  {
    icon: Sprout,
    title: 'Kelola Mudah',
    desc: 'Pengelola kebun bisa tambah, ubah, dan cetak QR code tanaman dengan mudah.',
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto transition slide setiap 3.5 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero Section - Full Screen (100vh) */}
      <section className="relative overflow-hidden min-h-screen w-full flex items-center justify-center pt-24 pb-16">
        {/* Background Image Container - Extends behind navbar */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={heroImage}
            alt="Kebun Seroja"
            className="h-full w-full object-cover object-center scale-105"
          />
          {/* Soft gradient overlay for text readability without dark boxed cards */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/50" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left Column: Seroja Knowledge Hub Text */}
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

            {/* Right Column: Auto-changing Image Slider Gallery */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto w-full max-w-md lg:max-w-none overflow-hidden rounded-2xl border-2 border-white/30 bg-slate-950/40 backdrop-blur-md shadow-2xl aspect-[4/3] group">
                {heroSlides.map((slide, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "absolute inset-0 transition-opacity duration-700 ease-in-out",
                      idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                    )}
                  >
                    <img
                      src={slide.url}
                      alt={slide.title}
                      onError={(e) => {
                        // Fallback ke bg2.jpg jika file gambar belum dimasukkan user
                        e.currentTarget.src = '/images/bg2.jpg';
                      }}
                      className="h-full w-full object-cover transition-transform duration-1000 scale-100 group-hover:scale-105"
                    />
                    {/* Gradient title overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
                      <span className="text-[10px] font-semibold tracking-wider text-emerald-300 uppercase block">Galeri Foto Kebun</span>
                      <p className="text-sm font-bold truncate">{slide.title}</p>
                    </div>
                  </div>
                ))}

                {/* Arrow Navigation */}
                <button
                  onClick={prevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-lg bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Foto sebelumnya"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-lg bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Foto selanjutnya"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Indicator Dots */}
                <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5">
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        idx === currentSlide ? "w-6 bg-emerald-400" : "w-2 bg-white/50 hover:bg-white/80"
                      )}
                      aria-label={`Ke foto ke-${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Warm Organic Cards */}
      <section className="bg-[#faf8f5] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="inline-block rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800">
              Penggunaan Praktis
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-stone-900 sm:text-4xl">
              Cara Kerja Sistem
            </h2>
            <p className="mt-3 text-base sm:text-lg text-stone-600 font-medium">
              Tiga langkah sederhana untuk mengenal tanaman di Kebun Seroja
            </p>
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

      {/* About Section - Warm & Local Organic Feel */}
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
            
            <div className="overflow-hidden rounded-3xl shadow-xl border-4 border-white bg-white">
              <img
                src="https://images.pexels.com/photos/37553146/pexels-photo-37553146.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Kebun komunitas Seroja"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#faf8f5] border-t border-amber-900/10 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2.5">
            <img src="/Logo.png" alt="Kebun Seroja" className="h-9 w-9 object-contain shrink-0" />
            <span className="text-xl font-extrabold text-stone-900">
              Kebun Seroja
            </span>
          </div>
          <p className="mt-3 text-sm font-semibold text-stone-500">
            Seroja Knowledge Hub &copy; 2026 — Dikelola Bersama KWT Kebun Seroja
          </p>
        </div>
      </footer>
    </div>
  );
}
