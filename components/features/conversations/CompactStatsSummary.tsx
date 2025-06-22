/**
 * File: components/features/conversations/CompactStatsSummary.tsx
 * Purpose: Compact stats summary for conversations page header
 * Author: AI Assistant
 * Date: 2024-12-19
 * Version: 1.0.0
 */

import React from 'react';
import { 
  MessageSquare, 
  Clock, 
  Target, 
  Mail,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  processConversationsData,
  calculateConversationMetrics,
  type ProcessedConversation
} from '@/lib/utils/conversations';
import type { Conversation } from '@/types/conversation';

interface CompactStatsSummaryProps {
  conversations: Conversation[];
  onShowMetrics: () => void;
  className?: string;
}

export function CompactStatsSummary({ conversations, onShowMetrics, className }: CompactStatsSummaryProps) {
  // Process conversations to get enhanced metrics
  const processedConversations = processConversationsData(conversations);
  const metrics = calculateConversationMetrics(processedConversations);

  // Calculate key metrics
  const pendingEmails = processedConversations.filter(c => c.status === 'pending').length;
  const avgEVScore = metrics.averageEVScore;
  const highPriority = processedConversations.filter(c => c.priority === 'high' || c.priority === 'urgent').length;

  return (
    <div className={cn("flex items-center space-x-6", className)}>
      {/* Active Conversations */}
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-blue-100 rounded-lg">
          <MessageSquare className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <div className="text-sm font-medium text-gray-600">Active</div>
          <div className="text-lg font-bold text-blue-600">{metrics.active}</div>
        </div>
      </div>

      {/* Pending Emails */}
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <Mail className="w-4 h-4 text-yellow-600" />
        </div>
        <div>
          <div className="text-sm font-medium text-gray-600">Pending</div>
          <div className="text-lg font-bold text-yellow-600">{pendingEmails}</div>
        </div>
      </div>

      {/* EV Score */}
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-green-100 rounded-lg">
          <Target className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <div className="text-sm font-medium text-gray-600">EV Score</div>
          <div className="text-lg font-bold text-green-600">{avgEVScore.toFixed(1)}</div>
        </div>
      </div>

      {/* High Priority */}
      {highPriority > 0 && (
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-red-100 rounded-lg">
            <Clock className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Priority</div>
            <div className="text-lg font-bold text-red-600">{highPriority}</div>
          </div>
        </div>
      )}

      {/* View All Metrics Button */}
      <button
        onClick={onShowMetrics}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
      >
        <BarChart3 className="w-4 h-4" />
        <span>View All</span>
      </button>
    </div>
  );
} 