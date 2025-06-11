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
    const INITIAL_RETRY_DELAY = 1000; // 1 second

    const fetchThreads = useCallback(async (retryCount = 0): Promise<void> => {
        if (!mounted || !session?.user?.id) {
            console.log('fetchThreads early return:', { mounted, sessionId: session?.user?.id });
            return;
        }

        try {
            setLoadingConversations(true);
            console.log('Making API request with userId:', session.user.id);
            const requestBody = JSON.stringify({ userId: session.user.id });
            console.log('Request body:', requestBody);
            
            const response = await fetch('/api/lcp/get_all_threads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: requestBody,
            });

            const data = await response.json();

            if (!response.ok) {
                // If the error is retryable and we haven't exceeded max retries, try again
                if (data.retryable && retryCount < MAX_RETRIES) {
                    console.log(`Retrying fetch... (${retryCount + 1}/${MAX_RETRIES})`);
                    await new Promise(resolve => setTimeout(resolve, INITIAL_RETRY_DELAY * Math.pow(2, retryCount)));
                    return fetchThreads(retryCount + 1);
                }
                throw new Error(data.error || `Failed to fetch threads: ${response.statusText}`);
            }

            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch threads');
            }

            if (!Array.isArray(data.data)) {
                console.error('Invalid response format:', data);
                throw new Error('Invalid response format from server');
            }

            // Handle any warnings about failed threads
            if (data.warnings?.failedThreads?.length > 0) {
                console.warn('Some threads failed to load:', data.warnings.failedThreads);
            }

            // Sort threads by most recent message timestamp
            const sortedData = [...data.data].sort((a: any, b: any) => {
                const aMessages = a.messages || [];
                const bMessages = b.messages || [];
                const aLatestTimestamp = aMessages.length > 0 ? new Date(aMessages[aMessages.length - 1].timestamp).getTime() : 0;
                const bLatestTimestamp = bMessages.length > 0 ? new Date(bMessages[bMessages.length - 1].timestamp).getTime() : 0;
                return bLatestTimestamp - aLatestTimestamp;
            });

            const conversations = sortedData.map((item: any) => ({
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

            setRawThreads(sortedData);

            // Update spam count if needed
            const spamCount = sortedData.filter((thread: { thread?: { spam?: boolean | string } }) =>
                thread.thread?.spam === true || thread.thread?.spam === 'true'
            ).length;

            if (typeof window !== 'undefined') {
                localStorage.setItem('junkEmailCount', spamCount.toString());
                window.dispatchEvent(new CustomEvent('junkEmailCountUpdated', { detail: spamCount }));
            }

        } catch (error) {
            console.error('Error fetching threads:', error);
            setRawThreads([]);
            // If it's a retryable error and we haven't exceeded max retries, try again
            if (error instanceof Error && error.message.includes('fetch') && retryCount < MAX_RETRIES) {
                console.log(`Retrying fetch after error... (${retryCount + 1}/${MAX_RETRIES})`);
                await new Promise(resolve => setTimeout(resolve, INITIAL_RETRY_DELAY * Math.pow(2, retryCount)));
                return fetchThreads(retryCount + 1);
            }
        } finally {
            setLoadingConversations(false);
        }
    }, [session, mounted]);

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
            
            await fetch('/api/db/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    table_name: 'Threads',
                    key_name: 'conversation_id',
                    key_value: conversationId,
                    update_data: { read: true },
                }),
            });

        } catch (error) {
            console.error('Error marking thread as read:', error);
            // Revert is tricky with navigation, so we just navigate.
            router.push(`/dashboard/conversations/${conversationId}`);
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
            console.error('Error updating LCP status:', error);
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
            console.error('Error deleting thread:', error);
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
            console.error('Error marking as not spam:', error);
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
        setThreadToDelete
    };
}; 