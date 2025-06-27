'use client';

import { SidebarProvider, AppSidebar, useSidebar } from '@/app/dashboard/components/Sidebar';
import { LayoutContent } from './LayoutContainer';
import { MobileSidebarOverlay } from '../Navigation/MobileSidebarOverlay';
import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen max-h-screen bg-background overflow-hidden">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 max-h-screen overflow-hidden">
          {children}
        </main>
      </div>
      <MobileSidebarOverlay>
        <AppSidebar />
      </MobileSidebarOverlay>
    </SidebarProvider>
  );
};

export default DashboardLayout; 