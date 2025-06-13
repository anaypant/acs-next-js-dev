/**
 * File: app/dashboard/lib/types/threads.ts
 * Purpose: Unified type definitions for thread and conversation management
 */

export type ThreadStatus = 'active' | 'archived' | 'deleted' | 'spam';
export type MessageType = 'inbound-email' | 'outbound-email' | 'system' | 'note';
export type TimeRange = 'day' | 'week' | 'month' | 'year';

export interface Message {
  id: string;
  response_id?: string;
  type: MessageType;
  content: string;
  timestamp: string;
  sender: string;
  recipient: string;
  ev_score?: number;
  metadata?: Record<string, any>;
}

export interface ThreadMetrics {
  newLeads: number;
  pendingReplies: number;
  unopenedLeads: number;
  conversionRate?: number;
  averageResponseTime?: number;
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
  busy: boolean;
  flag_for_review: boolean;
  spam: boolean;
  messages: Message[];
  last_updated: string;
  created_at: string;
}

export interface ThreadFilters {
  unread: boolean;
  review: boolean;
  completion: boolean;
  timeRange: TimeRange;
  search?: string;
}

export interface ThreadOperationResult {
  success: boolean;
  error?: string;
  data?: Thread | Thread[];
}

export interface ThreadContextState {
  threads: Thread[];
  metrics: ThreadMetrics;
  loading: boolean;
  error: string | null;
  lastFetch: Date | null;
  filters: ThreadFilters;
  selectedThread: string | null;
} 