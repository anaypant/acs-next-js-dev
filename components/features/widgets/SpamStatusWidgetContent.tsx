/**
 * Spam Status Widget Content Component
 * Contains only the spam status-specific content without header controls
 */

import React from 'react';
import { Shield, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WidgetActions, WidgetState } from '@/types/widgets';
import type { Conversation } from '@/types/conversation';

interface SpamStatusWidgetContentProps {
  conversation: Conversation | null;
  actions: WidgetActions;
  state: WidgetState;
  className?: string;
}

export function SpamStatusWidgetContent({ 
  conversation,
  actions,
  state,
  className 
}: SpamStatusWidgetContentProps) {
  const isSpam = conversation?.thread?.spam || false;
  
  if (!isSpam) return null;
  
  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 p-2 bg-card border border-border/40 rounded-lg shadow-sm">
          <div className="w-6 h-6 bg-status-warning/10 rounded-full flex items-center justify-center border border-status-warning/20 flex-shrink-0">
            <Shield className="h-3 w-3 text-status-warning" />
          </div>
          <p className="text-xs text-muted-foreground">
            This conversation has been flagged as potential spam
          </p>
        </div>
        
        <button
          onClick={actions.onMarkAsNotSpam}
          disabled={state.updatingSpam}
          className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 bg-card border border-border/40 text-card-foreground rounded-md hover:bg-muted hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs shadow-sm"
        >
          {state.updatingSpam ? (
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <ShieldCheck className="w-3 h-3 text-status-success" />
          )}
          <span>Mark as Not Spam</span>
        </button>
      </div>
    </div>
  );
} 