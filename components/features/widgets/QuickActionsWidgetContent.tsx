/**
 * Quick Actions Widget Content Component
 * Contains only the quick actions-specific content without header controls
 */

import React from 'react';
import { Zap, Send, Sparkles, FileText, Download, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WidgetActions } from '@/types/widgets';

interface QuickActionsWidgetContentProps {
  actions: WidgetActions;
  className?: string;
}

export function QuickActionsWidgetContent({ 
  actions,
  className 
}: QuickActionsWidgetContentProps) {
  const quickActions = [
    {
      icon: <Send className="w-2.5 h-2.5" />,
      label: 'Send Email',
      action: actions.onSendEmail,
      variant: 'primary' as const
    },
    {
      icon: <Sparkles className="w-2.5 h-2.5" />,
      label: 'Generate AI Response',
      action: actions.onGenerateResponse,
      variant: 'secondary' as const
    },
    {
      icon: <FileText className="w-2.5 h-2.5" />,
      label: 'Generate PDF',
      action: () => {
        // TODO: Implement PDF generation
        console.log('Generate PDF');
      },
      variant: 'outline' as const
    },
    {
      icon: <Copy className="w-2.5 h-2.5" />,
      label: 'Copy Conversation',
      action: () => {
        // TODO: Implement copy conversation
        console.log('Copy conversation');
      },
      variant: 'outline' as const
    }
  ];

  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      <div className="flex-1">
        <div className="grid grid-cols-2 gap-1.5 h-full">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={cn(
                "flex flex-col items-center gap-1 p-1.5 rounded-md text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md border",
                action.variant === 'primary' && "bg-primary text-primary-foreground hover:bg-primary/90 border-primary/60",
                action.variant === 'secondary' && "bg-secondary text-secondary-foreground hover:bg-secondary/90 border-secondary/60",
                action.variant === 'outline' && "bg-card border-border/40 text-card-foreground hover:bg-muted hover:border-primary/50"
              )}
            >
              {action.icon}
              <span className="text-center leading-tight">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 