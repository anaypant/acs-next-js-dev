/**
 * File: app/dashboard/hooks/useThreads.ts
 * Purpose: Custom hook for thread operations with optimized data access
 */

import { useCallback, useMemo } from 'react';
import { useThreads as useThreadsContext } from '../context/ThreadsContext';
import type { Thread, ThreadFilters, TimeRange } from '../lib/types/threads';

export const useThreads = () => {
  const context = useThreadsContext();

  // Memoized filtered threads
  const filteredThreads = useMemo(() => {
    return context.threads.filter(thread => {
      if (context.filters.unread && thread.read) return false;
      if (context.filters.review && !thread.flag_for_review) return false;
      if (context.filters.completion) {
        const evMessage = thread.messages
          .filter(msg => msg.ev_score !== undefined)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
        
        if (!evMessage || (evMessage.ev_score ?? 0) <= thread.lcp_flag_threshold) return false;
      }
      return true;
    });
  }, [context.threads, context.filters]);

  // Memoized thread counts
  const counts = useMemo(() => ({
    total: context.threads.length,
    filtered: filteredThreads.length,
    unread: context.threads.filter(t => !t.read).length,
    review: context.threads.filter(t => t.flag_for_review).length,
    spam: context.threads.filter(t => t.spam).length,
  }), [context.threads, filteredThreads]);

  // Memoized selected thread
  const selectedThread = useMemo(() => 
    context.selectedThread 
      ? context.threads.find(t => t.conversation_id === context.selectedThread)
      : null
  , [context.threads, context.selectedThread]);

  // Thread operations with proper error handling
  const operations = {
    ...context.operations,
    
    // Enhanced operations with additional functionality
    refreshWithMetrics: useCallback(async (id?: string) => {
      await context.operations.refresh(id);
      await context.operations.fetch(); // Refresh metrics
    }, [context.operations]),

    updateWithRefresh: useCallback(async (id: string, data: Partial<Thread>) => {
      await context.operations.update(id, data);
      await context.operations.refresh(id);
    }, [context.operations]),

    deleteWithRefresh: useCallback(async (id: string) => {
      await context.operations.delete(id);
      await context.operations.fetch(); // Refresh metrics
    }, [context.operations]),
  };

  // Filter operations
  const filterOperations = {
    setTimeRange: useCallback((timeRange: TimeRange) => {
      context.setFilters({ timeRange });
    }, [context]),

    toggleFilter: useCallback((filter: keyof ThreadFilters) => {
      context.setFilters((prev: ThreadFilters) => ({
        ...prev,
        [filter]: !prev[filter]
      }));
    }, [context]),

    clearFilters: useCallback(() => {
      context.setFilters({
        unread: false,
        review: false,
        completion: false,
        timeRange: 'week',
      });
    }, [context]),
  };

  return {
    // Data
    threads: filteredThreads,
    metrics: context.metrics,
    counts,
    selectedThread,
    
    // State
    loading: context.loading,
    error: context.error,
    filters: context.filters,
    
    // Operations
    operations,
    filterOperations,
    
    // UI State
    setSelectedThread: context.setSelectedThread,
    clearCache: context.clearCache,
  };
}; 