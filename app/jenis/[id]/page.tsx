import Link from 'next/link';
import { SiteHeader } from '@/components/site-header';
import { notFound } from 'next/navigation';
import { MapPin, Calendar, Clock, Sprout } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Fungsi bantuan untuk mengambil data spesies dari backend
async function getSpecies(id: string) {
  // Dalam Server Component (terutama di Vercel), panggil API_URL langsung
  const baseUrl = process.env.API_URL || 'http://localhost:5000/api';
  
  try {
    const res = await fetch(`${baseUrl}/species/${id}`, {
      // Revalidate setiap 60 detik (ISR) agar data cukup fresh tapi tak bebani backend
      next: { revalidate: 60 }
    });
    
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (e) {
    console.error('Failed to fetch species:', e);
    return null;
  }
}

export default async function PublicJenisTanamanPage({ params }: { params: { id: string } }) {
  const species = await getSpecies(params.id);

  if (!species) notFound();

  // Filter hanya bedeng yang aktif (Tumbuh atau Siap Panen)
  const activePlants = (species.plants || []).filter(
    (p: any) => p.status === 'TUMBUH' || p.status === 'SIAP_PANEN'
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 pb-12">
        {/* Hero Section */}
        <div className="relative h-64 md:h-80 w-full bg-green-900 overflow-hidden">
          {species.photo_url ? (
            <img 
              src={species.photo_url} 
              alt={species.name} 
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-700 via-green-900 to-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
            <div className="max-w-4xl mx-auto flex items-end justify-between">
              <div>
                <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-green-900 bg-green-100 rounded-full shadow-sm">
                  {species.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 drop-shadow-md">
                  {species.name}
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info Column */}
          <div className="md:col-span-2 space-y-6">
            {(species.description || species.manfaat || species.cara_tanam) && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                {species.description && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <Sprout className="w-5 h-5 text-green-600" /> Tentang
                    </h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{species.description}</p>
                  </div>
                )}
                {species.manfaat && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Manfaat</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{species.manfaat}</p>
                  </div>
                )}
                {species.cara_tanam && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Cara Tanam</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{species.cara_tanam}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Beds Column */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 border border-green-100">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" /> Titik Tanam Aktif
              </h3>
              
              {activePlants.length === 0 ? (
                <p className="text-sm text-green-700/70">Saat ini tidak ada bedeng aktif yang menanam {species.name}.</p>
              ) : (
                <div className="space-y-4">
                  {activePlants.map((p: any) => (
                    <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm border border-green-50">
                      <div className="font-semibold text-gray-800 mb-1">{p.lokasi_bedeng || 'Bedeng Umum'}</div>
                      <div className="text-xs text-gray-500 flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          Ditaman: {format(new Date(p.planting_date), 'd MMM yyyy', { locale: id })}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-orange-500" />
                          Panen: {format(new Date(p.estimated_harvest_date), 'd MMM yyyy', { locale: id })}
                        </div>
                      </div>
                      {p.status === 'SIAP_PANEN' && (
                        <div className="mt-3 text-[10px] uppercase font-bold tracking-wider bg-orange-100 text-orange-700 px-2 py-1 rounded w-fit">
                          Siap Panen!
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}