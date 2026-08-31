'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarDays,
  ChevronDown,
  FileText,
  ImagePlus,
  Leaf,
  Loader2,
  MapPin,
  Save,
  Sparkles,
  X,
} from 'lucide-react';
import { usePlants } from '@/lib/plant-context';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { Plant } from '@/lib/types';

const JENIS_TANAMAN = [
  { value: 'Buah', label: '🍎 Buah', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'Sayur', label: '🥬 Sayur', color: 'bg-green-100 text-green-700 border-green-200' },
];

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
      {error && (
        <p className="flex items-center gap-1.5 text-sm font-medium text-destructive">
          <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
          {error}
        </p>
      )}
    </div>
  );
}

export function PlantForm({ mode, existingPlant }: PlantFormProps) {
  const { addPlant, updatePlant } = usePlants();
  const router = useRouter();
  const { toast } = useToast();
  const { token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState(existingPlant?.name ?? '');
  const [type, setType] = useState(existingPlant?.type ?? '');
  const [lokasi, setLokasi] = useState(existingPlant?.lokasi_bedeng ?? '');
  const [plantingDate, setPlantingDate] = useState(
    existingPlant?.planting_date ? existingPlant.planting_date.split('T')[0] : '',
  );
  const [harvestDate, setHarvestDate] = useState(
    existingPlant?.estimated_harvest_date ? existingPlant.estimated_harvest_date.split('T')[0] : '',
  );
  const [description, setDescription] = useState(existingPlant?.description ?? '');
  const [benefits, setBenefits] = useState(existingPlant?.manfaat ?? '');
  const [photoUrl, setPhotoUrl] = useState(existingPlant?.photo_url ?? '');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setPhotoUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Nama tanaman wajib diisi.';
    if (!type) errs.type = 'Jenis tanaman wajib dipilih.';
    if (!plantingDate) errs.plantingDate = 'Tanggal tanam wajib diisi.';
    if (!harvestDate) errs.harvestDate = 'Perkiraan panen wajib diisi.';
    if (!photoUrl && !photoFile) errs.photo = 'Foto tanaman wajib diunggah.';
    if (!description.trim()) errs.description = 'Deskripsi wajib diisi.';
    if (!benefits.trim()) errs.benefits = 'Manfaat wajib diisi.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${apiUrl}/upload/photo`, {
      method: 'POST',
      headers: { ...(token ? { Authorization: token } : {}) },
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Gagal mengunggah foto');
    return result.data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({ title: 'Form belum lengkap', description: 'Mohon lengkapi semua kolom yang wajib diisi.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      let finalPhotoUrl = photoUrl;
      if (photoFile) finalPhotoUrl = await uploadPhoto(photoFile);

      const data = {
        name: name.trim(),
        type,
        lokasi_bedeng: lokasi.trim() || undefined,
        planting_date: plantingDate,
        estimated_harvest_date: harvestDate,
        photo_url: finalPhotoUrl,
        description: description.trim(),
        manfaat: benefits.trim(),
      };

      if (mode === 'add') {
        const newPlant = await addPlant(data);
        toast({ title: '🌱 Tanaman ditambahkan!', description: `"${newPlant.name}" berhasil didaftarkan ke kebun.` });
        router.push(`/qr/${newPlant.id}`);
      } else if (existingPlant) {
        await updatePlant(existingPlant.id, data);
        toast({ title: '✅ Tanaman diperbarui!', description: `"${data.name}" telah berhasil diperbarui.` });
        router.push('/data-tanaman');
      }
    } catch (error: any) {
      toast({ title: 'Terjadi kesalahan', description: error.message || 'Gagal menyimpan data tanaman.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedJenis = JENIS_TANAMAN.find((j) => j.value === type);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── FOTO ─────────────────────────────────────── */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ImagePlus className="h-4 w-4" />
            </span>
            <h2 className="font-bold text-foreground">Foto Tanaman</h2>
          </div>
        </div>
        <div className="p-6">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
          {photoUrl ? (
            <div className="group relative overflow-hidden rounded-2xl border border-border">
              <img src={photoUrl} alt="Pratinjau" className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <Badge className="bg-black/60 text-white border-0">Pratinjau Foto</Badge>
              </div>
              <button
                type="button"
                onClick={() => { setPhotoUrl(''); setPhotoFile(null); }}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-destructive text-white shadow-lg transition-all hover:scale-110"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-3 right-3 rounded-xl bg-white/90 px-3 py-1.5 text-sm font-semibold text-foreground shadow hover:bg-white"
              >
                Ganti Foto
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex h-52 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-all ${
                errors.photo ? 'border-destructive bg-destructive/5' : 'border-border bg-muted/20 hover:border-primary hover:bg-primary/5'
              }`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ImagePlus className="h-7 w-7" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">Klik untuk unggah foto</p>
                <p className="text-sm text-muted-foreground">JPG, PNG, WebP · Maks 5MB</p>
              </div>
            </button>
          )}
          {errors.photo && <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-destructive"><span className="h-1.5 w-1.5 rounded-full bg-destructive" />{errors.photo}</p>}
        </div>
      </div>

      {/* ── INFORMASI DASAR ───────────────────────────── */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Leaf className="h-4 w-4" />
            </span>
            <h2 className="font-bold text-foreground">Informasi Tanaman</h2>
          </div>
        </div>
        <div className="space-y-5 p-6">
          <FieldGroup label="Nama Tanaman" error={errors.name}>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Tomat Ceri, Cabai Rawit..."
              className={`h-12 rounded-xl transition-all ${errors.name ? 'border-destructive' : ''}`}
            />
          </FieldGroup>

          {/* DROPDOWN JENIS */}
          <FieldGroup label="Jenis Tanaman" error={errors.type}>
            <div className="grid grid-cols-2 gap-3">
              {JENIS_TANAMAN.map((jenis) => (
                <button
                  key={jenis.value}
                  type="button"
                  onClick={() => setType(jenis.value)}
                  className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 font-semibold transition-all ${
                    type === jenis.value
                      ? 'border-primary bg-primary/10 text-primary shadow-sm'
                      : 'border-border bg-muted/20 text-muted-foreground hover:border-primary/50 hover:bg-muted/40'
                  }`}
                >
                  <span className="text-xl">{jenis.label.split(' ')[0]}</span>
                  <span>{jenis.label.split(' ')[1]}</span>
                  {type === jenis.value && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </FieldGroup>

          <FieldGroup label="Lokasi Bedeng (Opsional)">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                placeholder="Contoh: Bedeng A, Area Pot Selatan..."
                className="h-12 rounded-xl pl-10"
              />
            </div>
          </FieldGroup>
        </div>
      </div>

      {/* ── TANGGAL ───────────────────────────────────── */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarDays className="h-4 w-4" />
            </span>
            <h2 className="font-bold text-foreground">Jadwal Tanam & Panen</h2>
          </div>
        </div>
        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <FieldGroup label="Tanggal Tanam" error={errors.plantingDate}>
            <Input
              type="date"
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
              className={`h-12 rounded-xl ${errors.plantingDate ? 'border-destructive' : ''}`}
            />
          </FieldGroup>
          <FieldGroup label="Perkiraan Panen" error={errors.harvestDate}>
            <Input
              type="date"
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              className={`h-12 rounded-xl ${errors.harvestDate ? 'border-destructive' : ''}`}
            />
          </FieldGroup>
        </div>
      </div>

      {/* ── DESKRIPSI & MANFAAT ───────────────────────── */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-4 w-4" />
            </span>
            <h2 className="font-bold text-foreground">Deskripsi & Manfaat</h2>
          </div>
        </div>
        <div className="space-y-5 p-6">
          <FieldGroup label="Deskripsi Singkat" error={errors.description}>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan kondisi tanaman, cara budidaya, atau info menarik lainnya..."
              className={`min-h-[110px] rounded-xl resize-none ${errors.description ? 'border-destructive' : ''}`}
            />
          </FieldGroup>
          <FieldGroup label="Manfaat untuk Kesehatan" error={errors.benefits}>
            <Textarea
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              placeholder="Kandungan gizi, khasiat, atau manfaat tanaman ini..."
              className={`min-h-[110px] rounded-xl resize-none ${errors.benefits ? 'border-destructive' : ''}`}
            />
          </FieldGroup>
        </div>
      </div>

      {/* ── ACTION BUTTONS ────────────────────────────── */}
      <div className="sticky bottom-4 z-10 flex gap-3 rounded-2xl border border-border bg-card/95 p-3 shadow-md backdrop-blur-sm sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="h-12 flex-1 rounded-xl sm:flex-none sm:px-8"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Batal
        </Button>
        <Button
          type="submit"
          size="lg"
          className="h-12 flex-1 rounded-xl sm:flex-none sm:px-8"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {mode === 'add' ? 'Daftarkan Tanaman' : 'Simpan Perubahan'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
