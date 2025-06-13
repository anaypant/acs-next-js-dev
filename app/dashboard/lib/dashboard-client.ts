/**
 * File: app/dashboard/lib/dashboard-client.ts
 * Purpose: Client-side dashboard functionality including React hooks and utilities
 * Author: Gemini
 * Date: 06/13/25
 * Version: 1.0.0
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
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

export const useDashboard = () => {
    const { data: session, status } = useSession() as { data: Session | null, status: string };
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [conversations, setConversations] = useState<Thread[]>([]);
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [updatingLcp, setUpdatingLcp] = useState<string | null>(null);
    const [updatingRead, setUpdatingRead] = useState<string | null>(null);
    const [deletingThread, setDeletingThread] = useState<string | null>(null);
    const [updatingSpam, setUpdatingSpam] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [threadToDelete, setThreadToDelete] = useState<{ id: string; name: string } | null>(null);
    const [showFunnel, setShowFunnel] = useState(true);
    const [showProgression, setShowProgression] = useState(false);
    const [timeRange, setTimeRange] = useState<TimeRange>('week');
    const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);
    const [leadPerformanceData, setLeadPerformanceData] = useState<LeadPerformanceData[]>([]);
    const [loadingLeadPerformance, setLoadingLeadPerformance] = useState(false);
    const [refreshingLeadPerformance, setRefreshingLeadPerformance] = useState(false);
    const [filters, setFilters] = useState<DashboardFilters>({ unread: false, review: false, completion: false });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (status === "unauthenticated") {
            goto404("401", "No active session found", router);
        }
    }, [status, session, router, mounted]);

    const loadThreads = useCallback(async () => {
        if (!session?.user?.id) return;
        setLoadingConversations(true);
        setLoadingLeadPerformance(true);
        try {
            const response = await fetch('/api/lcp/get_all_threads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: session.user.id }),
            });
            if (!response.ok) throw new Error('Failed to fetch threads');
            const data = await response.json();
            if (!data.success || !data.data) {
                throw new Error('Invalid response format from API');
            }
            console.log(data.data);
            const { conversations, leadPerformance } = processThreadData(data.data, timeRange);
            setConversations(conversations);
            setLeadPerformanceData(data.leadPerformance || leadPerformance || []);
        } catch (error) {
            console.error('Error fetching threads:', error);
            setConversations([]);
            setLeadPerformanceData([]);
        } finally {
            setLoadingConversations(false);
            setLoadingLeadPerformance(false);
        }
    }, [session, timeRange]);

    useEffect(() => {
        if (mounted && session?.user?.id) {
            loadThreads();
        }
    }, [session, mounted, loadThreads]);

    const markAsRead = useCallback(async (conversationId: string) => {
        if (!session?.user?.id) return;
        setUpdatingRead(conversationId);
        try {
            const response = await fetch('/api/db/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    table_name: 'Threads',
                    index_name: 'conversation_id-index',
                    key_name: 'conversation_id',
                    key_value: conversationId,
                    update_data: { read: true }
                }),
            });
            if (!response.ok) throw new Error('Failed to mark as read');
            await loadThreads();
        } catch (error) {
            console.error('Error marking as read:', error);
        } finally {
            setUpdatingRead(null);
        }
    }, [session?.user?.id, loadThreads]);

    const toggleLeadConversion = useCallback(async (conversationId: string, currentStatus: boolean) => {
        if (!session?.user?.id) return;
        setUpdatingLcp(conversationId);
        try {
            const response = await fetch('/api/db/update', {
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
            
            // Force a reload of the threads to ensure we have the latest data
            await loadThreads();
        } catch (error) {
            console.error('Error updating LCP status:', error);
        } finally {
            setUpdatingLcp(null);
        }
    }, [session?.user?.id, loadThreads]);

    const deleteThread = useCallback(async (conversationId: string) => {
        if (!session?.user?.id) return;
        setDeletingThread(conversationId);
        try {
            const response = await fetch('/api/lcp/delete_thread', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversation_id: conversationId }),
            });
            if (!response.ok) throw new Error('Failed to delete thread');
            await loadThreads();
        } catch (error) {
            console.error('Error deleting thread:', error);
        } finally {
            setDeletingThread(null);
        }
    }, [session?.user?.id, loadThreads]);

    const handleMarkAsNotSpam = async (conversationId: string) => {
        setUpdatingSpam(conversationId);
        try {
            const response = await fetch('/api/db/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    table_name: 'Threads',
                    index_name: 'conversation_id-index',
                    key_name: 'conversation_id',
                    key_value: conversationId,
                    update_data: { spam: false },
                }),
            });
            if (!response.ok) throw new Error('Failed to mark as not spam');
            await loadThreads();
        } catch (error) {
            console.error('Error marking as not spam:', error);
        } finally {
            setUpdatingSpam(null);
        }
    };

    const confirmDelete = (thread: { id: string; name: string }) => {
        setThreadToDelete(thread);
        setDeleteModalOpen(true);
    };
    
    const refreshLeadPerformance = useCallback(async () => {
        if (!session?.user?.id) return;
        setRefreshingLeadPerformance(true);
        try {
            const response = await fetch('/api/lcp/get_all_threads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: session.user.id }),
            });
            if (!response.ok) throw new Error('Failed to refresh lead performance');
            const data = await response.json();
            setLeadPerformanceData(data.leadPerformance);
        } catch (error) {
            console.error('Error refreshing lead performance:', error);
        } finally {
            setRefreshingLeadPerformance(false);
        }
    }, [session]);

    const metrics = calculateMetrics(conversations, timeRange);
    const filteredConversations = conversations.filter(conv => {
        if (conv.spam) return false;
        if (filters.unread && !conv.read) return true;
        if (filters.review && conv.flag_for_review) return true;
        if (filters.completion) {
            const evMessage = getLatestEvaluableMessage(conv.messages);
            return (evMessage?.ev_score ?? 0) > conv.lcp_flag_threshold && !conv.flag_for_review;
        }
        return !filters.unread && !filters.review && !filters.completion;
    });

    const toggleFilter = (filter: keyof DashboardFilters) => {
        setFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
    };

    return {
        session,
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