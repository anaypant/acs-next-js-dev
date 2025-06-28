/**
 * File: components/features/conversations/ConversationCard.tsx
 * Purpose: Consolidated conversation card component for displaying conversations across the application
 * Author: AI Assistant
 * Date: 2024-12-19
 * Version: 2.1.0 - Updated to use optimistic conversations system
 */

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle, 
  ChevronRight, 
  Clock, 
  Flag, 
  Trash2, 
  Shield, 
  ShieldOff,
  MessageSquare
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatLocalTime } from '@/app/utils/timezone';
import { 
  getMostRecentMessage, 
  getConversationTitle, 
  getLatestEvaluableMessage 
} from '@/lib/utils/conversation';
import { useOptimisticConversations } from '@/hooks/useOptimisticConversations';
import type { Conversation } from '@/types/conversation';

// Props interface for the consolidated component
interface ConversationCardProps {
  conversation: Conversation;
  variant?: 'simple' | 'detailed';
  showActions?: boolean;
  // Remove the old callback props since we'll use the optimistic hook
}

// Color palette for conversation avatars
const CONVERSATION_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
  '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71',
  '#F1C40F', '#1ABC9C', '#E74C3C', '#34495E', '#16A085'
];

// Get consistent color for a conversation
const getConversationColor = (conversationId: string) => {
  if (!conversationId) return CONVERSATION_COLORS[0];
  const hash = conversationId.slice(0, 8).split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return CONVERSATION_COLORS[Math.abs(hash) % CONVERSATION_COLORS.length];
};

// Get initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0]?.toUpperCase())
    .join('')
    .slice(0, 2);
};

// Get EV score color
const getEvScoreColor = (score: number) => {
  const s = Math.max(0, Math.min(100, score));
  let h = 0;
  if (s <= 50) {
    h = 0 + (48 - 0) * (s / 50);
  } else {
    h = 48 + (142 - 48) * ((s - 50) / 50);
  }
  return {
    backgroundColor: `hsl(${h}, 95%, 90%)`,
    color: `hsl(${h}, 60%, 30%)`,
  };
};

