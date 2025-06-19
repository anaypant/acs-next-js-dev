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
import { formatLocalDate, formatLocalTime } from '@/app/utils/timezone';

// Define a type for the processed thread that matches our Thread type
type ProcessedThread = {
    conversation_id: string;
    associated_account: string;
    name: string;
    flag_for_review: boolean;
    flag_review_override: boolean;
    read: boolean;
    busy: boolean;
    spam: boolean;
    lcp_enabled: boolean;
    lcp_flag_threshold: number;
    messages: Message[];
    ai_summary: string;
    source: string;
    source_name: string;
    budget_range: string;
    preferred_property_types: string;
    timeline: string;
    last_updated: string;
    created_at: string;
    updated_at: string;
    flag: boolean;
    completed?: boolean;
};

// Utility function to parse boolean values from both string and boolean types
export const parseBoolean = (value: any): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    if (typeof value === 'number') return value === 1;
    return false;
};

export const ensureMessageFields = (msg: any): Message => ({
    id: msg.id || msg.conversation_id,
    conversation_id: msg.conversation_id,
    response_id: msg.response_id,
    type: msg.type as any,
    content: msg.content || msg.body || '',
    body: msg.body || msg.content || '',
    subject: msg.subject || '',
    timestamp: msg.timestamp,
    localDate: formatLocalTime(msg.timestamp, undefined, msg.type as 'inbound-email' | 'outbound-email'),
    sender: msg.sender,
    recipient: msg.recipient || msg.receiver,
    receiver: msg.receiver || msg.recipient,
    associated_account: msg.associated_account || msg.sender,
    ev_score: typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score,
    in_reply_to: msg.in_reply_to || null,
    is_first_email: parseBoolean(msg.is_first_email),
    metadata: msg.metadata || {},
});

export const getLatestEvaluableMessage = (messages: Message[]): MessageWithResponseId | undefined => {
    if (!messages?.length) return undefined;
    return messages
        .filter((msg): msg is MessageWithResponseId => Boolean(msg.response_id))
        .sort((a, b) => b.localDate.getTime() - a.localDate.getTime())[0];
};

export const calculateMetrics = (threads: Thread[], timeRange: TimeRange): ThreadMetrics => {
    if (!threads.length) return { newLeads: 0, pendingReplies: 0, unopenedLeads: 0 };

    const now = new Date();
    const startDate = getStartDate(timeRange, now);

    // Exclude spam and completed threads from metrics
    const nonSpamNonCompletedThreads = threads.filter(thread => !thread.spam && !thread.completed);

    return nonSpamNonCompletedThreads.reduce((metrics, thread) => {
        const messages = thread.messages || [];
        const latestMessage = messages[0];

        if (!thread.read) metrics.unopenedLeads++;
        if (latestMessage?.type === 'inbound-email') metrics.pendingReplies++;
        if (latestMessage && latestMessage.localDate >= startDate) metrics.newLeads++;

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
    if (!Array.isArray(rawData)) {
        console.warn('processThreadData received non-array data:', rawData);
        return { conversations: [], metrics: { newLeads: 0, pendingReplies: 0, unopenedLeads: 0 }, leadPerformance: [] };
    }

    const sortedData = [...rawData].sort((a, b) => {
        const aLatest = a?.messages?.[0]?.localDate || new Date(0);
        const bLatest = b?.messages?.[0]?.localDate || new Date(0);
        return bLatest.getTime() - aLatest.getTime();
    });

    const conversations = sortedData.map(item => {
        if (!item || typeof item !== 'object') {
            console.warn('Invalid thread item:', item);
            return null;
        }

        const thread = item.thread || item;
        if (!thread || typeof thread !== 'object') {
            console.warn('Invalid thread data:', thread);
            return null;
        }


        const processedThread: ProcessedThread = {
            conversation_id: thread.conversation_id || thread.id || '',
            associated_account: thread.associated_account || thread.sender || '',
            name: thread.name || 'Unnamed Conversation',
            flag_for_review: parseBoolean(thread.flag_for_review),
            flag_review_override: parseBoolean(thread.flag_review_override),
            read: parseBoolean(thread.read),
            busy: parseBoolean(thread.busy),
            spam: parseBoolean(thread.spam),
            lcp_enabled: parseBoolean(thread.lcp_enabled),
            lcp_flag_threshold: typeof thread.lcp_flag_threshold === 'number' ? thread.lcp_flag_threshold : Number(thread.lcp_flag_threshold) || 70,
            messages: Array.isArray(item.messages) ? item.messages.map(ensureMessageFields) : [],
            ai_summary: thread.ai_summary || '',
            source: thread.source || '',
            source_name: thread.source_name || '',
            budget_range: thread.budget_range || '',
            preferred_property_types: thread.preferred_property_types || '',
            timeline: thread.timeline || '',
            last_updated: thread.last_updated || thread.updated_at || new Date().toISOString(),
            created_at: thread.created_at || new Date().toISOString(),
            updated_at: thread.updated_at || new Date().toISOString(),
            flag: parseBoolean(thread.flag),
            completed: parseBoolean(thread.completed)
        };

        // Print the processed thread data to console
        return processedThread as unknown as Thread;
    }).filter((thread): thread is Thread => thread !== null);

    const metrics = calculateMetrics(conversations, timeRange);
    const leadPerformance = conversations
        .filter(thread => thread.messages?.[0])
        .map(thread => {
            const messages = thread.messages || [];
            const evMessage = getLatestEvaluableMessage(messages);
            const firstMessage = messages[messages.length - 1];
            const lastMessage = messages[0];

            return {
                threadId: thread.conversation_id,
                score: evMessage?.ev_score || 0,
                timestamp: evMessage?.timestamp || new Date().toISOString(),
                startTimestamp: firstMessage?.timestamp || new Date().toISOString(),
                endTimestamp: lastMessage?.timestamp || new Date().toISOString(),
                source: thread.source || '',
                sourceName: thread.source_name || '',
            };
        });

    return { conversations, metrics, leadPerformance };
};

// Helper function to check if a thread is completed
export const isThreadCompleted = (completed: boolean | string | undefined): boolean => {
    return parseBoolean(completed);
}; 