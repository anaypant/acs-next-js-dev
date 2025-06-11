'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { Session } from 'next-auth';
import type { Thread } from '@/app/types/lcp';
import { goto404 } from '@/app/utils/error';
import * as api from './api';
import * as utils from './utils';

export const useDashboard = () => {
    const { data: session, status } = useSession() as { data: Session | null, status: string };
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [conversations, setConversations] = useState<Thread[]>([]);
    const [rawThreads, setRawThreads] = useState<any[]>([]);
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [updatingLcp, setUpdatingLcp] = useState<string | null>(null);
    const [updatingRead, setUpdatingRead] = useState<string | null>(null);
    const [deletingThread, setDeletingThread] = useState<string | null>(null);
    const [updatingSpam, setUpdatingSpam] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [threadToDelete, setThreadToDelete] = useState<{ id: string; name: string } | null>(null);
    const [showFunnel, setShowFunnel] = useState(true);
    const [showProgression, setShowProgression] = useState(false);
    const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');
    const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);
    const [leadPerformanceData, setLeadPerformanceData] = useState<any[]>([]);
    const [loadingLeadPerformance, setLoadingLeadPerformance] = useState(false);
    const [refreshingLeadPerformance, setRefreshingLeadPerformance] = useState(false);
    const [filters, setFilters] = useState({ unread: false, review: false, completion: false });

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
            const { conversations, rawThreads, leadPerformanceData } = await api.fetchThreads(session);
            setConversations(conversations);
            setRawThreads(rawThreads);
            setLeadPerformanceData(leadPerformanceData);
        } catch (error) {
            console.error('Error fetching threads:', error);
            setConversations([]);
            setRawThreads([]);
            setLeadPerformanceData([]);
        } finally {
            setLoadingConversations(false);
            setLoadingLeadPerformance(false);
        }
    }, [session]);

    useEffect(() => {
        if (mounted && session?.user?.id) {
            loadThreads();
        }
    }, [session, mounted, loadThreads]);

    const handleMarkAsRead = async (conversationId: string) => {
        setUpdatingRead(conversationId);
        try {
            await api.markThreadAsRead(conversationId);
            setConversations(prev => prev.map(conv =>
                conv.conversation_id === conversationId ? { ...conv, read: true } : conv
            ));
        } catch (error) {
            console.error('Error marking thread as read:', error);
            window.location.href = `/dashboard/conversations/${conversationId}`;
        } finally {
            setUpdatingRead(null);
        }
    };

    const handleLcpToggle = async (conversationId: string, currentStatus: boolean) => {
        setUpdatingLcp(conversationId);
        try {
            await api.toggleLcp(conversationId, currentStatus);
            setConversations(prev => prev.map(conv =>
                conv.conversation_id === conversationId ? { ...conv, lcp_enabled: !currentStatus } : conv
            ));
        } catch (error) {
            console.error('Error updating LCP status:', error);
        } finally {
            setUpdatingLcp(null);
        }
    };

    const handleDeleteThread = (conversationId: string, conversationName: string) => {
        setThreadToDelete({ id: conversationId, name: conversationName });
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!threadToDelete) return;
        setDeletingThread(threadToDelete.id);
        try {
            await api.deleteThread(threadToDelete.id);
            setConversations(prev => prev.filter(conv => conv.conversation_id !== threadToDelete.id));
            setRawThreads(prev => prev.filter(thread => thread.thread?.conversation_id !== threadToDelete.id));
        } catch (error) {
            console.error('Error deleting thread:', error);
            alert('Failed to delete conversation. Please try again.');
        } finally {
            setDeletingThread(null);
            setDeleteModalOpen(false);
            setThreadToDelete(null);
        }
    };

    const handleMarkAsNotSpam = async (conversationId: string) => {
        setUpdatingSpam(conversationId);
        try {
            await api.markAsNotSpam(conversationId, rawThreads);
            await loadThreads();
        } catch (error) {
            console.error('Error marking as not spam:', error);
        } finally {
            setUpdatingSpam(null);
        }
    };
    
    const refreshLeadPerformance = useCallback(async () => {
        if (!session?.user?.id) return;
        setRefreshingLeadPerformance(true);
        try {
            const { leadPerformanceData } = await api.fetchThreads(session);
            setLeadPerformanceData(leadPerformanceData);
        } catch (error) {
            console.error('Error refreshing lead performance:', error);
        } finally {
            setRefreshingLeadPerformance(false);
        }
    }, [session]);

    const metrics = utils.calculateMetrics(rawThreads, timeRange);
    const filteredConversations = utils.getFilteredConversations(conversations, rawThreads, filters);

    const toggleFilter = (filter: keyof typeof filters) => {
        setFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
    };

    return {
        session,
        conversations,
        rawThreads,
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
        handleMarkAsRead,
        handleLcpToggle,
        handleDeleteThread,
        confirmDelete,
        handleMarkAsNotSpam,
        refreshLeadPerformance,
    };
}; 