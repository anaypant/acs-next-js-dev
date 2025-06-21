import React from 'react';
import { Activity, Mail, LogIn, Calendar, TrendingUp, Clock } from 'lucide-react';
import type { DashboardUsage } from '@/types/dashboard';

interface UsageOverviewProps {
  usage: DashboardUsage;
  className?: string;
}

export function UsageOverview({ usage, className }: UsageOverviewProps) {
  // Calculate additional usage metrics
  const calculateUsageMetrics = () => {
    const emailsPerDay = usage.activeDays > 0 ? Math.round(usage.emailsSent / usage.activeDays) : 0;
    const loginFrequency = usage.activeDays > 0 ? Math.round(usage.logins / usage.activeDays) : 0;
    const activityRate = usage.activeDays > 0 ? Math.round((usage.activeDays / 30) * 100) : 0;

    return {
      emailsPerDay,
      loginFrequency,
      activityRate
    };
  };

  const metrics = calculateUsageMetrics();

  const UsageCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    color, 
    trend 
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    color: string;
    trend?: 'up' | 'down' | 'stable';
  }) => {
    const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500';
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingUp : Clock;

    return (
      <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <Icon className={`h-5 w-5 ${color}`} />
          {trend && (
            <div className={`flex items-center text-xs ${trendColor}`}>
              <TrendIcon className={`h-3 w-3 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
              <span className="capitalize">{trend}</span>
            </div>
          )}
        </div>
        <p className="text-2xl font-bold text-[#0e6537]">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200/80 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Activity className="h-5 w-5 mr-3 text-[#0e6537]" />
        Usage Overview
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <UsageCard
          title="Emails Sent"
          value={usage.emailsSent}
          subtitle={`${metrics.emailsPerDay} per day`}
          icon={Mail}
          color="text-blue-600"
          trend="up"
        />
        <UsageCard
          title="Logins This Month"
          value={usage.logins}
          subtitle={`${metrics.loginFrequency} per day`}
          icon={LogIn}
          color="text-green-600"
          trend="up"
        />
        <UsageCard
          title="Active Days"
          value={usage.activeDays}
          subtitle={`${metrics.activityRate}% activity rate`}
          icon={Calendar}
          color="text-purple-600"
          trend="stable"
        />
      </div>

      {/* Usage Insights */}
      <div className="bg-gradient-to-r from-[#0e6537]/5 to-emerald-500/5 rounded-lg p-4 border border-[#0e6537]/10">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Usage Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">
              {metrics.activityRate >= 70 ? 'Excellent' : metrics.activityRate >= 50 ? 'Good' : 'Needs improvement'} activity level
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">
              {metrics.emailsPerDay >= 10 ? 'High' : metrics.emailsPerDay >= 5 ? 'Moderate' : 'Low'} email engagement
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">
              {metrics.loginFrequency >= 5 ? 'Frequent' : metrics.loginFrequency >= 2 ? 'Regular' : 'Occasional'} platform usage
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 