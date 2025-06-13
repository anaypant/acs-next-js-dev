import { useState, useCallback, useMemo } from 'react';
import type { Session } from 'next-auth';
import type { Thread, Message, MessageWithResponseId } from '../../types/lcp';
import { type AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const useConversations = (session: Session | null, mounted: boolean, router: AppRouterInstance) => {
    const [rawThreads, setRawThreads] = useState<any[]>([]);
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [updatingLcp, setUpdatingLcp] = useState<string | null>(null);
    const [updatingRead, setUpdatingRead] = useState<string | null>(null);
    const [deletingThread, setDeletingThread] = useState<string | null>(null);
    const [updatingSpam, setUpdatingSpam] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [threadToDelete, setThreadToDelete] = useState<{ id: string; name: string } | null>(null);
    const [warnings, setWarnings] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const [threads, setThreads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [RETRY_DELAY, setRETRY_DELAY] = useState(1000);

    const conversations = useMemo(() => {
        if (!rawThreads) return [];
        return rawThreads.map((item: any) => ({
            conversation_id: item.thread?.conversation_id || '',
            associated_account: item.thread?.associated_account || '',
            lcp_enabled: item.thread?.lcp_enabled === true || item.thread?.lcp_enabled === 'true',
            read: item.thread?.read === true || item.thread?.read === 'true',
            source: item.thread?.source || '',
            source_name: item.thread?.source_name || '',
            lcp_flag_threshold: typeof item.thread?.lcp_flag_threshold === 'number' ? item.thread.lcp_flag_threshold : Number(item.thread?.lcp_flag_threshold) || 0,
            ai_summary: item.thread?.ai_summary || '',
            budget_range: item.thread?.budget_range || '',
            preferred_property_types: item.thread?.preferred_property_types || '',
            timeline: item.thread?.timeline || '',
            busy: item.thread?.busy === 'true',
            flag_for_review: item.thread?.flag_for_review === 'true',
            spam: item.thread?.spam === true || item.thread?.spam === 'true',
        }));
    }, [rawThreads]);

    const MAX_RETRIES = 3;

    const fetchThreads = async () => {
        if (!mounted || !session?.user?.id) {
            return;
        }

        const requestBody = {
            userId: session.user.id,
            // Add any other necessary parameters
        };

        try {
            const response = await fetch('/api/threads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Invalid response format');
            }

            if (data.warnings?.failedThreads?.length > 0) {
                // Handle warnings appropriately
                setWarnings(data.warnings);
            }

            setThreads(data.threads);
            setLoading(false);
            setError(null);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error fetching threads');
            setLoading(false);
            
            if (retryCount < MAX_RETRIES) {
                setRetryCount(prev => prev + 1);
                setTimeout(fetchThreads, RETRY_DELAY);
            }
        }
    };

    const handleMarkAsRead = async (conversationId: string) => {
        if (!session?.user?.id) return;
        try {
            setUpdatingRead(conversationId);
            setRawThreads(prev => prev.map(thread => {
                if (thread.thread?.conversation_id === conversationId) {
                    return { ...thread, thread: { ...thread.thread, read: true } };
                }
                return thread;
            }));

            router.push(`/dashboard/conversations/${conversationId}`);
            
            await fetch('/api/threads/mark-read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ threadId: conversationId, userId: session?.user?.id })
            });

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error marking thread as read');
        } finally {
            setUpdatingRead(null);
        }
    };

    const handleLcpToggle = async (conversationId: string, currentStatus: boolean) => {
        if (!session?.user?.id) return;
        const originalThreads = rawThreads;
        try {
            setUpdatingLcp(conversationId);
            setRawThreads(prev => prev.map(thread => {
                if (thread.thread?.conversation_id === conversationId) {
                    return { ...thread, thread: { ...thread.thread, lcp_enabled: !currentStatus } };
                }
                return thread;
            }));

            await fetch('/api/db/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    table_name: 'Threads',
                    key_name: 'conversation_id',
                    key_value: conversationId,
                    update_data: { lcp_enabled: !currentStatus },
                }),
            });
        } catch (error) {
            setError('Error updating LCP status');
            // Revert optimistic update on failure
            setRawThreads(originalThreads);
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
        const originalThreads = rawThreads;
        try {
            setDeletingThread(threadToDelete.id);
            setRawThreads(prev => prev.filter(thread => thread.thread?.conversation_id !== threadToDelete.id));

            await fetch('/api/lcp/delete_thread', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversation_id: threadToDelete.id }),
            });
        } catch (error) {
            setError('Error deleting thread');
            alert('Failed to delete conversation. Please try again.');
            setRawThreads(originalThreads);
        } finally {
            setDeletingThread(null);
            setDeleteModalOpen(false);
            setThreadToDelete(null);
        }
    };

    const handleMarkAsNotSpam = async (conversationId: string) => {
        if (!session?.user?.id) return;
        try {
            setUpdatingSpam(conversationId);
            const threadData = rawThreads.find(t => t.thread?.conversation_id === conversationId);
            if (!threadData?.thread?.associated_account) throw new Error('Missing thread data');

            const messages = threadData.messages || [];
            const latestMessage = messages
                .filter((msg: Message): msg is MessageWithResponseId => Boolean(msg.response_id))
                .sort((a: MessageWithResponseId, b: MessageWithResponseId) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

            if (!latestMessage?.response_id) throw new Error('No messages found with message_id');

            await fetch('/api/lcp/mark_not_spam', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversation_id: conversationId,
                    message_id: latestMessage.response_id,
                    account_id: threadData.thread.associated_account,
                }),
            });

            await fetchThreads();
        } catch (error) {
            setError('Error marking as not spam');
        } finally {
            setUpdatingSpam(null);
        }
    };

    return {
        conversations,
        rawThreads,
        loadingConversations,
        updatingLcp,
        updatingRead,
        deletingThread,
        updatingSpam,
        deleteModalOpen,
        threadToDelete,
        fetchThreads,
        handleMarkAsRead,
        handleLcpToggle,
        handleDeleteThread,
        confirmDelete,
        handleMarkAsNotSpam,
        setDeleteModalOpen,
        setThreadToDelete,
        warnings,
        error,
        retryCount,
        threads,
        loading,
        RETRY_DELAY
    };
}; 