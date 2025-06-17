/**
 * File: app/types/lcp.ts
 * Purpose: Type definitions for the Lead Conversion Pipeline (LCP)
 * Author: Gemini
 * Date: 07/19/2024
 * Version: 2.0.0
 */

export type TimeRange = 'day' | 'week' | 'month' | 'year';

export type MessageType = 'inbound-email' | 'outbound-email' | 'inbound-sms' | 'outbound-sms';

export interface Message {
    id: string;
    conversation_id: string;
    response_id?: string;
    type: MessageType;
    content: string;
    body: string;
    subject: string;
    timestamp: string;
    sender: string;
    recipient: string;
    receiver: string;
    associated_account: string;
    ev_score?: number;
    in_reply_to: string | null;
    is_first_email: boolean;
    metadata: Record<string, any>;
}

export interface Thread {
    conversation_id: string;
    associated_account: string;
    lcp_enabled: boolean;
    read: boolean;
    source: string;
    source_name: string;
    lcp_flag_threshold: number;
    ai_summary: string;
    budget_range: string;
    preferred_property_types: string;
    timeline: string;
    phone?: string;
    location?: string;
    busy: boolean;
    spam: boolean;
    flag_for_review: boolean;
    flag_review_override: boolean;
    flag: boolean;
    messages: Message[];
    last_updated: string;
    created_at: string;
}

export interface ThreadMetrics {
    newLeads: number;
    pendingReplies: number;
    unopenedLeads: number;
}

export interface ThreadOperationResult {
    success: boolean;
    data?: any;
    error?: string;
}

export interface DashboardFilters {
    unread: boolean;
    review: boolean;
    completion: boolean;
}

export interface LeadPerformanceData {
    threadId: string;
    score: number;
    timestamp: string;
    startTimestamp: string;
    endTimestamp: string;
    source?: string;
    sourceName?: string;
}

export type MessageWithResponseId = Message & {
    response_id: string;
}; 