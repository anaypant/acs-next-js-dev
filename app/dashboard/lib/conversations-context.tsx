'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import type { SignupProvider } from '@/app/types/auth';

// Types
export interface Thread {
  conversation_id: string;
  associated_account: string;
  [key: string]: any;
}

export interface Message {
  conversation_id: string;
  [key: string]: any;
}

export interface Conversation {
  thread: Thread;
  messages: Message[];
}

interface ConversationsContextType {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshConversations: () => Promise<void>;
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => void;
  getConversation: (conversationId: string) => Conversation | undefined;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

export function ConversationsProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession() as { data: (Session & {
    user: {
      id: string;
      email: string;
      name: string;
      authType: 'new' | 'existing';
      provider: SignupProvider;
      accessToken?: string;
    }
  }) | null };
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchConversations = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/lcp/get_all_threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session.user.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const data = await response.json();
      if (data.success) {
        setConversations(data.data);
        // Log all conversation IDs after setting
        const ids = data.data.map((conv: any) => conv.thread?.conversation_id);
        console.log('[ConversationsProvider] Set conversations, IDs:', ids);
        setLastUpdated(new Date());
      } else {
        throw new Error(data.error || 'Failed to fetch conversations');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching conversations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and periodic refresh
  useEffect(() => {
    if (session?.user?.id) {
      fetchConversations();

      const interval = setInterval(() => {
        const now = new Date();
        if (!lastUpdated || now.getTime() - lastUpdated.getTime() >= CACHE_DURATION) {
          fetchConversations();
        }
      }, 60000); // Check every minute if we need to refresh

      return () => clearInterval(interval);
    }
  }, [session?.user?.id]);

  const refreshConversations = async () => {
    await fetchConversations();
  };

  const updateConversation = (conversationId: string, updates: Partial<Conversation>) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.thread.conversation_id === conversationId
          ? { ...conv, ...updates }
          : conv
      )
    );
  };

  const getConversation = (conversationId: string) => {
    // Log the conversationId being looked up and all available IDs
    const ids = conversations.map(conv => conv.thread.conversation_id);
    console.log('[getConversation] Looking for:', conversationId, 'Available:', ids);
    return conversations.find(conv => conv.thread.conversation_id === conversationId);
  };

  return (
    <ConversationsContext.Provider
      value={{
        conversations,
        isLoading,
        error,
        lastUpdated,
        refreshConversations,
        updateConversation,
        getConversation,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}

export function useConversations() {
  const context = useContext(ConversationsContext);
  if (context === undefined) {
    throw new Error('useConversations must be used within a ConversationsProvider');
  }
  return context;
} 