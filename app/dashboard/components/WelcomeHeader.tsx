import React from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  Sun,
  Moon,
  Coffee,
  Users,
  Target
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface WelcomeHeaderProps {
  activeLeads?: number;
  newMessages?: number;
  conversionRate?: number;
}

export function WelcomeHeader({ 
  activeLeads = 0, 
  newMessages = 0, 
  conversionRate = 0 
}: WelcomeHeaderProps) {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'User';
  
  // Time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { greeting: 'Good morning', icon: <Sun className="h-5 w-5" /> };
    if (hour < 17) return { greeting: 'Good afternoon', icon: <Coffee className="h-5 w-5" /> };
    return { greeting: 'Good evening', icon: <Moon className="h-5 w-5" /> };
  };

  const { greeting, icon } = getTimeBasedGreeting();
  const currentDate = format(new Date(), 'EEEE, MMMM do, yyyy');

  return (
    <div className="mb-8 p-8 rounded-2xl bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 shadow-xl border border-emerald-400/20">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            {icon}
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              {greeting}, {userName}!
            </h1>
          </div>
          <p className="text-xl text-emerald-100 mb-2">
            Here's your real estate performance snapshot for today
          </p>
          <p className="text-emerald-200 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {currentDate}
          </p>
        </div>
        
        <div className="mt-6 lg:mt-0 lg:ml-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
              <div className="text-2xl font-bold text-white">{activeLeads}</div>
              <div className="text-sm text-emerald-100">Active Leads</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
              <div className="text-2xl font-bold text-white">{newMessages}</div>
              <div className="text-sm text-emerald-100">New Messages</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20 lg:col-span-1 col-span-2">
              <div className="text-2xl font-bold text-white">{conversionRate.toFixed(1)}%</div>
              <div className="text-sm text-emerald-100">Conversion Rate</div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/dashboard/conversations">
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                View Messages
              </Button>
            </Link>
            <Link href="/dashboard/calendar">
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Viewing
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 