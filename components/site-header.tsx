'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Leaf, Menu, X, Sprout, Home, User, Lock, Eye, EyeOff, LayoutGrid, LogOut, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, login, logout } = useAuth();
  const { toast } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Login Modal state
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('seroja123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainNavItems = [
    { href: '/', label: 'Beranda', icon: Home },
    { href: '/tanaman', label: 'Daftar Tanaman', icon: Sprout },
  ];

  const isItemActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href);
  };

  const isTransparent = isHomePage && !scrolled;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const basicToken = 'Basic ' + btoa(`${username}:${password}`);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${apiUrl}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': basicToken,
        },
      });

      if (response.status === 401) {
        setError('Nama pengguna atau kata sandi salah.');
        return;
      }

      if (response.ok) {
        login(basicToken);
        setLoginModalOpen(false);
        toast({
          title: 'Berhasil Masuk',
          description: 'Selamat datang kembali di Panel Pengelola Kebun Seroja.',
        });
        router.push('/beranda');
      } else {
        setError('Terjadi kesalahan pada server backend.');
      }
    } catch (err) {
      console.error(err);
      setError('Gagal menghubungi server backend. Pastikan server backend sudah aktif.');
    }
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300',
          isTransparent
            ? 'bg-transparent border-transparent py-2 text-white'
            : 'bg-[#faf8f5]/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-amber-900/10 shadow-sm py-0 text-stone-900'
        )}
      >
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link 
            href="/" 
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img 
              src="/Logo.png" 
              alt="Kebun Seroja" 
              className="h-9 w-9 object-contain shrink-0 transition-transform group-hover:scale-105" 
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-base font-bold tracking-tight leading-none transition-colors',
                    isTransparent ? 'text-white drop-shadow-sm' : 'text-stone-900'
                  )}
                >
                  Kebun Seroja
                </span>
                <span
                  className={cn(
                    'inline-block rounded-md px-1.5 py-0.5 text-[10px] font-semibold border transition-colors',
                    isTransparent
                      ? 'bg-white/20 text-white border-white/30 backdrop-blur-xs'
                      : 'bg-emerald-100/80 text-emerald-800 border-emerald-200/60'
                  )}
                >
                  Warga Tani
                </span>
              </div>
              <span
                className={cn(
                  'text-[11px] font-medium mt-0.5 leading-none transition-colors',
                  isTransparent ? 'text-white/80' : 'text-stone-500'
                )}
              >
                Seroja Knowledge Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {mainNavItems.map((item) => {
              const active = isItemActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                    active
                      ? isTransparent
                        ? 'bg-white/20 text-white backdrop-blur-sm'
                        : 'bg-emerald-700 text-white shadow-sm'
                      : isTransparent
                        ? 'text-white/80 hover:bg-white/10 hover:text-white'
                        : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right CTA / Login Popup Button */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push('/beranda')}
                  className={cn(
                    'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200',
                    isTransparent
                      ? 'bg-white text-emerald-800 shadow hover:bg-emerald-50'
                      : 'bg-emerald-700 text-white shadow-sm hover:bg-emerald-800'
                  )}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>Panel Pengelola</span>
                </button>
                <button
                  onClick={() => { logout(); toast({ description: 'Anda telah keluar.' }); }}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200',
                    isTransparent
                      ? 'text-white/80 hover:bg-white/15 hover:text-white'
                      : 'text-stone-400 hover:bg-stone-100 hover:text-rose-500'
                  )}
                  title="Keluar"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setError(''); setLoginModalOpen(true); }}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200',
                  isTransparent
                    ? 'bg-white text-emerald-800 shadow hover:bg-emerald-50'
                    : 'bg-emerald-700 text-white shadow-sm hover:bg-emerald-800'
                )}
              >
                <User className="h-3.5 w-3.5" />
                <span>Panel Pengelola</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              className={cn(
                'p-2 rounded-lg transition-colors',
                isTransparent
                  ? 'text-white hover:bg-white/20'
                  : 'text-stone-700 hover:bg-stone-100'
              )}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className={cn('h-5 w-5', isTransparent ? 'text-white' : 'text-stone-900')} />
              ) : (
                <Menu className={cn('h-5 w-5', isTransparent ? 'text-white' : 'text-stone-900')} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-amber-900/10 bg-[#faf8f5]/98 text-stone-900 backdrop-blur-lg px-4 py-4 shadow-xl animate-in slide-in-from-top-1 duration-150">
            <div className="flex flex-col gap-2">
              {mainNavItems.map((item) => {
                const active = isItemActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center justify-between rounded-lg px-4 py-3 text-sm font-bold transition-colors',
                      active
                        ? 'bg-emerald-800 text-amber-50 shadow-sm'
                        : 'text-stone-700 hover:bg-emerald-100/60'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-60" />
                  </Link>
                );
              })}

              <div className="my-2 border-t border-amber-900/10" />

              {isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push('/beranda');
                    }} 
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-800 text-white text-sm font-semibold py-3 shadow-sm"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span>Buka Panel Pengelola</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      toast({ description: 'Anda telah keluar.' });
                    }} 
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 text-sm font-semibold"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Keluar
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setError('');
                    setLoginModalOpen(true);
                  }} 
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-semibold py-3 shadow-sm transition-all"
                >
                  <User className="h-4 w-4" />
                  <span>Masuk Pengelola</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Login Popup Dialog Window */}
      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-6">
          <DialogHeader className="flex flex-col items-center text-center">
            <img src="/Logo.png" alt="Kebun Seroja Logo" className="h-12 w-12 object-contain mb-2" />
            <DialogTitle className="text-xl font-bold text-stone-900">Masuk Panel Pengelola</DialogTitle>
            <DialogDescription className="text-sm text-stone-500 mt-1">
              Masukkan nama pengguna dan kata sandi Anda.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLoginSubmit} className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="popup-username" className="text-xs font-semibold text-stone-700">
                Nama Pengguna
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input
                  id="popup-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="h-11 pl-10 text-sm rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="popup-password" className="text-xs font-semibold text-stone-700">
                Kata Sandi
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <Input
                  id="popup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 pl-10 pr-10 text-sm rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 transition-colors hover:text-stone-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-200">
                {error}
              </p>
            )}

            <Button type="submit" className="h-11 w-full rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-sm">
              Masuk Sekarang
            </Button>
          </form>

          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-center">
            <p className="text-xs text-amber-900 font-medium">
              Demo: <span className="font-bold">admin</span> / <span className="font-bold">seroja123</span>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}





