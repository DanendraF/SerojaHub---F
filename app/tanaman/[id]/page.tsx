'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Leaf, Lock, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function MasukPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const basicToken = 'Basic ' + btoa(`${username}:${password}`);
      const apiUrl = '/api';

      const response = await fetch(`${apiUrl}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': basicToken,
        },
      });

      if (response.status === 401) {
        setError('Nama pengguna atau kata sandi salah.');
        toast({
          title: 'Gagal masuk',
          description: 'Nama pengguna atau kata sandi salah.',
          variant: 'destructive',
        });
        return;
      }

      if (response.ok) {
        login(basicToken);
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
    <div className="flex min-h-screen">
      {/* Left panel - brand */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary p-12 lg:flex">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-foreground/5" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-primary-foreground/5" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/15 text-primary-foreground">
              <Leaf className="h-6 w-6" />
            </span>
            <span className="text-xl font-bold text-primary-foreground">
              Kebun Seroja
            </span>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-4xl font-bold leading-tight text-primary-foreground">
            Panel Pengelola
          </h1>
          <p className="mt-3 max-w-sm text-lg text-primary-foreground/80">
            Kelola tanaman, cetak QR code, dan pantau perkiraan panen Kebun
            Seroja dari satu tempat.
          </p>
        </div>

        <div className="relative flex items-center gap-6">
          <div>
            <p className="text-3xl font-bold text-primary-foreground">5+</p>
            <p className="text-sm text-primary-foreground/70">Jenis Tanaman</p>
          </div>
          <div className="h-12 w-px bg-primary-foreground/20" />
          <div>
            <p className="text-3xl font-bold text-primary-foreground">QR</p>
            <p className="text-sm text-primary-foreground/70">Code per Tanaman</p>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex w-full items-center justify-center bg-secondary/30 px-4 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Leaf className="h-8 w-8" />
            </span>
            <h1 className="mt-4 text-2xl font-bold text-primary">
              Kebun Seroja
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary">Masuk</h2>
            <p className="mt-1 text-base text-muted-foreground">
              Masuk sebagai pengelola kebun
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-lg">
                Nama Pengguna
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="h-14 pl-12 text-lg"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg">
                Kata Sandi
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-14 pl-12 pr-12 text-lg"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-primary"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-destructive/10 px-4 py-3 text-base font-semibold text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="h-14 w-full text-lg">
              Masuk
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <div className="mt-6 rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Demo: <span className="font-semibold">admin</span> /{' '}
              <span className="font-semibold">seroja123</span>
            </p>
          </div>

          <p className="mt-6 text-center text-base text-muted-foreground">
            Pengunjung?{' '}
            <a
              href="/tanaman"
              className="font-semibold text-primary underline"
            >
              Lihat daftar tanaman
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
