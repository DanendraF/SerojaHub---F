'use client';

import { type ReactNode } from 'react';
import { AuthProvider } from './auth-context';
import { PlantProvider } from './plant-context';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <PlantProvider>{children}</PlantProvider>
    </AuthProvider>
  );
}
