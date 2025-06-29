/**
 * Flagged Status Widget Content Component
 * Contains only the flagged status-specific content without header controls
 */

import React from 'react';
import { Flag, CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WidgetActions, WidgetState } from '@/types/widgets';
import type { Conversation } from '@/types/conversation';

interface FlaggedStatusWidgetContentProps {
  conversation: Conversation | null;
  actions: WidgetActions;
  state: WidgetState;
  className?: string;
}

export function FlaggedStatusWidgetContent({ 
  conversation,
  actions,
  state,
  className 
}: FlaggedStatusWidgetContentProps) {
  const isFlagged = conversation?.thread?.flag_for_review || false;
  const isFlaggedForCompletion = conversation?.thread?.flag || false;
  
  if (!isFlagged && !isFlaggedForCompletion) return null;
  
  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-1.5 p-1.5 bg-card border border-border/40 rounded-md shadow-sm">
          <div className="w-5 h-5 bg-status-warning/10 rounded-full flex items-center justify-center border border-status-warning/20 flex-shrink-0">
            <Flag className="h-2.5 w-2.5 text-status-warning" />
          </div>
          <p className="text-xs text-muted-foreground">
            {isFlaggedForCompletion 
              ? 'This conversation is ready to be marked as complete'
              : 'This conversation needs human attention'
            }
          </p>
        </div>
        
        <div className="space-y-1">
          {isFlagged && (
            <button
              onClick={actions.onUnflag}
              disabled={state.unflagging}
              className="w-full flex items-center justify-center gap-1 px-1.5 py-1 bg-card border border-border/40 text-card-foreground rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
            >
              {state.unflagging ? (
                <div className="w-2.5 h-2.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle className="w-2.5 h-2.5 text-status-success" />
              )}
              <span>Clear Flag</span>
            </button>
          )}
          
          {isFlaggedForCompletion && actions.onComplete && (
            <button
              onClick={actions.onComplete}
              className="w-full flex items-center justify-center gap-1 px-1.5 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-xs"
            >
              <CheckCircle className="w-2.5 h-2.5" />
              <span>Complete Conversation</span>
            </button>
          )}
          
          {isFlaggedForCompletion && actions.onClearFlag && (
            <button
              onClick={actions.onClearFlag}
              disabled={state.clearingFlag}
              className="w-full flex items-center justify-center gap-1 px-1.5 py-1 bg-card border border-border/40 text-card-foreground rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
            >
              {state.clearingFlag ? (
                <div className="w-2.5 h-2.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <X className="w-2.5 h-2.5" />
              )}
              <span>Clear Completion Flag</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 