'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PlantSpecies } from './types';
import { useToast } from '@/hooks/use-toast';

type SpeciesContextType = {
  species: PlantSpecies[];
  isLoading: boolean;
  refreshSpecies: () => Promise<void>;
};

const SpeciesContext = createContext<SpeciesContextType | undefined>(undefined);

export function SpeciesProvider({ children }: { children: React.ReactNode }) {
  const [species, setSpecies] = useState<PlantSpecies[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const refreshSpecies = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/species');
      const json = await res.json();
      if (json.success) {
        setSpecies(json.data);
      } else {
        throw new Error(json.message);
      }
    } catch (error: any) {
      toast({
        title: 'Gagal memuat jenis tanaman',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSpecies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SpeciesContext.Provider value={{ species, isLoading, refreshSpecies }}>
      {children}
    </SpeciesContext.Provider>
  );
}

export function useSpecies() {
  const context = useContext(SpeciesContext);
  if (context === undefined) {
    throw new Error('useSpecies must be used within a SpeciesProvider');
  }
  return context;
}