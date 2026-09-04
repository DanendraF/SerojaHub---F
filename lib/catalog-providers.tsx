'use client';

import { type ReactNode } from 'react';
import { PlantProvider } from './plant-context';
import { SpeciesProvider } from './species-context';

export function CatalogProviders({ children }: { children: ReactNode }) {
  return (
    <SpeciesProvider>
      <PlantProvider>{children}</PlantProvider>
    </SpeciesProvider>
  );
}
