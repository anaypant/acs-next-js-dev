/**
 * File: app/dashboard/context/ThreadsContext.tsx
 * Purpose: Global state management for thread data with optimized API calls and caching
 * Author: Alejo Cagliolo
 * Date: 06/11/25
 * Version: 1.0.0
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { Session } from 'next-auth';
import type { Thread, ThreadMetrics, ThreadFilters, ThreadContextState, TimeRange } from '../lib/types/threads';
import { threadApi } from '../lib/api/threads';

interface ThreadsContextType extends ThreadContextState {
  // Operations
  operations: {
    fetch: () => Promise<void>;
    refresh: (id?: string) => Promise<void>;
    update: (id: string, data: Partial<Thread>) => Promise<void>;
    delete: (id: string) => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    toggleLcp: (id: string) => Promise<void>;
    markAsSpam: (id: string, isSpam: boolean) => Promise<void>;
  };
  // UI State
  setSelectedThread: (id: string | null) => void;
  setFilters: (filters: Partial<ThreadFilters> | ((prev: ThreadFilters) => Partial<ThreadFilters>)) => void;
  clearCache: () => void;
}

const ThreadsContext = createContext<ThreadsContextType | undefined>(undefined);

interface ThreadsProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

const POLLING_INTERVAL = 10 * 60 * 1000; // 10 minutes

export const ThreadsProvider: React.FC<ThreadsProviderProps> = ({ children, session }) => {
  // Core State
  const [threads, setThreads] = useState<Thread[]>([]);
  const [metrics, setMetrics] = useState<ThreadMetrics>({
    newLeads: 0,
    pendingReplies: 0,
    unopenedLeads: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  
  // UI State
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [filters, setFilters] = useState<ThreadFilters>({
    unread: false,
    review: false,
    completion: false,
    timeRange: 'week',
  });

  // Refs for request management
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, []);

  // Core Operations
  const fetch = useCallback(async () => {
    if (!session?.user?.id || !isMounted.current) return;

    try {
      console.log('[ThreadsContext] fetchAllThreads payload:', { userId: session.user.id });
      setLoading(true);
      setError(null);

      const [threadsResult, metricsResult] = await Promise.all([
        threadApi.getAllThreads(session.user.id),
        threadApi.getMetrics(filters.timeRange, session.user.id),
      ]);

      // Add detailed logging for debugging
      console.log('[ThreadsContext] Raw threadsResult:', threadsResult);
      console.log('[ThreadsContext] Raw metricsResult:', metricsResult);

      if (isMounted.current) {
        console.log('[ThreadsContext] Updating state with threads:', {
          threadCount: threadsResult.conversations.length,
          firstThread: threadsResult.conversations[0]
        });
        setThreads(threadsResult.conversations);
        setMetrics(metricsResult);
        setLastFetch(new Date());
      }
    } catch (err) {
      console.error('[ThreadsContext] Error fetching threads:', err);
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Error fetching threads');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [session?.user?.id, filters.timeRange]);

  // Helper function to refresh metrics
  const refreshMetrics = useCallback(async () => {
    if (!session?.user?.id || !isMounted.current) return;
    try {
      const metricsResult = await threadApi.getMetrics(filters.timeRange, session.user.id);
      if (isMounted.current) {
        setMetrics(metricsResult);
      }
    } catch (err) {
      console.error('[ThreadsContext] Error refreshing metrics:', err);
    }
  }, [session?.user?.id, filters.timeRange]);

  const refresh = useCallback(async (id?: string) => {
    if (!session?.user?.id || !isMounted.current) return;

    try {
      if (id) {
        console.log('[ThreadsContext] getThreadById payload:', { conversationId: id });
        const result = await threadApi.getThread(id);
        if (result.success && isMounted.current) {
          setThreads(prev => prev.map(t => 
            t.conversation_id === id ? (result.data as Thread) : t
          ));
          // Refresh metrics after updating a thread
          await refreshMetrics();
        }
      } else {
        await fetch();
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Error refreshing thread');
      }
    }
  }, [session?.user?.id, fetch, refreshMetrics]);

  const update = useCallback(async (id: string, data: Partial<Thread>) => {
    if (!session?.user?.id || !isMounted.current) return;

    try {
      // Log with correct keys
      console.log('[ThreadsContext] Update payload:', { conversationId: id, updates: data });
      // Optimistic update
      setThreads(prev => prev.map(t => 
        t.conversation_id === id ? { ...t, ...data } : t
      ));

      // Pass correct keys to API
      const result = await threadApi.updateThread(id, data);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update thread');
      }

      // Refresh the thread and metrics to ensure consistency
      await Promise.all([refresh(id), refreshMetrics()]);
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Error updating thread');
        // Revert optimistic update and refresh
        await Promise.all([refresh(id), refreshMetrics()]);
      }
    }
  }, [session?.user?.id, refresh, refreshMetrics]);

  const deleteThread = useCallback(async (id: string) => {
    if (!session?.user?.id || !isMounted.current) return;

    try {
      console.log('[ThreadsContext] deleteThread payload:', { conversationId: id });
      const result = await threadApi.deleteThread(id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete thread');
      }

      if (isMounted.current) {
        setThreads(prev => prev.filter(t => t.conversation_id !== id));
        // Refresh metrics after deleting a thread
        await refreshMetrics();
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Error deleting thread');
      }
    }
  }, [session?.user?.id, refreshMetrics]);

  // Business Operations
  const markAsRead = useCallback(async (id: string) => {
    console.log('[ThreadsContext] markAsRead payload:', { conversationId: id });
    await update(id, { read: true });
    // Refresh metrics after marking as read
    await refreshMetrics();
  }, [update, refreshMetrics]);

  const toggleLcp = useCallback(async (id: string) => {
    const thread = threads.find(t => t.conversation_id === id);
    if (!thread) return;
    console.log('[ThreadsContext] toggleLcp payload:', { conversationId: id, lcp_enabled: !thread.lcp_enabled });
    await update(id, { lcp_enabled: !thread.lcp_enabled });
    // Refresh metrics after toggling LCP
    await refreshMetrics();
  }, [threads, update, refreshMetrics]);

  const markAsSpam = useCallback(async (id: string, isSpam: boolean) => {
    const thread = threads.find(t => t.conversation_id === id);
    if (!thread) return;
    await update(id, { spam: isSpam });
    // Refresh metrics after marking as spam
    await refreshMetrics();
  }, [threads, update, refreshMetrics]);

  // Filter Management
  const updateFilters = useCallback((newFilters: Partial<ThreadFilters> | ((prev: ThreadFilters) => Partial<ThreadFilters>)) => {
    setFilters(prev => {
      const updates = typeof newFilters === 'function' ? newFilters(prev) : newFilters;
      return { ...prev, ...updates };
    });
  }, []);

  // Cache Management
  const clearCache = useCallback(() => {
    threadApi.clearCache();
    setLastFetch(null);
  }, []);

  // Set up polling for metrics
  useEffect(() => {
    if (session?.user?.id) {
      // Initial fetch
      fetch();

      // Set up polling interval
      pollingInterval.current = setInterval(() => {
        if (document.visibilityState === 'visible') {
          fetch();
        }
      }, POLLING_INTERVAL);

      // Cleanup
      return () => {
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current);
        }
      };
    }
  }, [session?.user?.id, fetch]);

  // Update metrics when time range changes
  useEffect(() => {
    if (session?.user?.id) {
      refreshMetrics();
    }
  }, [session?.user?.id, filters.timeRange, refreshMetrics]);

  const value: ThreadsContextType = {
    // State
    threads,
    metrics,
    loading,
    error,
    lastFetch,
    filters,
    selectedThread,
    
    // Operations
    operations: {
      fetch,
      refresh,
      update,
      delete: deleteThread,
      markAsRead,
      toggleLcp,
      markAsSpam,
    },
    
    // UI State
    setSelectedThread,
    setFilters: updateFilters,
    clearCache,
  };

  return (
    <ThreadsContext.Provider value={value}>
      {children}
    </ThreadsContext.Provider>
  );
};

export const useThreads = () => {
  const context = useContext(ThreadsContext);
  if (context === undefined) {
    throw new Error('useThreads must be used within a ThreadsProvider');
  }
  return context;
};

/**
 * Change Log:
 * 06/11/25 - Version 1.0.0
 * - Created global thread state management with caching
 * - Implemented request deduplication and throttling
 * - Added optimistic updates for better UX
 * - Reduced polling frequency and added visibility change handling
 * - Added single thread refresh for targeted updates
 */ 