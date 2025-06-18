/**
 * File: app/dashboard/layout.tsx
 * Purpose: Dashboard layout wrapper with ThreadsProvider context
 * Author: Alejo Cagliolo
 * Date: 06/11/25
 * Version: 1.0.0
 */

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { Session } from 'next-auth';
import { ConversationsProvider } from './lib/conversations-context';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession() as { data: Session | null, status: string };
  const router = useRouter();
  
  // Session check - redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0e6537] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (status === 'unauthenticated') {
    return null;
  }
  
  return (
    <ConversationsProvider>
      {children}
    </ConversationsProvider>
  );
} 