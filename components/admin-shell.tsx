'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import {
  CalendarClock,
  Globe,
  LayoutGrid,
  LogOut,
  Sprout,
  Database,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { usePlants } from '@/lib/plant-context';
import { hariMenujuPanen } from '@/lib/format';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/beranda',       label: 'Beranda',        icon: LayoutGrid, desc: 'Ringkasan kebun' },
  { href: '/jenis-tanaman', label: 'Jenis Tanaman',  icon: Database, desc: 'Master data jenis' },
  { href: '/data-tanaman',  label: 'Data Tanaman',   icon: Sprout,     desc: 'Kelola tanaman' },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const { isLoggedIn, logout } = useAuth();
  const { plants } = usePlants();
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);
  if (!ready) return null;
  if (!isLoggedIn) { router.replace('/masuk'); return null; }

  const nearingCount = plants.filter((p) => {
    const d = hariMenujuPanen(p.estimated_harvest_date);
    return d >= 0 && d <= 7;
  }).length;

  return (
    <div className="admin-bg min-h-screen">

      {/* ── SIDEBAR (desktop) ────────────────────────── */}
      <aside className="print:hidden fixed inset-y-0 left-0 z-50 hidden w-60 flex-col bg-white/80 backdrop-blur-xl border-r border-stone-100 shadow-sm lg:flex">

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-600 shadow-sm">
            <img src="/Logo.png" alt="Seroja" className="h-7 w-7 object-contain" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-stone-900">Kebun Seroja</p>
            <p className="text-[11px] text-stone-400">Panel Pengelola</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          <p className="px-2 pb-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-stone-400">
            Navigasi
          </p>
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== '/beranda' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all',
                  active
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900',
                )}
              >
                <span className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all',
                  active ? 'bg-white/20' : 'bg-stone-100 group-hover:bg-emerald-50 group-hover:text-emerald-600',
                )}>
                  <item.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-none">{item.label}</p>
                  <p className={cn(
                    'mt-0.5 text-[11px] leading-none',
                    active ? 'text-white/70' : 'text-stone-400',
                  )}>
                    {item.desc}
                  </p>
                </div>
              </Link>
            );
          })}

          {/* Divider */}
          <div className="my-3 h-px bg-stone-100" />
          <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">
            Lainnya
          </p>
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-stone-500 transition-all hover:bg-stone-50 hover:text-stone-900"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-100 transition-all group-hover:bg-emerald-50 group-hover:text-emerald-600">
              <Globe className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-none">Halaman Publik</p>
              <p className="mt-0.5 text-[11px] leading-none text-stone-400">Lihat sebagai tamu</p>
            </div>
          </Link>
        </nav>

        {/* Harvest alert */}
        {nearingCount > 0 && (
          <div className="mx-3 mb-3 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-white shadow-sm">
              <CalendarClock className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-bold text-amber-800">
                {nearingCount} tanaman siap panen
              </p>
              <p className="text-[11px] text-amber-600">dalam 7 hari ke depan</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="border-t border-stone-100 p-3">
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-stone-400 transition-all hover:bg-rose-50 hover:text-rose-600"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-100 transition-all hover:bg-rose-100">
              <LogOut className="h-4 w-4" />
            </span>
            Keluar
          </button>
        </div>
      </aside>

      {/* ── MOBILE TOP NAV ───────────────────────────── */}
      <div className="print:hidden sticky top-0 z-40 flex flex-col bg-white/90 shadow-sm backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600">
              <img src="/Logo.png" alt="Seroja" className="h-6 w-6 object-contain" />
            </div>
            <span className="text-sm font-bold text-stone-900">Panel Pengelola</span>
          </Link>
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-stone-400 transition hover:bg-rose-50 hover:text-rose-500"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile nav tabs */}
        <div className="flex gap-1 border-t border-stone-100 px-3 pb-2 pt-1.5">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== '/beranda' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all',
                  active
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-400 hover:bg-stone-100 hover:text-stone-700',
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────── */}
      <main className="lg:pl-60 print:pl-0">
        <div className="mx-auto max-w-5xl px-4 py-5 lg:px-6 lg:py-6 print:max-w-none print:p-0">
          {children}
        </div>
      </main>
    </div>
  );
}
