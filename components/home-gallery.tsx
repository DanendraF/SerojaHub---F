'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SmartImage } from '@/components/smart-image';

const heroSlides = [
  { url: '/images/depan.jpeg', title: 'Tampak Depan Kebun Seroja' },
  { url: '/images/belakang.jpeg', title: 'Area Belakang Kebun' },
  { url: '/images/cabai.jpeg', title: 'Tanaman Cabai Seroja' },
  { url: '/images/labu.jpeg', title: 'Tanaman Labu Fresh' },
  { url: '/images/pisang.jpeg', title: 'Pohon Pisang Kebun' },
  { url: '/images/bg.jpeg', title: 'Suasana Kebun Seroja' },
  { url: '/images/bg2.jpg', title: 'Kebun Komunitas Seroja' },
];

export function HomeGallery() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});

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
    <div className="relative mx-auto w-full max-w-md lg:max-w-none overflow-hidden rounded-2xl border-2 border-white/30 bg-slate-950/40 backdrop-blur-md shadow-2xl aspect-[4/3] group">
      {heroSlides.map((slide, idx) => (
        <div
          key={idx}
          className={cn(
            'absolute inset-0 transition-opacity duration-700 ease-in-out',
            idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none',
          )}
        >
          <SmartImage
            src={failed[idx] ? '/images/bg2.jpg' : slide.url}
            alt={slide.title}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover transition-transform duration-1000 scale-100 group-hover:scale-105"
            onError={() => setFailed((prev) => ({ ...prev, [idx]: true }))}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
            <span className="text-[10px] font-semibold tracking-wider text-emerald-300 uppercase block">
              Galeri Foto Kebun
            </span>
            <p className="text-sm font-bold truncate">{slide.title}</p>
          </div>
        </div>
      ))}

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

      <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              idx === currentSlide ? 'w-6 bg-emerald-400' : 'w-2 bg-white/50 hover:bg-white/80',
            )}
            aria-label={`Ke foto ke-${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
