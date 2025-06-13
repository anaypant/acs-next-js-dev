/**
 * File: app/dashboard/lib/dashboard-utils.ts
 * Purpose: Shared utility functions for dashboard functionality
 * Author: Gemini
 * Date: 07/19/2024
 * Version: 3.0.0
 */

import type { 
    Thread, 
    ThreadMetrics, 
    TimeRange, 
    Message, 
    MessageWithResponseId,
    LeadPerformanceData 
} from '@/app/types/lcp';

export const ensureMessageFields = (msg: any): Message => ({
    id: msg.id || msg.conversation_id,
    conversation_id: msg.conversation_id,
    response_id: msg.response_id,
    type: msg.type as any,
    content: msg.content || msg.body || '',
    body: msg.body || msg.content || '',
    subject: msg.subject || '',
    timestamp: msg.timestamp,
    sender: msg.sender,
    recipient: msg.recipient || msg.receiver,
    receiver: msg.receiver || msg.recipient,
    associated_account: msg.associated_account || msg.sender,
    ev_score: typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score,
    in_reply_to: msg.in_reply_to || null,
    is_first_email: msg.is_first_email || false,
    metadata: msg.metadata || {},
});

export const getLatestEvaluableMessage = (messages: Message[]): MessageWithResponseId | undefined => {
    if (!messages?.length) return undefined;
    return messages
        .filter((msg): msg is MessageWithResponseId => Boolean(msg.response_id))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
};

export const calculateMetrics = (threads: Thread[], timeRange: TimeRange): ThreadMetrics => {
    if (!threads.length) return { newLeads: 0, pendingReplies: 0, unopenedLeads: 0 };

    const now = new Date();
    const startDate = getStartDate(timeRange, now);

    return threads.reduce((metrics, thread) => {
        const messages = thread.messages || [];
        const latestMessage = messages[0];

        if (!thread.read) metrics.unopenedLeads++;
        if (latestMessage?.type === 'inbound-email') metrics.pendingReplies++;
        if (latestMessage && new Date(latestMessage.timestamp) >= startDate) metrics.newLeads++;

        return metrics;
    }, { newLeads: 0, pendingReplies: 0, unopenedLeads: 0 });
};

const getStartDate = (timeRange: TimeRange, now: Date): Date => {
    const startDate = new Date(now);
    switch (timeRange) {
        case 'day': startDate.setHours(0, 0, 0, 0); break;
        case 'week': startDate.setDate(now.getDate() - 7); break;
        case 'month': startDate.setMonth(now.getMonth() - 1); break;
        case 'year': startDate.setFullYear(now.getFullYear() - 1); break;
    }
    return startDate;
};

export const processThreadData = (rawData: any[], timeRange: TimeRange) => {
    const sortedData = [...rawData].sort((a, b) => {
        const aLatest = a.messages?.[0]?.timestamp || 0;
        const bLatest = b.messages?.[0]?.timestamp || 0;
        return new Date(bLatest).getTime() - new Date(aLatest).getTime();
    });

    const conversations = sortedData.map(item => {
        const thread = item.thread;
        return {
            ...thread,
            flag_for_review: thread.flag_for_review === 'true',
            flag_review_override: thread.flag_review_override === 'true',
            read: thread.read === 'true',
            busy: thread.busy === 'true',
            spam: thread.spam === 'true',
            lcp_enabled: thread.lcp_enabled === true || thread.lcp_enabled === 'true' || thread.lcp_enabled === 1,
            lcp_flag_threshold: typeof thread.lcp_flag_threshold === 'number' ? thread.lcp_flag_threshold : Number(thread.lcp_flag_threshold) || 0,
            messages: (item.messages || []).map(ensureMessageFields),
            ai_summary: thread.ai_summary || '',
        };
    });

    const metrics = calculateMetrics(conversations, timeRange);
    const leadPerformance = conversations
        .filter(thread => thread.messages?.[0])
        .map(thread => {
            const evMessage = getLatestEvaluableMessage(thread.messages);
            return {
                threadId: thread.conversation_id,
                score: evMessage?.ev_score ?? 0,
                timestamp: evMessage?.timestamp || new Date().toISOString(),
                source: thread.source,
                sourceName: thread.source_name,
            };
        });

    return { conversations, metrics, leadPerformance };
}; 