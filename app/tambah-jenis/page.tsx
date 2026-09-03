'use client';

import { AdminShell } from '@/components/admin-shell';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function TambahJenisPage() {
  const { isLoggedIn, token } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoggedIn) router.push('/masuk');
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload/photo', {
        method: 'POST',
        headers: {
          'Authorization': token
        },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setPhotoUrl(data.url);
        toast({ title: 'Foto berhasil diunggah' });
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      toast({ title: 'Gagal unggah foto', description: err.message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get('name'),
      category: fd.get('category'),
      description: fd.get('description'),
      manfaat: fd.get('manfaat'),
      cara_tanam: fd.get('cara_tanam'),
      photo_url: photoUrl
    };

    try {
      const res = await fetch('/api/species', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Berhasil tambah jenis tanaman' });
        router.push('/jenis-tanaman');
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      toast({ title: 'Gagal', description: err.message, variant: 'destructive' });
      setIsSubmitting(false);
    }
  };

  return (
    <AdminShell>
      <div className="max-w-2xl mx-auto">
        <Link href="/jenis-tanaman" className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-800 mb-6 bg-white/50 px-3 py-1.5 rounded-full border border-green-100">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Kembali ke Daftar Jenis
        </Link>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-green-100 p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Tambah Jenis Tanaman</h1>
          
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Foto Tanaman (Opsional)</label>
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              
              {photoUrl ? (
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-green-200 group">
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button type="button" variant="secondary" size="sm" onClick={handleUploadClick}>Ganti</Button>
                  </div>
                </div>
              ) : (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-32 h-32 flex flex-col items-center justify-center gap-2 border-dashed border-2 rounded-xl text-gray-500 hover:text-green-600 hover:border-green-300 hover:bg-green-50"
                  onClick={handleUploadClick}
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 className="w-6 h-6 animate-spin text-green-600" /> : <ImageIcon className="w-6 h-6" />}
                  <span className="text-xs">{isUploading ? 'Mengunggah...' : 'Pilih Foto'}</span>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Jenis *</label>
                <Input name="name" required placeholder="Contoh: Terong Ungu" className="rounded-xl border-green-100 focus-visible:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                <select name="category" required className="flex h-10 w-full rounded-xl border border-green-100 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500">
                  <option value="Buah">Buah</option>
                  <option value="Sayur">Sayur</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Umum</label>
              <Textarea name="description" rows={3} placeholder="Deskripsi singkat mengenai tanaman ini..." className="rounded-xl border-green-100 focus-visible:ring-green-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manfaat</label>
              <Textarea name="manfaat" rows={3} placeholder="Manfaat mengonsumsi tanaman ini..." className="rounded-xl border-green-100 focus-visible:ring-green-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cara Tanam (Opsional)</label>
              <Textarea name="cara_tanam" rows={3} placeholder="Instruksi umum penanaman..." className="rounded-xl border-green-100 focus-visible:ring-green-500" />
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
              <Link href="/jenis-tanaman">
                <Button type="button" variant="ghost" className="rounded-full text-gray-500">Batal</Button>
              </Link>
              <Button type="submit" disabled={isSubmitting} className="rounded-full bg-green-600 hover:bg-green-700">
                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Simpan Jenis Tanaman
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}