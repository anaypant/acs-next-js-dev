/**
 * File: app/dashboard/layout.tsx
 * Purpose: Dashboard layout wrapper with ThreadsProvider context
 * Author: Alejo Cagliolo
 * Date: 06/11/25
 * Version: 1.0.0
 */

'use client';

import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession() as { data: Session | null };
  
  return (
    <>
      {children}
    </>
  );
} 