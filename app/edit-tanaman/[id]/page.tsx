'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Leaf, Pencil } from 'lucide-react';
import { AdminShell } from '@/components/admin-shell';
import { usePlants } from '@/lib/plant-context';
import { PlantForm } from '@/components/plant-form';
import { Button } from '@/components/ui/button';

export default function EditTanamanPage() {
  const { getPlant } = usePlants();
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const plant = getPlant(params.id);

  if (!plant) {
    return (
      <AdminShell>
        <div className="py-20 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <Leaf className="h-8 w-8" />
          </span>
          <h1 className="mt-4 text-2xl font-bold">Tanaman tidak ditemukan</h1>
          <Button
            className="mt-6 h-14 px-8 text-lg"
            onClick={() => router.push('/data-tanaman')}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Kembali ke Data Tanaman
          </Button>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-primary">
            <Pencil className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-primary">Ubah Tanaman</h1>
            <p className="mt-0.5 text-lg text-muted-foreground">
              Perbarui informasi &quot;{plant.name}&quot;
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <PlantForm mode="edit" existingPlant={plant} />
      </div>
    </AdminShell>
  );
}
