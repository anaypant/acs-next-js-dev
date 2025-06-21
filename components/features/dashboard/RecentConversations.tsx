/**
 * File: components/features/dashboard/RecentConversations.tsx
 * Purpose: Displays the 5 most recent conversations using processed Conversation data
 * Author: AI Assistant
 * Date: 2024-12-19
 * Version: 1.2.0
 */

import React from 'react';
import { ConversationCard } from '../conversations/ConversationCard';
import { LoadingSpinner } from '@/components/common/Feedback/LoadingSpinner';
import { MessageSquare, ArrowRight } from 'lucide-react';
import type { Conversation } from '@/types/conversation';

interface RecentConversationsProps {
  conversations?: Conversation[];
}

export function RecentConversations({ conversations = [] }: RecentConversationsProps) {
  // Data is now pre-sorted by lastMessageAt in descending order from processThreadsResponse
  // Just take the first 5 conversations (most recent first)
  const recentConversations = conversations.slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Conversations</h3>
        <a href="/dashboard/conversations" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
          View all <ArrowRight className="w-4 h-4 ml-1" />
        </a>
      </div>
      
      <div className="space-y-4">
        {recentConversations.length > 0 ? (
          recentConversations.map((conversation: Conversation) => (
            <ConversationCard
              key={conversation.thread.conversation_id}
              conversation={conversation}
              variant="simple"
            />
          ))
        ) : (
          <div className="text-center py-10">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-600">No recent activity</h4>
            <p className="text-sm text-gray-400">New conversations will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
} 