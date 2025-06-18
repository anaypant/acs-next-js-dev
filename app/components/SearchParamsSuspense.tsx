'use client';

import React, { Suspense } from 'react';

interface SearchParamsSuspenseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SearchParamsSuspense({ 
  children, 
  fallback = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  ) 
}: SearchParamsSuspenseProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
} 