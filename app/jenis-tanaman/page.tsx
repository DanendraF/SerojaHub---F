'use client';

import { AdminShell } from '@/components/admin-shell';
import { SpeciesFormDialog } from '@/components/species-form-dialog';
import { useSpecies } from '@/lib/species-context';
import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, QrCode } from 'lucide-react';
import Link from 'next/link';
import type { PlantSpecies } from '@/lib/types';

export default function JenisTanamanPage() {
  const { species, isLoading, refreshSpecies } = useSpecies();
  const { isLoggedIn, token } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState<PlantSpecies | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/masuk');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return <div className="p-8 text-center text-green-700">Memuat...</div>;

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus jenis tanaman ${name}?`)) return;

    try {
      const res = await fetch(`/api/species/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: token } : {}),
        },
      });
      if (res.ok) {
        refreshSpecies();
      } else {
        const err = await res.json();
        alert('Gagal: ' + err.message);
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Terjadi kesalahan';
      alert('Error: ' + message);
    }
  };

  return (
    <AdminShell>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-900">Kelola Jenis Tanaman</h1>
        <Link href="/tambah-jenis">
          <Button className="bg-green-600 hover:bg-green-700 rounded-full">
            <Plus className="mr-2 h-4 w-4" /> Tambah Jenis Baru
          </Button>
        </Link>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-green-100 overflow-hidden">
        <div className="p-6">
          <p className="text-gray-500 mb-6">
            Jenis tanaman digunakan sebagai kategori utama. Satu jenis tanaman (misal: &quot;Terong&quot;) memiliki 1 QR Code, yang akan menampilkan semua bedeng tempat terong ditanam.
          </p>

          {isLoading ? (
            <div className="text-center py-12 text-green-600">Memuat data jenis...</div>
          ) : species.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-green-50/50 rounded-xl">
              Belum ada jenis tanaman. Silakan tambah baru.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {species.map((s) => (
                <div key={s.id} className="border border-green-100 rounded-xl p-4 bg-white flex flex-col hover:border-green-300 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    {s.photo_url ? (
                      <img src={s.photo_url} alt={s.name} className="w-12 h-12 rounded-lg object-cover bg-green-50" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-700 text-xl font-bold">
                        {s.name[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-800">{s.name}</h3>
                      <div className="flex gap-2 text-xs">
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                          {s.category}
                        </span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                          {s._count?.plants || 0} Bedeng
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between">
                    <Link href={`/qr/jenis/${s.id}`}>
                      <Button variant="outline" size="sm" className="h-8 rounded-full border-green-200 text-green-700 hover:bg-green-50">
                        <QrCode className="h-4 w-4 mr-1" /> QR
                      </Button>
                    </Link>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditing(s)}
                        className="h-8 w-8 p-0 rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(s.id, s.name)}
                        className="h-8 w-8 p-0 rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <SpeciesFormDialog
        open={!!editing}
        species={editing}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
        onSaved={refreshSpecies}
      />
    </AdminShell>
  );
}
