'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { AdminShell } from '@/components/admin-shell';
import { PlantForm } from '@/components/plant-form';

export default function TambahTanamanPage() {
  const router = useRouter();

  return (
    <AdminShell>
      <div>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Plus className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-primary">Tambah Tanaman</h1>
            <p className="mt-0.5 text-lg text-muted-foreground">
              Daftarkan tanaman baru di Kebun Seroja
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <PlantForm mode="add" />
      </div>
    </AdminShell>
  );
}
