/**
 * File: app/dashboard/lib/dashboard-client.ts
 * Purpose: Client-side dashboard functionality including React hooks and utilities
 * Author: Gemini
 * Date: 06/13/25
 * Version: 1.0.0
 */

'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { Session } from 'next-auth';
import type { 
    Thread, 
    ThreadMetrics, 
    TimeRange, 
    Message, 
    MessageWithResponseId,
    DashboardFilters,
    LeadPerformanceData 
} from '@/app/types/lcp';
import { goto404 } from '@/app/utils/error';
import { ensureMessageFields, getLatestEvaluableMessage, calculateMetrics, processThreadData } from '@/app/dashboard/lib/dashboard-utils';
import { authFetch, authFetchJson } from '@/lib/auth-utils';

export const useDashboard = () => {
    const { data: session, status } = useSession() as { data: Session & { user: { id: string } } | null, status: string };
    const router = useRouter();
    const [conversations, setConversations] = useState<Thread[]>([]);
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [updatingLcp, setUpdatingLcp] = useState<string | null>(null);
    const [updatingRead, setUpdatingRead] = useState<string | null>(null);
    const [deletingThread, setDeletingThread] = useState<string | null>(null);
    const [updatingSpam, setUpdatingSpam] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [threadToDelete, setThreadToDelete] = useState<string | null>(null);
    const [showFunnel, setShowFunnel] = useState(false);
    const [showProgression, setShowProgression] = useState(false);
    const [timeRange, setTimeRange] = useState<TimeRange>('year');
    const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);
    const [leadPerformanceData, setLeadPerformanceData] = useState<LeadPerformanceData[]>([]);
    const [loadingLeadPerformance, setLoadingLeadPerformance] = useState(false);
    const [refreshingLeadPerformance, setRefreshingLeadPerformance] = useState(false);
    const [filters, setFilters] = useState<DashboardFilters>({
        unread: false,
        review: false,
        completion: false,
    });

    // Load threads - primarily used for manual refresh button
    const loadThreads = useCallback(async () => {
        if (!session?.user?.id || loadingConversations) {
            return;
        }
        setLoadingConversations(true);
        setLoadingLeadPerformance(true);
        try {
            const data = await authFetchJson('/api/lcp/get_all_threads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: session.user.id }),
            });
            
            if (!data.success || !data.data) {
                throw new Error('Invalid response format from API');
            }
            const { conversations, leadPerformance } = processThreadData(data.data, timeRange);
            // log conversations
            setConversations(conversations);
            setLeadPerformanceData(leadPerformance);
        } catch (error) {
            console.error('[Dashboard] Error fetching threads:', error);
            setConversations([]);
            setLeadPerformanceData([]);
        } finally {
            setLoadingConversations(false);
            setLoadingLeadPerformance(false);
        }
    }, [session?.user?.id, timeRange]);

    const markAsRead = useCallback(async (conversationId: string) => {
        if (!session?.user?.id) return;
        setUpdatingRead(conversationId);
        try {
            const response = await authFetch('/api/db/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    table_name: 'Threads',
                    index_name: 'conversation_id-index',
                    key_name: 'conversation_id',
                    key_value: conversationId,
                    update_data: { read: 'true' }
                }),
            });
            
            if (!response.ok) throw new Error('Failed to mark as read');
            
            // Update local state instead of reloading
            setConversations(prev => prev.map(conv => 
                conv.conversation_id === conversationId 
                    ? { ...conv, read: true }
                    : conv
            ));
        } catch (error) {
            console.error('Error marking as read:', error);
        } finally {
            setUpdatingRead(null);
        }
    }, [session?.user?.id]);

    const toggleLeadConversion = useCallback(async (conversationId: string) => {
        if (!session?.user?.id) return;
        const currentStatus = conversations.find(c => c.conversation_id === conversationId)?.lcp_enabled || false;
        setUpdatingLcp(conversationId);
        try {
            const response = await authFetch('/api/db/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    table_name: 'Threads',
                    index_name: 'conversation_id-index',
                    key_name: 'conversation_id',
                    key_value: conversationId,
                    update_data: { lcp_enabled: (!currentStatus).toString() }
                }),
            });
            
            if (!response.ok) throw new Error('Failed to update LCP status');
            
            // Update local state instead of reloading
            setConversations(prev => prev.map(conv => 
                conv.conversation_id === conversationId 
                    ? { ...conv, lcp_enabled: !currentStatus }
                    : conv
            ));
        } catch (error) {
            console.error('Error updating LCP status:', error);
        } finally {
            setUpdatingLcp(null);
        }
    }, [session?.user?.id]);

    const deleteThread = useCallback(async (conversationId: string) => {
        if (!session?.user?.id) return;
        setDeletingThread(conversationId);
        try {
            const response = await authFetch('/api/lcp/delete_thread', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversation_id: conversationId }),
            });
            
            if (!response.ok) throw new Error('Failed to delete thread');
            
            // Update local state instead of reloading
            setConversations(prev => prev.filter(conv => conv.conversation_id !== conversationId));
        } catch (error) {
            console.error('Error deleting thread:', error);
        } finally {
            setDeletingThread(null);
        }
    }, [session?.user?.id]);

    const handleMarkAsNotSpam = async (conversationId: string) => {
        setUpdatingSpam(conversationId);
        try {
            const response = await authFetch('/api/db/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    table_name: 'Threads',
                    index_name: 'conversation_id-index',
                    key_name: 'conversation_id',
                    key_value: conversationId,
                    update_data: { spam: 'false' }
                }),
            });
            
            if (!response.ok) throw new Error('Failed to mark as not spam');
            
            // Update local state instead of reloading
            setConversations(prev => prev.map(conv => 
                conv.conversation_id === conversationId 
                    ? { ...conv, spam: false }
                    : conv
            ));
        } catch (error) {
            console.error('Error marking as not spam:', error);
        } finally {
            setUpdatingSpam(null);
        }
    };

    const confirmDelete = useCallback(() => {
        if (threadToDelete) {
            deleteThread(threadToDelete);
            setDeleteModalOpen(false);
            setThreadToDelete(null);
        }
    }, [threadToDelete, deleteThread]);

    const refreshLeadPerformance = useCallback(async () => {
        if (!session?.user?.id) return;
        setRefreshingLeadPerformance(true);
        try {
            const data = await authFetchJson('/api/lcp/get_all_threads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: session.user.id }),
            });
            if (!data.success || !data.data) {
                throw new Error('Failed to refresh lead performance');
            }
            const { leadPerformance } = processThreadData(data.data, timeRange);
            setLeadPerformanceData(leadPerformance);
        } catch (error) {
            console.error('Error refreshing lead performance:', error);
        } finally {
            setRefreshingLeadPerformance(false);
        }
    }, [session]);

    const toggleFilter = (filter: keyof DashboardFilters) => {
        setFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
    };

    // Helper function to check if a thread is completed
    const isThreadCompleted = (completed: boolean | string | undefined): boolean => {
        if (typeof completed === 'boolean') return completed;
        if (typeof completed === 'string') return completed.toLowerCase() === 'true';
        return false;
    };

    // Memoize filtered conversations to prevent recalculation on every render
    const filteredConversations = useMemo(() => {
        const filtered = conversations.filter(conv => {
            if (conv.spam) return false;
            if (isThreadCompleted(conv.completed)) {
                return false;
            }
            if (filters.unread && !conv.read) return true;
            if (filters.review && conv.flag_for_review) return true;
            if (filters.completion) {
                const evMessage = getLatestEvaluableMessage(conv.messages);
                return (evMessage?.ev_score ?? 0) > conv.lcp_flag_threshold && !conv.flag_for_review;
            }
            return !filters.unread && !filters.review && !filters.completion;
        });
        
        
        return filtered;
    }, [conversations, filters]);

    // Memoize metrics to prevent recalculation on every render
    const metrics = useMemo(() => {
        return calculateMetrics(conversations, timeRange);
    }, [conversations, timeRange]);

    return {
        session,
        status,
        conversations,
        loadingConversations,
        updatingLcp,
        updatingRead,
        deletingThread,
        updatingSpam,
        deleteModalOpen,
        threadToDelete,
        showFunnel,
        showProgression,
        timeRange,
        showTimeRangeDropdown,
        leadPerformanceData,
        loadingLeadPerformance,
        refreshingLeadPerformance,
        filters,
        metrics,
        filteredConversations,
        setDeleteModalOpen,
        setThreadToDelete,
        setShowFunnel,
        setShowProgression,
        setTimeRange,
        setShowTimeRangeDropdown,
        toggleFilter,
        loadThreads,
        handleMarkAsRead: markAsRead,
        handleLcpToggle: toggleLeadConversion,
        handleDeleteThread: deleteThread,
        confirmDelete,
        handleMarkAsNotSpam,
        refreshLeadPerformance,
    };
}; 