export function ConversationCard({ 
  conversation, 
  variant = 'detailed',
  showActions = true
}: ConversationCardProps) {
  const router = useRouter();
  const { thread, messages } = conversation;

  // Use the optimistic conversations hook for actions
  const { 
    markAsRead, 
    toggleLcp, 
    deleteConversation 
  } = useOptimisticConversations();

  // Local state for optimistic updates
  const [localLcpEnabled, setLocalLcpEnabled] = useState(thread.lcp_enabled || false);
  const [localRead, setLocalRead] = useState(thread.read || false);
  const [isUpdatingLcp, setIsUpdatingLcp] = useState(false);
  const [isUpdatingRead, setIsUpdatingRead] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    setLocalLcpEnabled(thread.lcp_enabled || false);
    setLocalRead(thread.read || false);
  }, [thread.lcp_enabled, thread.read]);

  // Get the most recent message using centralized utility
  const mostRecentMessage = getMostRecentMessage(conversation);

  // Get conversation details using centralized utilities
  const conversationName = getConversationTitle(conversation);
  const subject = mostRecentMessage?.subject || 'No subject';
  const lastMessageTime = mostRecentMessage?.timestamp ? formatLocalTime(mostRecentMessage.timestamp) : null;
  const messageCount = messages.length;
  const isUnread = !localRead;
  const isFlagged = thread.flag;
  const isFlaggedForReview = thread.flag_for_review;
  const isPendingReply = mostRecentMessage?.type === 'inbound-email';

  // Get conversation color and initials
  const avatarColor = getConversationColor(thread.conversation_id);
  const initials = getInitials(conversationName);

  // Find the most recent evaluable message for EV score using centralized utility
  const evMessage = getLatestEvaluableMessage(conversation);
  const ev_score = evMessage ? (typeof evMessage.ev_score === 'string' ? parseFloat(evMessage.ev_score) : evMessage.ev_score) : -1;
  const score = typeof ev_score === 'number' && !isNaN(ev_score) ? ev_score : -1;
  const evColorStyle = score >= 0 ? getEvScoreColor(score) : { backgroundColor: '#e5e7eb', color: '#374151' };

  const handleClick = async () => {
    if (isUnread) {
      setIsUpdatingRead(true);
      try {
        const success = await markAsRead(thread.conversation_id);
        if (success) {
          setLocalRead(true);
        }
      } catch (error) {
        console.error('Error marking as read:', error);
      } finally {
        setIsUpdatingRead(false);
      }
    } else {
      router.push(`/dashboard/conversations/${thread.conversation_id}`);
    }
  };

  const handleLcpToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpdatingLcp) return;

    setIsUpdatingLcp(true);
    try {
      // Optimistically update local state
      setLocalLcpEnabled(!localLcpEnabled);
      
      const success = await toggleLcp(thread.conversation_id);
      if (!success) {
        // Rollback on failure
        setLocalLcpEnabled(localLcpEnabled);
      }
    } catch (error) {
      // Rollback on error
      setLocalLcpEnabled(localLcpEnabled);
      console.error('Error toggling LCP:', error);
    } finally {
      setIsUpdatingLcp(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDeleting) return;

    if (confirm(`Are you sure you want to delete the conversation "${conversationName}"?`)) {
      setIsDeleting(true);
      try {
        const success = await deleteConversation(thread.conversation_id);
        if (!success) {
          console.error('Failed to delete conversation');
        }
      } catch (error) {
        console.error('Error deleting conversation:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (variant === 'simple') {
    return (
      <div
        className={`relative p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${
          isUpdatingRead || isUpdatingLcp || isDeleting ? 'opacity-50 pointer-events-none' : ''
        } ${isFlagged ? 'border-status-success/20 bg-status-success/5' : isFlaggedForReview ? 'border-status-warning/20 bg-status-warning/5' : 'border-border'}`}
        onClick={handleClick}
      >
        {/* Status badges */}
        {isFlagged && (
          <div className="absolute -top-2 -right-2 bg-status-success text-status-success-foreground px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span className="hidden sm:inline">Complete</span>
          </div>
        )}
        {!isFlagged && isFlaggedForReview && (
          <div className="absolute -top-2 -right-2 bg-status-warning text-status-warning-foreground px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1">
            <Flag className="w-3 h-3" />
            <span className="hidden sm:inline">Review</span>
          </div>
        )}

        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
              style={{ backgroundColor: avatarColor }}
            >
              <span className="text-sm font-semibold text-white">
                {initials}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-medium text-card-foreground truncate">
                {conversationName}
              </h4>
              <div className="flex items-center gap-2">
                {isUnread && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-status-error/10 text-status-error text-xs rounded-full font-semibold">
                    <Bell className="w-3 h-3" />
                    <span className="hidden sm:inline">New</span>
                  </div>
                )}
                {isPendingReply && (
                  <div className="flex items-center gap-1 text-status-warning" title="Awaiting your reply">
                    <Clock className="w-3 h-3" />
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground font-medium mb-1 truncate">
              {subject}
            </p>

            {thread.ai_summary && (
              <p className="text-xs text-muted-foreground/70 mb-2 line-clamp-2">
                {thread.ai_summary}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span>{messageCount} message{messageCount !== 1 ? 's' : ''}</span>
                {lastMessageTime && (
                  <span>{lastMessageTime.toLocaleString()}</span>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Detailed variant
  return (
    <div
      className={`flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors relative ${
        isUpdatingRead || isUpdatingLcp || isDeleting ? 'opacity-50 pointer-events-none' : ''
      } ${
        isFlagged
          ? 'border-status-success/20 bg-status-success/5'
          : isFlaggedForReview
          ? 'border-status-warning/20 bg-status-warning/5'
          : 'border-border'
      }`}
      onClick={handleClick}
    >
      {/* Status badges */}
      {!isFlagged && isFlaggedForReview && (
        <div className="absolute -top-2 -right-2 bg-status-warning text-status-warning-foreground px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1">
          <Flag className="w-3 h-3" />
          <span className="hidden xs:inline">Flagged for Review</span>
          <span className="xs:hidden">Review</span>
        </div>
      )}
      {isFlagged && (
        <div className="absolute -top-2 -right-2 bg-status-success text-status-success-foreground px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          <span className="hidden xs:inline">Flagged for Completion</span>
          <span className="xs:hidden">Complete</span>
        </div>
      )}

      {/* Avatar and Status Column */}
      <div className="flex flex-row sm:flex-col items-center justify-start gap-2 sm:gap-0 sm:w-10 md:w-12 pt-1">
        {isUnread && !isUpdatingRead && (
          <button
            className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-status-error/10 text-status-error text-xs rounded-full font-semibold shadow-md z-10 hover:bg-status-error/20 transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            disabled={isUpdatingRead}
          >
            <Bell className="w-3 h-3" />
            <span className="hidden sm:inline">Mark as Read</span>
            <span className="sm:hidden">Read</span>
          </button>
        )}
        {isUpdatingRead && (
          <div className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-muted text-muted-foreground text-xs rounded-full font-semibold">
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span className="hidden sm:inline">Updating...</span>
            <span className="sm:hidden">...</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col sm:flex-row items-start gap-3 sm:gap-4 min-w-0">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm"
            style={{ backgroundColor: avatarColor }}
          >
            <span className="text-sm font-semibold text-white">
              {initials}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-card-foreground truncate">
              {conversationName}
            </h4>
            <div className="flex items-center gap-2">
              {isPendingReply && (
                <div className="flex items-center gap-1 text-status-warning" title="Awaiting your reply">
                  <Clock className="w-4 h-4" />
                </div>
              )}
              {score >= 0 && (
                <div 
                  className="px-2 py-1 rounded-full text-xs font-semibold"
                  style={evColorStyle}
                >
                  EV {score}
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground font-medium mb-1 truncate">
            {subject}
          </p>

          {thread.ai_summary && (
            <p className="text-xs text-muted-foreground/70 mb-2 line-clamp-2">
              {thread.ai_summary}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>{messageCount} message{messageCount !== 1 ? 's' : ''}</span>
              {lastMessageTime && (
                <span>{lastMessageTime.toLocaleString()}</span>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          </div>
        </div>
      </div>

      {/* Actions Column */}
      {showActions && (
        <div className="flex flex-row sm:flex-col items-center justify-end gap-2 sm:gap-1">
          {/* LCP Toggle */}
          <button
            className={`p-2 rounded-lg transition-colors ${
              localLcpEnabled 
                ? 'bg-status-success/10 text-status-success hover:bg-status-success/20' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
            onClick={handleLcpToggle}
            disabled={isUpdatingLcp}
            title={localLcpEnabled ? 'Disable LCP' : 'Enable LCP'}
          >
            {isUpdatingLcp ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : localLcpEnabled ? (
              <Shield className="w-4 h-4" />
            ) : (
              <ShieldOff className="w-4 h-4" />
            )}
          </button>

          {/* Delete Button */}
          <button
            className="p-2 rounded-lg bg-status-error/10 text-status-error hover:bg-status-error/20 transition-colors"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete conversation"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
} 