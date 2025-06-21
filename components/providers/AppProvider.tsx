'use client';

import React from 'react';
import { ApiProvider } from './ApiProvider';
import { AuthProvider } from './AuthProvider';
import { ThemeProvider } from './ThemeProvider';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ApiProvider>
      <AuthProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </AuthProvider>
    </ApiProvider>
  );
} 