import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { RefreshCw, Settings, Bell, User, ChevronDown } from 'lucide-react';
import { DashboardSettingsPanel, useDashboardSettings } from './DashboardSettings';
import { DateRangePicker } from './DateRangePicker';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

interface DashboardHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function DashboardHeader({ 
  onRefresh, 
  isRefreshing = false,
}: DashboardHeaderProps) {
  const { data: session } = useSession();
  const { settings, updateSettings } = useDashboardSettings();
  const userName = session?.user?.name || 'User';
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleDateChange = (dateRange: DateRange | undefined) => {
    if (dateRange) {
      updateSettings({ dateRange, timeRange: 'custom' });
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Welcome back, {userName}</span>
            <span>•</span>
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Date Range Picker */}
          <DateRangePicker
            date={settings.dateRange}
            onDateChange={handleDateChange}
          />
          
          {/* Notification Bell */}
          <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-status-error rounded-full"></span>
          </button>
          
          {/* Settings Panel */}
          <DashboardSettingsPanel />
          
          {/* Refresh Button with Loading State */}
          <Button
            onClick={onRefresh}
            disabled={isRefreshing}
            variant="secondary"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            <span className="hidden sm:inline">
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </span>
          </Button>
          
          {/* User Menu */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              <User className="h-5 w-5" />
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-popover rounded-lg shadow-lg border border-border py-2 z-50">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium text-popover-foreground">{userName}</p>
                  <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                </div>
                <div className="py-1">
                  <a href="/dashboard/settings" className="block px-4 py-2 text-sm text-popover-foreground hover:bg-accent">
                    Settings
                  </a>
                  <a href="/dashboard/profile" className="block px-4 py-2 text-sm text-popover-foreground hover:bg-accent">
                    Profile
                  </a>
                  <a href="/api/auth/signout" className="block px-4 py-2 text-sm text-status-error hover:bg-accent">
                    Sign Out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 