import type { Thread, Message } from '@/app/types/lcp';
import type { Session } from 'next-auth';

type MessageWithResponseId = Message & {
    response_id: string;
};

export const fetchThreads = async (session: Session | null): Promise<{ conversations: Thread[], rawThreads: any[], leadPerformanceData: any[] }> => {
    if (!session?.user?.id) {
        return { conversations: [], rawThreads: [], leadPerformanceData: [] };
    }

    const response = await fetch('/api/lcp/get_all_threads', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: session.user.id
        })
    });

    if (!response.ok) {
        throw new Error('Failed to fetch threads');
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.data)) {
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

        const spamCount = sortedData.filter((thread: { thread?: { spam?: boolean | string } }) =>
            thread.thread?.spam === true || thread.thread?.spam === 'true'
        ).length;

        if (typeof window !== 'undefined') {
            localStorage.setItem('junkEmailCount', spamCount.toString());
            window.dispatchEvent(new CustomEvent('junkEmailCountUpdated', { detail: spamCount }));
        }

        return { conversations, rawThreads: sortedData, leadPerformanceData: data.data };
    }

    return { conversations: [], rawThreads: [], leadPerformanceData: [] };
};

export const markThreadAsRead = async (conversationId: string) => {
    const response = await fetch('/api/db/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            table_name: 'Threads',
            key_name: 'conversation_id',
            key_value: conversationId,
            update_data: {
                read: true
            }
        })
    });

    if (!response.ok) {
        throw new Error('Failed to mark thread as read');
    }
    window.location.href = `/dashboard/conversations/${conversationId}`;
};

export const toggleLcp = async (conversationId: string, currentStatus: boolean) => {
    const response = await fetch('/api/db/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            table_name: 'Threads',
            key_name: 'conversation_id',
            key_value: conversationId,
            update_data: {
                lcp_enabled: !currentStatus
            }
        })
    });

    if (!response.ok) {
        throw new Error('Failed to update LCP status');
    }
};

export const markAsNotSpam = async (conversationId: string, rawThreads: any[]) => {
    const threadData = rawThreads.find(t => t.thread?.conversation_id === conversationId);
    if (!threadData?.thread?.associated_account) {
        throw new Error('Missing thread data');
    }

    const messages = threadData.messages || [];
    const latestMessage = messages
        .filter((msg: Message): msg is MessageWithResponseId => Boolean(msg.response_id))
        .sort((a: MessageWithResponseId, b: MessageWithResponseId) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0];

    if (!latestMessage?.response_id) {
        throw new Error('No messages found with message_id');
    }

    const response = await fetch('/api/lcp/mark_not_spam', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            conversation_id: conversationId,
            message_id: latestMessage.response_id,
            account_id: threadData.thread.associated_account
        })
    });

    if (!response.ok) {
        throw new Error('Failed to mark as not spam');
    }
};

export const deleteThread = async (conversationId: string) => {
    const response = await fetch('/api/lcp/delete_thread', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            conversation_id: conversationId
        })
    });

    if (!response.ok) {
        throw new Error('Failed to delete thread');
    }
}; 