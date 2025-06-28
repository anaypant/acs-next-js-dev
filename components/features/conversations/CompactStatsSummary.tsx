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
  const highPriority = processedConversations.filter(c => 
    c.status === 'pending' || (c.evScore !== null && c.evScore > 80)
  ).length;

  return (
    <div className={cn("flex items-center space-x-6", className)}>
      {/* Active Conversations */}
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-status-info/10 rounded-lg">
          <MessageSquare className="w-4 h-4 text-status-info" />
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">Active</div>
          <div className="text-lg font-bold text-status-info">{metrics.active}</div>
        </div>
      </div>

      {/* Pending Emails */}
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-status-warning/10 rounded-lg">
          <Mail className="w-4 h-4 text-status-warning" />
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">Pending</div>
          <div className="text-lg font-bold text-status-warning">{pendingEmails}</div>
        </div>
      </div>

      {/* EV Score */}
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-status-success/10 rounded-lg">
          <Target className="w-4 h-4 text-status-success" />
        </div>
        <div>
          <div className="text-sm font-medium text-muted-foreground">EV Score</div>
          <div className="text-lg font-bold text-status-success">{avgEVScore.toFixed(1)}</div>
        </div>
      </div>

      {/* High Priority */}
      {highPriority > 0 && (
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-status-error/10 rounded-lg">
            <Clock className="w-4 h-4 text-status-error" />
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Priority</div>
            <div className="text-lg font-bold text-status-error">{highPriority}</div>
          </div>
        </div>
      )}

      {/* View All Metrics Button */}
      <button
        onClick={onShowMetrics}
        className="flex items-center space-x-2 px-3 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm"
      >
        <BarChart3 className="w-4 h-4" />
        <span>View All</span>
      </button>
    </div>
  );
} 