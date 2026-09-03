'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarDays,
  FileText,
  ImagePlus,
  Loader2,
  MapPin,
  Save,
  X,
  Database
} from 'lucide-react';
import { usePlants } from '@/lib/plant-context';
import { useSpecies } from '@/lib/species-context';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Plant } from '@/lib/types';

type PlantFormProps = {
  mode: 'add' | 'edit';
  existingPlant?: Plant;
};

function FieldGroup({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function PlantForm({ mode, existingPlant }: PlantFormProps) {
  const router = useRouter();
  const { refreshPlants } = usePlants();
  const { species } = useSpecies();
  const { isLoggedIn, token } = useAuth();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(existingPlant?.photo_url || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: existingPlant?.name || '',
    speciesId: existingPlant?.speciesId || '',
    type: existingPlant?.type || 'Sayur',
    lokasi_bedeng: existingPlant?.lokasi_bedeng || '',
    planting_date: existingPlant?.planting_date ? new Date(existingPlant.planting_date).toISOString().split('T')[0] : '',
    estimated_harvest_date: existingPlant?.estimated_harvest_date ? new Date(existingPlant.estimated_harvest_date).toISOString().split('T')[0] : '',
    description: existingPlant?.description || '',
    cara_tanam: existingPlant?.cara_tanam || '',
    manfaat: existingPlant?.manfaat || '',
    catatan_pengelola: existingPlant?.catatan_pengelola || '',
  });

  const handleSpeciesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sId = e.target.value;
    const s = species.find(x => x.id === sId);
    if (s) {
      setFormData({ ...formData, speciesId: sId, type: s.category, name: s.name });
    } else {
      setFormData({ ...formData, speciesId: '' });
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isLoggedIn) return;

    setIsUploading(true);
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch('/api/upload/photo', {
        method: 'POST',
        headers: { 'Authorization': `Basic ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        setPhotoUrl(data.url);
        toast({ title: 'Foto diunggah' });
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      toast({ title: 'Gagal', description: err.message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return;
    setIsSubmitting(true);

    try {
      const url = mode === 'edit' ? `/api/plants/${existingPlant?.id}` : '/api/plants';
      const method = mode === 'edit' ? 'PUT' : 'POST';
      
      const payload = { ...formData, photo_url: photoUrl };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: `Berhasil ${mode === 'edit' ? 'mengubah' : 'menambah'} bedeng tanaman` });
        refreshPlants();
        router.push('/data-tanaman');
      } else {
        throw new Error(data.message || 'Terjadi kesalahan');
      }
    } catch (err: any) {
      toast({ title: 'Gagal', description: err.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Photo Section */}
      <div className="bg-muted/30 border border-border/50 rounded-2xl p-6">
        <FieldGroup label="Foto Bedeng (Opsional)">
          <div className="mt-3 flex items-start gap-6">
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            
            <div className="relative group overflow-hidden bg-background border-2 border-dashed border-muted-foreground/20 rounded-2xl w-32 h-32 flex-shrink-0 transition-colors hover:border-primary/50">
              {photoUrl ? (
                <>
                  <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button type="button" variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20" onClick={handleUploadClick}>
                      Ganti
                    </Button>
                  </div>
                  <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setPhotoUrl('')}>
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <button type="button" onClick={handleUploadClick} disabled={isUploading} className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50">
                  {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
                  <span className="text-xs font-medium">{isUploading ? 'Mengunggah...' : 'Pilih Foto'}</span>
                </button>
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Tambahkan foto khusus bedeng ini jika ada.
            </div>
          </div>
        </FieldGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <FieldGroup label="Pilih Jenis Tanaman">
            <div className="relative">
              <Database className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <select 
                required 
                value={formData.speciesId} 
                onChange={handleSpeciesChange}
                className="w-full pl-10 pr-4 py-2 border rounded-xl bg-background"
              >
                <option value="" disabled>-- Pilih Jenis --</option>
                {species.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Pilih dari Master Jenis Tanaman. Belum ada? Tambahkan di menu Jenis Tanaman.</p>
          </FieldGroup>

          <FieldGroup label="Lokasi Bedeng">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Contoh: Bedeng A1, Polybag Timur"
                value={formData.lokasi_bedeng}
                onChange={e => setFormData({ ...formData, lokasi_bedeng: e.target.value })}
                className="pl-10 rounded-xl"
              />
            </div>
          </FieldGroup>
        </div>

        <div className="space-y-6">
          <FieldGroup label="Tanggal Tanam">
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="date"
                required
                value={formData.planting_date}
                onChange={e => setFormData({ ...formData, planting_date: e.target.value })}
                className="pl-10 rounded-xl"
              />
            </div>
          </FieldGroup>

          <FieldGroup label="Perkiraan Panen">
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="date"
                required
                value={formData.estimated_harvest_date}
                onChange={e => setFormData({ ...formData, estimated_harvest_date: e.target.value })}
                className="pl-10 rounded-xl"
              />
            </div>
          </FieldGroup>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-border">
        <FieldGroup label="Catatan Pengelola">
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Textarea
              placeholder="Catatan internal mengenai pertumbuhan, hama, atau kondisi bedeng..."
              value={formData.catatan_pengelola}
              onChange={e => setFormData({ ...formData, catatan_pengelola: e.target.value })}
              className="pl-10 min-h-[100px] rounded-xl"
            />
          </div>
        </FieldGroup>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
        <Button type="button" variant="ghost" className="rounded-full" onClick={() => router.back()}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting || !formData.speciesId} className="rounded-full bg-primary hover:bg-primary/90 min-w-[140px]">
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {mode === 'edit' ? 'Simpan' : 'Tambahkan'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}