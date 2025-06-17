'use client';

import { useConversations, type Conversation, type Thread, type Message } from './conversations-context';
import { useCallback } from 'react';

export function useConversationsData() {
  const {
    conversations,
    isLoading,
    error,
    lastUpdated,
    refreshConversations,
    updateConversation,
    getConversation,
  } = useConversations();

  // Get a single conversation by ID
  const getConversationById = useCallback((conversationId: string) => {
    const conv = getConversation(conversationId);
    return conv;
  }, [getConversation]);

  // Get all messages for a conversation
  const getMessagesForConversation = useCallback((conversationId: string) => {
    const conversation = getConversation(conversationId);
    return conversation?.messages || [];
  }, [getConversation]);

  // Update a specific message in a conversation
  const updateMessage = useCallback((conversationId: string, messageId: string, updates: Partial<Message>) => {
    const conversation = getConversation(conversationId);
    if (!conversation) return;

    const updatedMessages = conversation.messages.map(msg =>
      msg.id === messageId ? { ...msg, ...updates } : msg
    );

    updateConversation(conversationId, {
      ...conversation,
      messages: updatedMessages
    });
  }, [getConversation, updateConversation]);

  // Add a new message to a conversation
  const addMessage = useCallback((conversationId: string, message: Message) => {
    const conversation = getConversation(conversationId);
    if (!conversation) return;

    updateConversation(conversationId, {
      ...conversation,
      messages: [...conversation.messages, message]
    });
  }, [getConversation, updateConversation]);

  // Update thread metadata
  const updateThreadMetadata = useCallback((conversationId: string, updates: Partial<Thread>) => {
    const conversation = getConversation(conversationId);
    if (!conversation) return;

    updateConversation(conversationId, {
      ...conversation,
      thread: { ...conversation.thread, ...updates }
    });
  }, [getConversation, updateConversation]);

  return {
    // Data
    conversations,
    isLoading,
    error,
    lastUpdated,

    // Actions
    refreshConversations,
    getConversationById,
    getMessagesForConversation,
    updateMessage,
    addMessage,
    updateThreadMetadata,

    // Utility functions
    isStale: lastUpdated ? Date.now() - lastUpdated.getTime() > 5 * 60 * 1000 : true,
  };
} 