'use client';

import { useEffect, useRef, useState } from 'react';
import { Image as ImageIcon, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import type { PlantSpecies } from '@/lib/types';
import { getUploadedPhotoUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type SpeciesFormDialogProps = {
  open: boolean;
  species: PlantSpecies | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

export function SpeciesFormDialog({
  open,
  species,
  onOpenChange,
  onSaved,
}: SpeciesFormDialogProps) {
  const { token } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Buah');
  const [description, setDescription] = useState('');
  const [manfaat, setManfaat] = useState('');
  const [caraTanam, setCaraTanam] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !species) return;
    setName(species.name);
    setCategory(species.category || 'Buah');
    setDescription(species.description || '');
    setManfaat(species.manfaat || '');
    setCaraTanam(species.cara_tanam || '');
    setPhotoUrl(species.photo_url || '');
    setIsUploading(false);
    setIsSubmitting(false);
  }, [open, species]);

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
          ...(token ? { Authorization: token } : {}),
        },
        body: formData,
      });
      const data = await res.json();
      const uploadedUrl = getUploadedPhotoUrl(data);
      if (!data.success || !uploadedUrl) {
        throw new Error(data.message || 'URL foto tidak ditemukan');
      }
      setPhotoUrl(uploadedUrl);
      toast({ title: 'Foto berhasil diunggah' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal unggah foto';
      toast({ title: 'Gagal unggah foto', description: message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!species) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/species/${species.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: token } : {}),
        },
        body: JSON.stringify({
          name,
          category,
          description,
          manfaat,
          cara_tanam: caraTanam,
          photo_url: photoUrl || null,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      toast({ title: 'Jenis tanaman berhasil diperbarui' });
      onSaved();
      onOpenChange(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan';
      toast({ title: 'Gagal', description: message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit Jenis Tanaman</DialogTitle>
          <DialogDescription>
            Perbarui data master jenis, termasuk foto yang tampil di QR dan daftar tanaman.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto Tanaman</label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {photoUrl ? (
              <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-green-200 group">
                <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                    Ganti
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-28 h-28 flex flex-col items-center justify-center gap-2 border-dashed border-2 rounded-xl text-gray-500 hover:text-green-600 hover:border-green-300 hover:bg-green-50"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? <Loader2 className="w-6 h-6 animate-spin text-green-600" /> : <ImageIcon className="w-6 h-6" />}
                <span className="text-xs">{isUploading ? 'Mengunggah...' : 'Pilih Foto'}</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Jenis *</label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-green-100 focus-visible:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-green-100 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              >
                <option value="Buah">Buah</option>
                <option value="Sayur">Sayur</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Umum</label>
            <Textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl border-green-100 focus-visible:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manfaat</label>
            <Textarea
              rows={2}
              value={manfaat}
              onChange={(e) => setManfaat(e.target.value)}
              className="rounded-xl border-green-100 focus-visible:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cara Tanam</label>
            <Textarea
              rows={2}
              value={caraTanam}
              onChange={(e) => setCaraTanam(e.target.value)}
              className="rounded-xl border-green-100 focus-visible:ring-green-500"
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="ghost" className="rounded-full" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading} className="rounded-full bg-green-600 hover:bg-green-700">
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
