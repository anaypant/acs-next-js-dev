import type { Thread, Message } from '@/app/types/lcp';

type MessageWithResponseId = Message & {
    response_id: string;
};

export const hasPendingReply = (messages: any[]): boolean => {
    if (!messages || messages.length === 0) return false;
    const lastMessage = messages[messages.length - 1];
    return lastMessage.type === 'inbound-email';
};

export const calculateMetrics = (rawThreads: any[], timeRange: 'day' | 'week' | 'month' | 'year') => {
    if (!rawThreads.length) {
        return { newLeads: 0, pendingReplies: 0, unopenedLeads: 0 };
    }

    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
        case 'day':
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
        case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
        case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
    }

    const metrics = {
        newLeads: 0,
        pendingReplies: 0,
        unopenedLeads: 0
    };

    rawThreads.forEach((threadData) => {
        const messages = threadData.messages || [];
        const thread = threadData.thread;

        const sortedMessages = [...messages].sort((a: Message, b: Message) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        const latestMessage = sortedMessages[0];

        if (!thread?.read) {
            metrics.unopenedLeads++;
        }

        if (latestMessage && latestMessage.type === 'inbound-email') {
            metrics.pendingReplies++;
        }

        if (latestMessage) {
            const messageDate = new Date(latestMessage.timestamp);
            if (messageDate >= startDate && messageDate <= now) {
                metrics.newLeads++;
            }
        }
    });

    return metrics;
};

export const getFilteredConversations = (
    conversations: Thread[],
    rawThreads: any[],
    filters: { unread: boolean; review: boolean; completion: boolean }
): Thread[] => {
    return conversations.filter(conv => {
        if (conv.spam) return false;

        const messages = rawThreads.find(t => t.thread?.conversation_id === conv.conversation_id)?.messages || [];
        const evMessage = messages
            .filter((msg: Message): msg is MessageWithResponseId => Boolean(msg.response_id))
            .sort((a: MessageWithResponseId, b: MessageWithResponseId) =>
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            )[0];

        const ev_score = evMessage ? (typeof evMessage.ev_score === 'string' ? parseFloat(evMessage.ev_score) : evMessage.ev_score) : -1;
        const isFlaggedForCompletion = ev_score > conv.lcp_flag_threshold;

        if (filters.unread && !conv.read) return true;
        if (filters.review && conv.flag_for_review) return true;
        if (filters.completion && isFlaggedForCompletion && !conv.flag_for_review) return true;
        if (!filters.unread && !filters.review && !filters.completion) return true;
        
        return false;
    });
}; 