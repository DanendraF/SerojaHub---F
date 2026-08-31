'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from './auth-context';
import type { Plant } from './types';
import { useToast } from '@/hooks/use-toast';

type PlantContextState = {
  plants: Plant[];
  isLoading: boolean;
  getPlant: (id: string) => Plant | undefined;
  addPlant: (plant: Partial<Plant>) => Promise<Plant>;
  updatePlant: (id: string, data: Partial<Plant>) => Promise<Plant>;
  deletePlant: (id: string) => Promise<void>;
  refreshPlants: () => Promise<void>;
};

const PlantContext = createContext<PlantContextState | null>(null);

const API_URL = '/api';

export function PlantProvider({ children }: { children: ReactNode }) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();
  const { toast } = useToast();

  const fetchPlants = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/plants`);
      const json = await res.json();
      if (json.success) {
        setPlants(json.data);
      }
    } catch (error) {
      console.error('Failed to fetch plants:', error);
      toast({ title: 'Gagal mengambil data tanaman', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  const getPlant = useCallback(
    (id: string) => plants.find((p) => p.id === id),
    [plants]
  );

  const getHeaders = useCallback(() => {
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {}),
    };
  }, [token]);

  const addPlant = useCallback(async (data: Partial<Plant>) => {
    const res = await fetch(`${API_URL}/plants`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Gagal menambah tanaman');
    
    setPlants((prev) => [json.data, ...prev]);
    return json.data;
  }, [getHeaders]);

  const updatePlant = useCallback(async (id: string, data: Partial<Plant>) => {
    const res = await fetch(`${API_URL}/plants/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Gagal memperbarui tanaman');
    
    setPlants((prev) => prev.map((p) => (p.id === id ? json.data : p)));
    return json.data;
  }, [getHeaders]);

  const deletePlant = useCallback(async (id: string) => {
    const res = await fetch(`${API_URL}/plants/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.message || 'Gagal menghapus tanaman');
    }
    
    setPlants((prev) => prev.filter((p) => p.id !== id));
  }, [getHeaders]);

  return (
    <PlantContext.Provider
      value={{ plants, isLoading, getPlant, addPlant, updatePlant, deletePlant, refreshPlants: fetchPlants }}
    >
      {children}
    </PlantContext.Provider>
  );
}

export function usePlants() {
  const ctx = useContext(PlantContext);
  if (!ctx) throw new Error('usePlants must be used within PlantProvider');
  return ctx;
}
