'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isSameDay, parseISO, startOfDay, format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarDays, Sprout } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import type { Plant } from '@/lib/types';

type DayKind = 'tanam' | 'panen';

type DayEvent = {
  plant: Plant;
  kind: DayKind;
};

function toDay(iso: string) {
  return startOfDay(parseISO(iso));
}

function eventsOnDate(plants: Plant[], date: Date): DayEvent[] {
  return plants.flatMap((plant) => {
    const events: DayEvent[] = [];
    if (isSameDay(toDay(plant.planting_date), date)) {
      events.push({ plant, kind: 'tanam' });
    }
    if (isSameDay(toDay(plant.estimated_harvest_date), date)) {
      events.push({ plant, kind: 'panen' });
    }
    return events;
  });
}

export function GardenCalendar({ plants }: { plants: Plant[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Date>(startOfDay(new Date()));
  const [month, setMonth] = useState<Date>(startOfDay(new Date()));

  const { tanamDays, panenDays, bothDays } = useMemo(() => {
    const tanamMap = new Map<string, Date>();
    const panenMap = new Map<string, Date>();

    plants.forEach((plant) => {
      const tanam = toDay(plant.planting_date);
      const panen = toDay(plant.estimated_harvest_date);
      tanamMap.set(tanam.toDateString(), tanam);
      panenMap.set(panen.toDateString(), panen);
    });

    const both: Date[] = [];
    const tanamOnly: Date[] = [];
    const panenOnly: Date[] = [];

    tanamMap.forEach((date, key) => {
      if (panenMap.has(key)) both.push(date);
      else tanamOnly.push(date);
    });
    panenMap.forEach((date, key) => {
      if (!tanamMap.has(key)) panenOnly.push(date);
    });

    return { tanamDays: tanamOnly, panenDays: panenOnly, bothDays: both };
  }, [plants]);

  const dayEvents = eventsOnDate(plants, selected);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-1 border-b border-border px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold">Kalender Kebun</h2>
          <p className="text-xs text-muted-foreground">
            Lihat kapan tanaman ditanam dan perkiraan panen
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-medium">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Tanggal tanam
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            Perkiraan panen
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-amber-500" />
            Keduanya
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-5">
        <div className="flex justify-center border-b border-border p-3 lg:col-span-3 lg:border-b-0 lg:border-r">
          <Calendar
            locale={id}
            mode="single"
            month={month}
            onMonthChange={setMonth}
            selected={selected}
            onSelect={(date) => date && setSelected(startOfDay(date))}
            modifiers={{
              tanam: tanamDays,
              panen: panenDays,
              both: bothDays,
            }}
            modifiersClassNames={{
              tanam: 'bg-emerald-100 text-emerald-800 font-semibold hover:bg-emerald-200',
              panen: 'bg-amber-100 text-amber-800 font-semibold hover:bg-amber-200',
              both: 'bg-gradient-to-br from-emerald-100 to-amber-100 text-stone-800 font-semibold',
            }}
            className="p-1"
          />
        </div>

        <div className="lg:col-span-2">
          <div className="border-b border-border px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Kegiatan
            </p>
            <p className="text-sm font-bold capitalize">
              {format(selected, 'EEEE, d MMMM yyyy', { locale: id })}
            </p>
          </div>

          {dayEvents.length > 0 ? (
            <div className="divide-y divide-border/60">
              {dayEvents.map(({ plant, kind }) => (
                <button
                  key={`${plant.id}-${kind}`}
                  onClick={() => router.push(`/tanaman/${plant.id}`)}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-muted/40"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      kind === 'tanam' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {kind === 'tanam' ? <Sprout className="h-4 w-4" /> : <CalendarDays className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{plant.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {kind === 'tanam' ? 'Ditanam' : 'Perkiraan panen'}
                      {plant.lokasi_bedeng ? ` · ${plant.lokasi_bedeng}` : ''}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
              <CalendarDays className="h-8 w-8 text-muted-foreground/40" />
              <p className="mt-2 text-sm font-medium text-muted-foreground">Tidak ada jadwal di hari ini</p>
              <p className="mt-0.5 text-xs text-muted-foreground/70">
                Tanggal berwarna di kalender menandai tanam atau panen.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
