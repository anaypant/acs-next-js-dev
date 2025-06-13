/**
 * File: app/dashboard/lib/api/threads.ts
 * Purpose: Unified API client for thread operations with caching and error handling
 */

import type { Thread, ThreadMetrics, ThreadOperationResult, TimeRange, Message } from '../types/threads';
import type { Session } from 'next-auth';

const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes
const REQUEST_THROTTLE = 1000; // 1 second

// Utility function to parse boolean values from various formats
const parseBoolean = (value: any): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
};

type MessageWithResponseId = Message & {
    response_id: string;
};

class ThreadApiClient {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private lastRequestTime: number = 0;
  private pendingRequests: Map<string, Promise<any>> = new Map();

  private async request<T>(
    endpoint: string,
    method: string = 'GET',
    body?: any
  ): Promise<T> {
    const now = Date.now();
    if (now - this.lastRequestTime < REQUEST_THROTTLE) {
      await new Promise(resolve => setTimeout(resolve, REQUEST_THROTTLE));
    }
    this.lastRequestTime = now;

    const cacheKey = `${method}:${endpoint}:${JSON.stringify(body)}`;
    const cached = this.cache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }

    const requestPromise = fetch(`/api/${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      this.cache.set(cacheKey, { data, timestamp: now });
      return data;
    });

    this.pendingRequests.set(cacheKey, requestPromise);
    try {
      return await requestPromise;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  // Core Operations
  async getAllThreads(userId: string): Promise<{ conversations: Thread[], rawThreads: any[], leadPerformanceData: any[] }> {
    console.log('[ThreadApiClient] Fetching all threads for user:', userId);
    const result = await this.request<ThreadOperationResult>('lcp/get_all_threads', 'POST', { userId });
    
    if (!result.success || !Array.isArray(result.data)) {
      console.error('[ThreadApiClient] Invalid response format:', result);
      return { conversations: [], rawThreads: [], leadPerformanceData: [] };
    }

    // Define the type for raw thread data
    type RawThreadData = {
      thread?: {
        conversation_id?: string;
        ai_summary?: string;
        [key: string]: any;
      };
      messages?: any[];
    };

    console.log('[ThreadApiClient] Raw data received:', {
      threadCount: result.data.length,
      hasData: !!result.data,
      firstThread: result.data[0] ? {
        conversation_id: (result.data[0] as RawThreadData).thread?.conversation_id,
        has_ai_summary: !!(result.data[0] as RawThreadData).thread?.ai_summary,
        ai_summary_length: (result.data[0] as RawThreadData).thread?.ai_summary?.length
      } : null
    });

    // Log each thread's conversation_id and AI summary status
    result.data.forEach((item: RawThreadData, index: number) => {
      console.log(`[ThreadApiClient] Thread ${index} details:`, {
        conversation_id: item.thread?.conversation_id,
        has_thread: !!item.thread,
        has_ai_summary: !!item.thread?.ai_summary,
        ai_summary_length: item.thread?.ai_summary?.length,
        ai_summary_value: item.thread?.ai_summary || 'UNKNOWN',
        thread_keys: item.thread ? Object.keys(item.thread) : []
      });
    });

    const sortedData = [...result.data].sort((a: any, b: any) => {
      const aMessages = a.messages || [];
      const bMessages = b.messages || [];
      const aLatestTimestamp = aMessages.length > 0 ? new Date(aMessages[aMessages.length - 1].timestamp).getTime() : 0;
      const bLatestTimestamp = bMessages.length > 0 ? new Date(bMessages[bMessages.length - 1].timestamp).getTime() : 0;
      return bLatestTimestamp - aLatestTimestamp;
    });

    // Log the sorted data
    console.log('[ThreadApiClient] Sorted data:', sortedData.map((item: any) => ({
      conversation_id: item.thread?.conversation_id,
      message_count: item.messages?.length || 0
    })));

    const conversations = sortedData.map((item: any) => {
      const thread = item.thread;
      if (!thread?.conversation_id) {
        console.error('[ThreadApiClient] Thread missing conversation_id:', thread);
      }
      
      const processedThread = {
        conversation_id: thread?.conversation_id || '',
        associated_account: thread?.associated_account || '',
        lcp_enabled: parseBoolean(thread?.lcp_enabled),
        read: parseBoolean(thread?.read),
        source: thread?.source || '',
        source_name: thread?.source_name || '',
        lcp_flag_threshold: typeof thread?.lcp_flag_threshold === 'number' ? thread.lcp_flag_threshold : Number(thread?.lcp_flag_threshold) || 0,
        ai_summary: thread?.ai_summary || '',
        budget_range: thread?.budget_range || '',
        preferred_property_types: thread?.preferred_property_types || '',
        timeline: thread?.timeline || '',
        busy: parseBoolean(thread?.busy),
        spam: parseBoolean(thread?.spam),
        flag_for_review: thread?.flag_for_review === "true",
        flag_review_override: thread?.flag_review_override === "true",
        messages: item.messages || [],
        last_updated: thread?.last_updated || new Date().toISOString(),
        created_at: thread?.created_at || new Date().toISOString()
      };

      console.log(`[ThreadApiClient] Processed thread ${processedThread.conversation_id}:`, {
        has_ai_summary: !!processedThread.ai_summary,
        ai_summary_length: processedThread.ai_summary?.length,
        ai_summary_value: processedThread.ai_summary || 'UNKNOWN'
      });

      return processedThread;
    });

    // Log the processed conversations
    console.log('[ThreadApiClient] Processed conversations:', conversations.map(conv => ({
      conversation_id: conv.conversation_id,
      source_name: conv.source_name
    })));

    const spamCount = sortedData.filter((item: any) => {
      const thread = item.thread;
      return thread?.spam === true || thread?.spam === 'true';
    }).length;

    if (typeof window !== 'undefined') {
      localStorage.setItem('junkEmailCount', spamCount.toString());
      window.dispatchEvent(new CustomEvent('junkEmailCountUpdated', { detail: spamCount }));
    }

    return {
      conversations,
      rawThreads: sortedData,
      leadPerformanceData: [] // TODO: Implement lead performance data
    };
  }

  async getThread(conversationId: string): Promise<ThreadOperationResult> {
    return this.request<ThreadOperationResult>('lcp/getThreadById', 'POST', { conversation_id: conversationId });
  }

  async updateThread(
    conversationId: string,
    updates: Partial<Thread>
  ): Promise<ThreadOperationResult> {
    return this.request<ThreadOperationResult>('db/update', 'POST', {
      table_name: 'Threads',
      index_name: 'conversation_id-index',
      key_name: 'conversation_id',
      key_value: conversationId,
      update_data: updates,
    });
  }

  async deleteThread(conversationId: string): Promise<ThreadOperationResult> {
    return this.request<ThreadOperationResult>('lcp/delete_thread', 'POST', { conversationId });
  }

  // Business Operations
  async markAsRead(conversationId: string): Promise<ThreadOperationResult> {
    const result = await this.request<ThreadOperationResult>('db/update', 'POST', {
      table_name: 'Threads',
      key_name: 'conversation_id',
      key_value: conversationId,
      update_data: {
        read: true
      }
    });

    if (result.success && typeof window !== 'undefined') {
      window.location.href = `/dashboard/conversations/${conversationId}`;
    }

    return result;
  }

  async toggleLcp(conversationId: string): Promise<ThreadOperationResult> {
    const thread = await this.getThread(conversationId);
    if (!thread.success || !thread.data) {
      throw new Error('Failed to get thread status');
    }

    const currentStatus = (thread.data as Thread).lcp_enabled;
    return this.request<ThreadOperationResult>('db/update', 'POST', {
      table_name: 'Threads',
      key_name: 'conversation_id',
      key_value: conversationId,
      update_data: {
        lcp_enabled: !currentStatus
      }
    });
  }

  async markAsSpam(
    conversationId: string,
    isSpam: boolean,
    messageId?: string
  ): Promise<ThreadOperationResult> {
    return this.request<ThreadOperationResult>('lcp/mark_not_spam',
      'POST',
      { conversationId, messageId }
    );
  }

  // Metrics
  async getMetrics(timeRange: TimeRange, userId: string): Promise<ThreadMetrics> {
    const endpoint = `usage/stats?timeRange=${encodeURIComponent(timeRange)}`;
    const result = await this.request<ThreadMetrics>(endpoint, 'GET');
    
    // Calculate additional metrics from threads if needed
    const threadsResult = await this.getAllThreads(userId);
    const conversations = threadsResult.conversations;
    
    // Calculate conversion rate
    const totalLeads = conversations.length;
    const convertedLeads = conversations.filter(t => t.lcp_enabled).length;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    // Calculate average response time
    let totalResponseTime = 0;
    let responseCount = 0;
    conversations.forEach(thread => {
      const messages = thread.messages || [];
      if (messages.length >= 2) {
        for (let i = 1; i < messages.length; i++) {
          const prevTime = new Date(messages[i-1].timestamp).getTime();
          const currTime = new Date(messages[i].timestamp).getTime();
          if (currTime > prevTime) {
            totalResponseTime += (currTime - prevTime);
            responseCount++;
          }
        }
      }
    });
    const averageResponseTime = responseCount > 0 ? totalResponseTime / responseCount : 0;

    return {
      ...result,
      conversionRate,
      averageResponseTime: averageResponseTime / (1000 * 60), // Convert to minutes
      newLeads: conversations.filter(t => !t.read).length,
      pendingReplies: conversations.filter(t => !t.read && t.messages?.length > 0).length,
      unopenedLeads: conversations.filter(t => !t.read && (!t.messages || t.messages.length === 0)).length
    };
  }

  // Cache Management
  clearCache() {
    this.cache.clear();
  }

  invalidateThread(conversationId: string) {
    Array.from(this.cache.keys()).forEach(key => {
      if (key.includes(conversationId)) {
        this.cache.delete(key);
      }
    });
  }

  // Update markAsSpam to include the additional logic from api.ts
  async markAsNotSpam(conversationId: string, rawThreads: any[]): Promise<ThreadOperationResult> {
    const threadData = rawThreads.find(t => t.thread?.conversation_id === conversationId);
    if (!threadData?.thread?.associated_account) {
      throw new Error('Missing thread data');
    }

    const messages = threadData.messages || [];
    const latestMessage = messages
      .filter((msg: Message): msg is Message & { response_id: string } => Boolean(msg.response_id))
      .sort((a: Message & { response_id: string }, b: Message & { response_id: string }) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];

    if (!latestMessage?.response_id) {
      throw new Error('No messages found with message_id');
    }

    return this.request<ThreadOperationResult>('lcp/mark_not_spam', 'POST', {
      conversation_id: conversationId,
      message_id: latestMessage.response_id,
      account_id: threadData.thread.associated_account
    });
  }

  // Additional operations from api.ts
  async markThreadAsRead(conversationId: string): Promise<ThreadOperationResult> {
    const result = await this.request<ThreadOperationResult>('db/update', 'POST', {
      table_name: 'Threads',
      key_name: 'conversation_id',
      key_value: conversationId,
      update_data: {
        read: true
      }
    });

    if (result.success && typeof window !== 'undefined') {
      window.location.href = `/dashboard/conversations/${conversationId}`;
    }

    return result;
  }
}

export const threadApi = new ThreadApiClient(); 