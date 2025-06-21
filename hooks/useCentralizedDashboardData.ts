/**
 * File: hooks/useCentralizedDashboardData.ts
 * Purpose: Centralized hook for fetching and processing dashboard data used across all sections
 * Author: AI Assistant
 * Date: 2024-12-19
 * Version: 2.0.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiClient } from '@/lib/api/client';
import { processThreadsResponse } from '@/lib/utils/api';
import { 
  calculateDashboardMetrics, 
  generateAnalytics, 
  filterConversationsByDateRange,
  sortConversations,
  groupConversationsByStatus,
  calculateUsageStats
} from '@/lib/utils/dashboard';
import type { DashboardData, DashboardUsage, DateRange } from '@/types/dashboard';
import type { Conversation } from '@/types/conversation';

interface UseCentralizedDashboardDataOptions {
  dateRange?: DateRange;
  sortBy?: 'date' | 'name' | 'status' | 'priority';
  sortOrder?: 'asc' | 'desc';
  statusFilter?: 'all' | 'active' | 'completed' | 'flagged' | 'spam';
  searchQuery?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useCentralizedDashboardData(options: UseCentralizedDashboardDataOptions = {}) {
  const {
    dateRange,
    sortBy = 'date',
    sortOrder = 'desc',
    statusFilter = 'all',
    searchQuery = '',
    autoRefresh = false,
    refreshInterval = 30000
  } = options;

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [conversationsResponse, usageStatsResponse] = await Promise.all([
        apiClient.getThreads(),
        apiClient.request('usage/stats')
      ]);

      if (conversationsResponse.success) {
        const conversations: Conversation[] = processThreadsResponse(conversationsResponse.data?.data || []);
        
        const usageData = usageStatsResponse.success ? usageStatsResponse.data as DashboardUsage : {
          emailsSent: 0,
          logins: 0,
          activeDays: 0,
        };

        const dashboardData: DashboardData = {
          metrics: calculateDashboardMetrics(conversations, usageData),
          conversations: conversations,
          analytics: generateAnalytics(conversations),
          recentActivity: [],
          usage: usageData,
        };

        setData(dashboardData);
        setLastUpdated(new Date());
      } else {
        const errorMessage = `Failed to load conversations: ${conversationsResponse.error}`;
        console.error('[useCentralizedDashboardData] Error:', errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while loading dashboard data';
      console.error('[useCentralizedDashboardData] Unexpected error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and sort conversations based on options
  const processedConversations = useMemo(() => {
    if (!data?.conversations) return [];

    let filtered = data.conversations;

    // Apply date range filter
    if (dateRange?.startDate && dateRange?.endDate) {
      filtered = filterConversationsByDateRange(filtered, dateRange.startDate, dateRange.endDate);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      const grouped = groupConversationsByStatus(filtered);
      switch (statusFilter) {
        case 'active':
          filtered = grouped.active;
          break;
        case 'completed':
          filtered = grouped.completed;
          break;
        case 'flagged':
          filtered = grouped.flagged;
          break;
        case 'spam':
          filtered = grouped.spam;
          break;
      }
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(conv => 
        (conv.thread.lead_name || '').toLowerCase().includes(query) ||
        (conv.thread.client_email || '').toLowerCase().includes(query) ||
        (conv.thread.location || '').toLowerCase().includes(query) ||
        conv.messages.some(msg => 
          msg.body.toLowerCase().includes(query) ||
          (msg.subject || '').toLowerCase().includes(query)
        )
      );
    }

    // Apply sorting
    return sortConversations(filtered, sortBy, sortOrder);
  }, [data?.conversations, dateRange, statusFilter, searchQuery, sortBy, sortOrder]);

  // Calculate filtered metrics
  const filteredMetrics = useMemo(() => {
    if (!data?.metrics) return null;
    
    const totalFiltered = processedConversations.length;
    const completedFiltered = processedConversations.filter(c => c.thread.completed).length;
    const conversionRate = totalFiltered > 0 ? Math.round((completedFiltered / totalFiltered) * 100) : 0;

    return {
      ...data.metrics,
      totalConversations: totalFiltered,
      activeConversations: processedConversations.filter(c => !c.thread.completed).length,
      totalLeads: totalFiltered,
      conversionRate,
    };
  }, [data?.metrics, processedConversations]);

  // Calculate usage stats
  const usageStats = useMemo(() => {
    if (!data?.usage) return null;
    return calculateUsageStats(data.usage);
  }, [data?.usage]);

  // Auto-refresh functionality
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchDashboardData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchDashboardData]);

  const refetch = useCallback(async () => {
    await fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    // Raw data
    data,
    loading,
    error,
    lastUpdated,
    
    // Processed data
    conversations: processedConversations,
    metrics: filteredMetrics,
    analytics: data?.analytics,
    usage: data?.usage,
    usageStats,
    
    // Actions
    refetch,
    
    // Helper functions
    getConversationsByStatus: () => groupConversationsByStatus(processedConversations),
    getConversationById: (id: string) => processedConversations.find(c => c.thread.conversation_id === id),
  };
}

// Specialized hooks for different dashboard sections
export function useLeadsData(options: Omit<UseCentralizedDashboardDataOptions, 'statusFilter'> = {}) {
  return useCentralizedDashboardData({
    ...options,
    statusFilter: 'all',
    sortBy: 'date',
  });
}

export function useConversationsData(options: Omit<UseCentralizedDashboardDataOptions, 'statusFilter'> = {}) {
  return useCentralizedDashboardData({
    ...options,
    statusFilter: 'active',
    sortBy: 'date',
  });
}

export function useAnalyticsData(options: Omit<UseCentralizedDashboardDataOptions, 'statusFilter'> = {}) {
  return useCentralizedDashboardData({
    ...options,
    statusFilter: 'all',
    sortBy: 'date',
  });
}

export function useHistoryData(options: Omit<UseCentralizedDashboardDataOptions, 'statusFilter'> = {}) {
  return useCentralizedDashboardData({
    ...options,
    statusFilter: 'completed',
    sortBy: 'date',
  });
}

export function useUsageData(options: Omit<UseCentralizedDashboardDataOptions, 'statusFilter'> = {}) {
  return useCentralizedDashboardData({
    ...options,
    statusFilter: 'all',
    sortBy: 'date',
  });
}

export function useJunkData(options: Omit<UseCentralizedDashboardDataOptions, 'statusFilter'> = {}) {
  return useCentralizedDashboardData({
    ...options,
    statusFilter: 'spam',
    sortBy: 'date',
  });
}

export function useEmailData(options: Omit<UseCentralizedDashboardDataOptions, 'statusFilter'> = {}) {
  return useCentralizedDashboardData({
    ...options,
    statusFilter: 'all',
    sortBy: 'date',
  });
} 