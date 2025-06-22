/**
 * File: app/dashboard/layout.tsx
 * Purpose: Dashboard layout wrapper with ThreadsProvider context
 * Author: Alejo Cagliolo
 * Date: 06/11/25
 * Version: 1.0.0
 */

'use client';

import AuthGuard from '@/components/features/auth/AuthGuard';
import DashboardLayout from '@/components/common/Layout/DashboardLayout';
import { ConversationsProvider } from './lib/conversations-context';
import React from 'react';

export default function ProtectedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <ConversationsProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </ConversationsProvider>
    </AuthGuard>
  );
} 