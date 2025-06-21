/**
 * File: lib/utils/dashboard.ts
 * Purpose: Centralized dashboard utilities for data processing, analytics, and common calculations
 * Author: AI Assistant
 * Date: 2024-12-19
 * Version: 2.0.0
 */

import { subDays, format, differenceInDays, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import type { Conversation, Message } from '@/types/conversation';
import type { DashboardMetrics, DashboardAnalytics, DashboardUsage } from '@/types/dashboard';

/**
 * Calculates average response time from conversations
 */
export function calculateAverageResponseTime(conversations: Conversation[]): number {
  const responseTimes: number[] = [];
  
  conversations.forEach(conversation => {
    const messages = conversation.messages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    for (let i = 0; i < messages.length - 1; i++) {
      const currentMessage = messages[i];
      const nextMessage = messages[i + 1];
      
      // Only calculate if current is inbound and next is outbound
      if (currentMessage.type === 'inbound-email' && nextMessage.type === 'outbound-email') {
        const responseTime = new Date(nextMessage.timestamp).getTime() - new Date(currentMessage.timestamp).getTime();
        responseTimes.push(responseTime);
      }
    }
  });
  
  if (responseTimes.length === 0) return 0;
  
  const averageMs = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
  return Math.round(averageMs / (1000 * 60)); // Convert to minutes
}

/**
 * Calculates monthly growth percentage
 */
export function calculateMonthlyGrowth(conversations: Conversation[]): number {
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(subDays(currentMonthStart, 1));
  const lastMonthEnd = endOfMonth(lastMonthStart);
  
  const currentMonthCount = conversations.filter(conv => 
    new Date(conv.thread.createdAt) >= currentMonthStart
  ).length;
  
  const lastMonthCount = conversations.filter(conv => 
    new Date(conv.thread.createdAt) >= lastMonthStart && 
    new Date(conv.thread.createdAt) <= lastMonthEnd
  ).length;
  
  if (lastMonthCount === 0) return currentMonthCount > 0 ? 100 : 0;
  
  return Math.round(((currentMonthCount - lastMonthCount) / lastMonthCount) * 100);
}

/**
 * Generates comprehensive analytics data from conversations
 */
export function generateAnalytics(conversations: Conversation[]): DashboardAnalytics {
  // Conversation Trend (Last 7 Days)
  const conversationTrendData = Array(7).fill(0);
  const labels = Array(7).fill(0).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    return format(date, 'MMM d');
  });

  conversations.forEach(conv => {
    const date = new Date(conv.thread.createdAt);
    const diff = differenceInDays(new Date(), date);
    if (diff >= 0 && diff < 7) {
      const index = 6 - diff;
      conversationTrendData[index]++;
    }
  });

  // Lead Source Breakdown
  const sourceCounts = conversations.reduce((acc, conv) => {
    const source = conv.thread.source_name || 'Unknown';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Conversion Funnel
  const totalLeads = conversations.length;
  const activeConversations = conversations.filter(conv => !conv.thread.completed).length;
  const completedConversations = conversations.filter(conv => conv.thread.completed).length;
  
  const conversionFunnelData = [
    { stage: 'Total Leads', count: totalLeads, percentage: 100 },
    { stage: 'Active', count: activeConversations, percentage: totalLeads > 0 ? Math.round((activeConversations / totalLeads) * 100) : 0 },
    { stage: 'Completed', count: completedConversations, percentage: totalLeads > 0 ? Math.round((completedConversations / totalLeads) * 100) : 0 },
  ];

  // Response Time Trend (Last 30 Days)
  const responseTimeData = Array(30).fill(0);
  const responseTimeLabels = Array(30).fill(0).map((_, i) => {
    const date = subDays(new Date(), 29 - i);
    return format(date, 'MMM d');
  });

  // Calculate daily average response times
  for (let i = 0; i < 30; i++) {
    const targetDate = subDays(new Date(), 29 - i);
    const dayConversations = conversations.filter(conv => {
      const convDate = new Date(conv.thread.createdAt);
      return format(convDate, 'yyyy-MM-dd') === format(targetDate, 'yyyy-MM-dd');
    });
    
    if (dayConversations.length > 0) {
      responseTimeData[i] = calculateAverageResponseTime(dayConversations);
    }
  }

  return {
    conversationTrend: {
      labels,
      datasets: [{
        label: 'Conversations',
        data: conversationTrendData,
        borderColor: '#4A90E2',
        backgroundColor: 'rgba(74, 144, 226, 0.2)',
      }]
    },
    leadSourceBreakdown: {
      labels: Object.keys(sourceCounts),
      datasets: [{
        label: 'Lead Sources',
        data: Object.values(sourceCounts),
        backgroundColor: ['#4A90E2', '#50E3C2', '#F5A623', '#BD10E0', '#9013FE'],
      }]
    },
    responseTimeTrend: {
      labels: responseTimeLabels,
      datasets: [{
        label: 'Avg Response Time (min)',
        data: responseTimeData,
        borderColor: '#50E3C2',
        backgroundColor: 'rgba(80, 227, 194, 0.2)',
      }]
    },
    conversionFunnel: {
      labels: conversionFunnelData.map(item => item.stage),
      datasets: [{
        label: 'Conversations',
        data: conversionFunnelData.map(item => item.count),
        backgroundColor: ['#4A90E2', '#F5A623', '#50E3C2'],
      }]
    },
    revenueTrend: { 
      labels: [], 
      datasets: [] 
    }, // Placeholder for future revenue tracking
  };
}

/**
 * Calculates dashboard metrics from conversations and usage data
 */
export function calculateDashboardMetrics(
  conversations: Conversation[], 
  usageData: DashboardUsage
): DashboardMetrics {
  const totalConversations = conversations.length;
  const completedConversations = conversations.filter(c => c.thread.completed).length;
  const conversionRate = totalConversations > 0 ? Math.round((completedConversations / totalConversations) * 100) : 0;

  return {
    totalConversations,
    activeConversations: conversations.filter((conv: Conversation) => !conv.thread.completed).length,
    totalLeads: totalConversations,
    conversionRate: conversionRate,
    averageResponseTime: calculateAverageResponseTime(conversations),
    monthlyGrowth: calculateMonthlyGrowth(conversations),
    totalRevenue: 0, // Placeholder for future revenue tracking
    averageDealSize: 0, // Placeholder for future deal size tracking
  };
}

/**
 * Filters conversations by date range
 */
export function filterConversationsByDateRange(
  conversations: Conversation[], 
  startDate: Date, 
  endDate: Date
): Conversation[] {
  return conversations.filter(conv => {
    const convDate = new Date(conv.thread.createdAt);
    return convDate >= startDate && convDate <= endDate;
  });
}

/**
 * Sorts conversations by various criteria
 */
export function sortConversations(
  conversations: Conversation[], 
  sortBy: 'date' | 'name' | 'status' | 'priority' = 'date',
  sortOrder: 'asc' | 'desc' = 'desc'
): Conversation[] {
  const sorted = [...conversations];
  
  switch (sortBy) {
    case 'date':
      sorted.sort((a, b) => {
        const timeA = new Date(a.thread.lastMessageAt).getTime();
        const timeB = new Date(b.thread.lastMessageAt).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
      break;
    case 'name':
      sorted.sort((a, b) => {
        const nameA = (a.thread.lead_name || '').toLowerCase();
        const nameB = (b.thread.lead_name || '').toLowerCase();
        return sortOrder === 'desc' ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
      });
      break;
    case 'status':
      sorted.sort((a, b) => {
        const statusA = a.thread.completed ? 1 : 0;
        const statusB = b.thread.completed ? 1 : 0;
        return sortOrder === 'desc' ? statusB - statusA : statusA - statusB;
      });
      break;
    case 'priority':
      const priorityOrder = { high: 3, medium: 2, normal: 1, low: 0 };
      sorted.sort((a, b) => {
        const priorityA = priorityOrder[a.thread.priority as keyof typeof priorityOrder] || 1;
        const priorityB = priorityOrder[b.thread.priority as keyof typeof priorityOrder] || 1;
        return sortOrder === 'desc' ? priorityB - priorityA : priorityA - priorityB;
      });
      break;
  }
  
  return sorted;
}

/**
 * Groups conversations by status
 */
export function groupConversationsByStatus(conversations: Conversation[]) {
  return {
    active: conversations.filter(conv => !conv.thread.completed),
    completed: conversations.filter(conv => conv.thread.completed),
    flagged: conversations.filter(conv => conv.thread.flag || conv.thread.flag_for_review),
    spam: conversations.filter(conv => conv.thread.spam),
  };
}

/**
 * Calculates usage statistics
 */
export function calculateUsageStats(usageData: DashboardUsage) {
  return {
    emailsSent: usageData.emailsSent || 0,
    logins: usageData.logins || 0,
    activeDays: usageData.activeDays || 0,
    averageEmailsPerDay: usageData.activeDays > 0 ? Math.round(usageData.emailsSent / usageData.activeDays) : 0,
    engagementRate: usageData.logins > 0 ? Math.round((usageData.activeDays / usageData.logins) * 100) : 0,
  };
}

/**
 * Formats currency values
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Formats percentage values
 */
export function formatPercentage(value: number): string {
  return `${value}%`;
}

/**
 * Formats time duration
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

/**
 * Gets conversation status color
 */
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'text-green-600 bg-green-100';
    case 'active':
      return 'text-blue-600 bg-blue-100';
    case 'flagged':
      return 'text-yellow-600 bg-yellow-100';
    case 'spam':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

/**
 * Gets priority color
 */
export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'text-red-600 bg-red-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'low':
      return 'text-green-600 bg-green-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

/**
 * Trend data interface for tracking metric changes
 */
export interface TrendData {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  direction: 'up' | 'down' | 'stable';
}

/**
 * Calculates trends for dashboard metrics based on date range
 */
export function calculateTrends(
  conversations: Conversation[], 
  startDate: Date, 
  endDate: Date
): Record<string, TrendData> {
  const currentPeriod = conversations.filter(conv => {
    const convDate = new Date(conv.thread.createdAt);
    return convDate >= startDate && convDate <= endDate;
  });

  const previousStartDate = new Date(startDate);
  previousStartDate.setDate(previousStartDate.getDate() - (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const previousEndDate = new Date(startDate);
  previousEndDate.setDate(previousEndDate.getDate() - 1);

  const previousPeriod = conversations.filter(conv => {
    const convDate = new Date(conv.thread.createdAt);
    return convDate >= previousStartDate && convDate <= previousEndDate;
  });

  const calculateMetricTrend = (
    currentValue: number,
    previousValue: number
  ): TrendData => {
    const change = currentValue - previousValue;
    const changePercent = previousValue > 0 ? (change / previousValue) * 100 : 0;
    
    let direction: 'up' | 'down' | 'stable';
    if (Math.abs(changePercent) < 1) {
      direction = 'stable';
    } else {
      direction = changePercent > 0 ? 'up' : 'down';
    }

    return {
      current: currentValue,
      previous: previousValue,
      change,
      changePercent,
      direction
    };
  };

  // Calculate metrics for current and previous periods
  const currentTotal = currentPeriod.length;
  const previousTotal = previousPeriod.length;
  
  const currentActive = currentPeriod.filter(c => !c.thread.completed).length;
  const previousActive = previousPeriod.filter(c => !c.thread.completed).length;
  
  const currentCompleted = currentPeriod.filter(c => c.thread.completed).length;
  const previousCompleted = previousPeriod.filter(c => c.thread.completed).length;
  
  const currentConversionRate = currentTotal > 0 ? (currentCompleted / currentTotal) * 100 : 0;
  const previousConversionRate = previousTotal > 0 ? (previousCompleted / previousTotal) * 100 : 0;
  
  const currentResponseTime = calculateAverageResponseTime(currentPeriod);
  const previousResponseTime = calculateAverageResponseTime(previousPeriod);

  return {
    totalConversations: calculateMetricTrend(currentTotal, previousTotal),
    activeConversations: calculateMetricTrend(currentActive, previousActive),
    conversionRate: calculateMetricTrend(currentConversionRate, previousConversionRate),
    averageResponseTime: calculateMetricTrend(currentResponseTime, previousResponseTime),
    newConversations: calculateMetricTrend(currentTotal, previousTotal), // Same as total for now
  };
}

/**
 * Determines if a trend should be shown based on significance
 */
export function shouldShowTrend(trendData: TrendData | null): boolean {
  if (!trendData) return false;
  return Math.abs(trendData.changePercent) >= 1; // Show if change is >= 1%
}

/**
 * Formats trend change for display
 */
export function formatTrendChange(trendData: TrendData | null): string {
  if (!trendData) return '';
  
  const sign = trendData.changePercent >= 0 ? '+' : '';
  return `${sign}${Math.round(Math.abs(trendData.changePercent))}%`;
}

/**
 * Gets the trend direction from trend data
 */
export function getTrendDirection(trendData: TrendData | null): 'up' | 'down' | 'stable' | null {
  if (!trendData) return null;
  return trendData.direction;
} 