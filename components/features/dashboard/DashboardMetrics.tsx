import React from 'react';
import { TrendingUp, TrendingDown, Users, MessageSquare, Target, Clock, DollarSign, Activity, Zap, Calendar } from 'lucide-react';
import type { DashboardMetrics as Metrics } from '@/types/dashboard';
import { calculateTrends, shouldShowTrend, formatTrendChange, getTrendDirection, type TrendData } from '@/lib/utils/dashboard';
import type { DateRange } from './DateRangePicker';

interface DashboardMetricsProps {
  data: Metrics;
  dateRange?: DateRange;
  conversations?: any[]; // Add conversations for trend calculation
}

const MetricCard = ({ 
  name, 
  value, 
  icon: Icon, 
  color, 
  bgColor, 
  change, 
  changeType, 
  subtitle,
  trend,
  showTrend = true
}: { 
  name: string; 
  value: string | number; 
  icon: React.ElementType; 
  color: string; 
  bgColor: string; 
  change?: string; 
  changeType?: 'increase' | 'decrease';
  subtitle?: string;
  trend?: 'up' | 'down' | 'stable' | null;
  showTrend?: boolean;
}) => {
    const ChangeIcon = changeType === 'increase' ? TrendingUp : TrendingDown;
    const changeColor = changeType === 'increase' ? 'text-green-600' : 'text-red-600';
    const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500';

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">{name}</p>
                    {subtitle && (
                        <p className="text-xs text-gray-400">{subtitle}</p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${bgColor} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                </div>
            </div>
            <div className="space-y-2">
                <p className="text-3xl font-bold text-gray-800">{value}</p>
                {change && showTrend && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                            <ChangeIcon className={`h-4 w-4 mr-1 ${changeColor}`} />
                            <span>{change}</span>
                        </div>
                        {trend && (
                            <div className={`flex items-center text-xs ${trendColor}`}>
                                {trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                                {trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                                {trend === 'stable' && <Activity className="h-3 w-3 mr-1" />}
                                <span className="capitalize">{trend}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export function DashboardMetrics({ data, dateRange, conversations = [] }: DashboardMetricsProps) {
  // Calculate trends if we have date range and conversations
  const trends = dateRange && conversations.length > 0 
    ? calculateTrends(conversations, dateRange.start, dateRange.end)
    : null;

  // Calculate additional metrics
  const calculateResponseTimeCategory = (time: number) => {
    if (time <= 5) return { category: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (time <= 15) return { category: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (time <= 30) return { category: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { category: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const responseTimeCategory = calculateResponseTimeCategory(data.averageResponseTime);
  
  // Calculate conversation velocity (conversations per day)
  const conversationsPerDay = data.totalConversations > 0 ? 
    Math.round((data.totalConversations / 30) * 10) / 10 : 0;

  // Calculate engagement rate (active vs total)
  const engagementRate = data.totalConversations > 0 ? 
    Math.round((data.activeConversations / data.totalConversations) * 100) : 0;

  // Helper function to get trend data for a metric
  const getTrendData = (metricKey: 'totalConversations' | 'activeConversations' | 'conversionRate' | 'averageResponseTime' | 'newConversations') => {
    if (!trends) return { showTrend: false, change: '', trend: null as any };
    
    const trendData = trends[metricKey];
    const showTrend = shouldShowTrend(trendData);
    const change = showTrend ? formatTrendChange(trendData) : '';
    const trend = showTrend ? getTrendDirection(trendData) : null;
    
    return { showTrend, change, trend };
  };

  const totalConversationsTrend = getTrendData('totalConversations');
  const activeConversationsTrend = getTrendData('activeConversations');
  const conversionRateTrend = getTrendData('conversionRate');
  const responseTimeTrend = getTrendData('averageResponseTime');

  const metrics = [
    { 
      name: 'Total Conversations', 
      value: data.totalConversations, 
      icon: MessageSquare, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100',
      subtitle: 'All time conversations',
      change: totalConversationsTrend.change,
      changeType: totalConversationsTrend.trend === 'up' ? 'increase' : 'decrease' as 'increase' | 'decrease',
      trend: totalConversationsTrend.trend,
      showTrend: totalConversationsTrend.showTrend
    },
    { 
      name: 'Active Conversations', 
      value: data.activeConversations, 
      icon: Activity, 
      color: 'text-green-600', 
      bgColor: 'bg-green-100',
      subtitle: 'Currently in progress',
      change: activeConversationsTrend.change,
      changeType: activeConversationsTrend.trend === 'up' ? 'increase' : 'decrease' as 'increase' | 'decrease',
      trend: activeConversationsTrend.trend,
      showTrend: activeConversationsTrend.showTrend
    },
    { 
      name: 'Conversion Rate', 
      value: `${data.conversionRate}%`, 
      icon: Target, 
      color: 'text-orange-600', 
      bgColor: 'bg-orange-100',
      subtitle: 'Successfully closed',
      change: conversionRateTrend.change || `${data.conversionRate >= 0 ? '+' : ''}${data.conversionRate}% vs target`,
      changeType: conversionRateTrend.trend === 'up' || data.conversionRate >= 15 ? 'increase' : 'decrease' as 'increase' | 'decrease',
      trend: conversionRateTrend.trend || (data.conversionRate >= 15 ? 'up' : 'down' as 'up' | 'down'),
      showTrend: conversionRateTrend.showTrend
    },
    { 
      name: 'Avg Response Time', 
      value: `${data.averageResponseTime}m`, 
      icon: Clock, 
      color: responseTimeCategory.color, 
      bgColor: responseTimeCategory.bgColor,
      subtitle: responseTimeCategory.category,
      change: responseTimeTrend.change || (data.averageResponseTime <= 15 ? 'Under 15min target' : 'Above target'),
      changeType: responseTimeTrend.trend === 'down' || data.averageResponseTime <= 15 ? 'increase' : 'decrease' as 'increase' | 'decrease',
      trend: responseTimeTrend.trend || (data.averageResponseTime <= 15 ? 'up' : 'down' as 'up' | 'down'),
      showTrend: responseTimeTrend.showTrend
    },
    { 
      name: 'Conversation Velocity', 
      value: `${conversationsPerDay}/day`, 
      icon: Zap, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-100',
      subtitle: 'Daily conversation rate',
      trend: conversationsPerDay > 1 ? 'up' : 'stable' as 'up' | 'stable',
      showTrend: false // No historical data for this metric yet
    },
    { 
      name: 'Engagement Rate', 
      value: `${engagementRate}%`, 
      icon: Users, 
      color: 'text-indigo-600', 
      bgColor: 'bg-indigo-100',
      subtitle: 'Active engagement level',
      change: `${engagementRate >= 0 ? '+' : ''}${engagementRate}% of total`,
      changeType: engagementRate >= 50 ? 'increase' : 'decrease' as 'increase' | 'decrease',
      trend: engagementRate >= 50 ? 'up' : 'down' as 'up' | 'down',
      showTrend: false // No historical data for this metric yet
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.name} {...metric} />
        ))}
      </div>
      
      {/* Quick Stats Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200/80 shadow-sm">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>
                {dateRange 
                  ? `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}`
                  : 'Last 30 days'
                }
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>Updated {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>On track</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Needs attention</span>
            </div>
            {trends && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Trends based on previous period</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 