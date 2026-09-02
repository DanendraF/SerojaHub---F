'use client';

import { type ReactNode } from 'react';
import { AuthProvider } from './auth-context';
import { PlantProvider } from './plant-context';
import { SpeciesProvider } from './species-context';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SpeciesProvider>
        <PlantProvider>{children}</PlantProvider>
      </SpeciesProvider>
    </AuthProvider>
  );
}
