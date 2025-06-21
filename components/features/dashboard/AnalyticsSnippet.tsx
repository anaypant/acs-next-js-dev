'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Users, DollarSign, BarChart3, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// ACS Brand Colors
const ACS_COLORS = {
  primary: '#0e6537',
  secondary: '#157a42',
  accent: '#2a5f4f',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  light: '#f0fdf4',
  dark: '#064e3b'
};

interface AnalyticsSnippetProps {
  data: {
    totalLeads: number;
    conversionRate: number;
    activeConversations: number;
    avgResponseTime: number;
  };
  className?: string;
}

const iconMap = {
  'Total Leads': Users,
  'Conversion Rate': DollarSign,
  'Active Leads': BarChart3,
  'Avg. Response Time': Clock,
};

export function AnalyticsSnippet({ data, className }: AnalyticsSnippetProps) {
  const metrics = [
    {
      title: 'Total Leads',
      value: data.totalLeads,
      icon: Users,
      color: ACS_COLORS.primary,
      trend: '+12%',
      trendDirection: 'up' as const
    },
    {
      title: 'Conversion Rate',
      value: `${data.conversionRate.toFixed(1)}%`,
      icon: DollarSign,
      color: ACS_COLORS.success,
      trend: '+5.2%',
      trendDirection: 'up' as const
    },
    {
      title: 'Active Leads',
      value: data.activeConversations,
      icon: BarChart3,
      color: ACS_COLORS.info,
      trend: '+8%',
      trendDirection: 'up' as const
    },
    {
      title: 'Avg. Response Time',
      value: `${data.avgResponseTime}min`,
      icon: Clock,
      color: ACS_COLORS.warning,
      trend: '-15%',
      trendDirection: 'down' as const
    }
  ];

  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 shadow-sm p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Analytics Overview</h3>
          <p className="text-sm text-gray-500">Key performance metrics at a glance</p>
        </div>
        <Link 
          href="/dashboard/analytics"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#2a5f4f] transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <span className="text-sm font-medium">View Full Analytics</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trendDirection === 'up' ? TrendingUp : TrendingDown;
          const trendColor = metric.trendDirection === 'up' ? 'text-green-600' : 'text-red-600';

          return (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${metric.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: metric.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium">{metric.title}</p>
                  <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <TrendIcon className={`w-3 h-3 ${trendColor}`} />
                <span className={`text-xs font-medium ${trendColor}`}>{metric.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-600 font-medium">All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  );
} 