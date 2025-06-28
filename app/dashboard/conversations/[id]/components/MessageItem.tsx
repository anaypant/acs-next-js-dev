import React from 'react';
import { format } from 'date-fns';
import { ThumbsUp, ThumbsDown, User, Bot, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatLocalTimeOnly } from '@/app/utils/timezone';
import type { Message } from '@/types/conversation';

/**
 * Message Item Component
 * Displays individual messages with feedback options
 */
export interface MessageItemProps {
  message: Message;
  index: number;
  clientEmail: string;
  feedback: Record<string, 'like' | 'dislike'>;
  evFeedback: Record<string, 'positive' | 'negative'>;
  updatingFeedbackId: string | null;
  updatingEvFeedbackId: string | null;
  onResponseFeedback: (messageId: string, feedback: 'like' | 'dislike') => void;
  onEvFeedback: (messageId: string, feedback: 'positive' | 'negative') => void;
  onReport: (messageId: string) => void;
}

export function MessageItem({
  message,
  index,
  clientEmail,
  feedback,
  evFeedback,
  updatingFeedbackId,
  updatingEvFeedbackId,
  onResponseFeedback,
  onEvFeedback,
  onReport
}: MessageItemProps) {
  // Fixed logic to determine if message is from user or client
  // Inbound emails are from the client/customer
  // Outbound emails are from the user/AI system
  const isUser = message.type === "outbound-email";
  
  const currentEvFeedback = evFeedback[message.id];
  const currentFeedback = feedback[message.id];
  const isEvUpdating = updatingEvFeedbackId === message.id;
  const isUpdating = updatingFeedbackId === message.id;

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-md w-full flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <div className={`rounded-xl px-6 py-4 shadow-sm ${isUser ? "bg-gradient-to-br from-secondary to-secondary-dark text-secondary-foreground" : "bg-muted text-card-foreground border"}`}>
          <div className="whitespace-pre-line text-base">{message.body}</div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
          <span>{isUser ? "You" : (message.sender_name || message.sender_email || clientEmail)}</span>
          <span>·</span>
          <span>{message.localDate ? formatLocalTimeOnly(message.localDate.toISOString()) : ""}</span>
          {!isUser && typeof message.ev_score === 'number' && message.ev_score >= 0 && message.ev_score <= 100 && (
            <span className="ml-2 flex items-center gap-1">
              <span className="font-semibold text-green-700">EV {message.ev_score}</span>
              {!isEvUpdating && (
                <>
                  <button
                    onClick={() => onEvFeedback(message.id, 'positive')}
                    disabled={isEvUpdating}
                    className={cn(
                      "p-1 rounded-md transition-colors",
                      currentEvFeedback === 'positive' ? "bg-green-100 text-green-700" : "hover:bg-gray-100 text-gray-500",
                      isEvUpdating && "animate-pulse"
                    )}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEvFeedback(message.id, 'negative')}
                    disabled={isEvUpdating}
                    className={cn(
                      "p-1 rounded-md transition-colors",
                      currentEvFeedback === 'negative' ? "bg-red-100 text-red-700" : "hover:bg-gray-100 text-gray-500",
                      isEvUpdating && "animate-pulse"
                    )}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </>
              )}
            </span>
          )}
          {isUser && !isUpdating && (
            <span className="ml-2 flex items-center gap-1">
              <button
                onClick={() => onResponseFeedback(message.id, 'like')}
                disabled={isUpdating}
                className={cn(
                  "p-1 rounded-md transition-colors",
                  currentFeedback === 'like' ? "bg-green-100 text-green-700" : "hover:bg-gray-100 text-gray-500",
                  isUpdating && "animate-pulse"
                )}
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => onResponseFeedback(message.id, 'dislike')}
                disabled={isUpdating}
                className={cn(
                  "p-1 rounded-md transition-colors",
                  currentFeedback === 'dislike' ? "bg-red-100 text-red-700" : "hover:bg-gray-100 text-gray-500",
                  isUpdating && "animate-pulse"
                )}
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
              <button
                className="p-0.5 rounded-full hover:bg-gray-100 text-gray-400"
                onClick={() => onReport(message.id)}
                aria-label="Report response"
                title="Report this AI response"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 