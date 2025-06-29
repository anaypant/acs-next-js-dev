/**
 * AI Insights Widget Content Component
 * Contains only the AI insights-specific content without header controls
 */

import React from 'react';
import { DollarSign, Calendar, Home, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/types/conversation';

interface InsightItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

interface AIInsightsWidgetContentProps {
  conversation: Conversation | null;
  className?: string;
}

export function AIInsightsWidgetContent({ 
  conversation, 
  className 
}: AIInsightsWidgetContentProps) {
  if (!conversation?.thread) return null;

  const {
    ai_summary,
    budget_range,
    timeline,
    preferred_property_types,
    priority,
    flag,
    spam,
    busy,
    lcp_enabled
  } = conversation.thread;

  // Extract insights from thread data
  const insights: InsightItem[] = [
    {
      icon: <DollarSign className="w-2.5 h-2.5" />,
      label: 'Budget',
      value: budget_range || 'Not specified',
      color: 'text-status-success'
    },
    {
      icon: <Calendar className="w-2.5 h-2.5" />,
      label: 'Timeline',
      value: timeline || 'Not specified',
      color: 'text-status-info'
    },
    {
      icon: <Home className="w-2.5 h-2.5" />,
      label: 'Property Type',
      value: preferred_property_types || 'Not specified',
      color: 'text-secondary'
    },
    {
      icon: <Target className="w-2.5 h-2.5" />,
      label: 'Priority',
      value: priority || 'Standard',
      color: 'text-status-warning'
    }
  ];

  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      <div className="space-y-2 flex-1">
        {/* AI Summary */}
        {ai_summary && (
          <div>
            <h4 className="text-xs font-medium text-foreground mb-1">Summary</h4>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {ai_summary}
            </p>
          </div>
        )}

        {/* Extracted Information */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-medium text-foreground">Extracted Information</h4>
          {insights.map((insight, index) => (
            <div key={index} className="flex items-center gap-1.5 p-1.5 bg-card border border-border/40 rounded-md hover:shadow-sm transition-shadow">
              <div className={cn(
                "w-4 h-4 bg-muted rounded flex items-center justify-center border border-border/40 flex-shrink-0",
                insight.color
              )}>
                {insight.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">{insight.label}</p>
                <p className="text-xs text-muted-foreground truncate">{insight.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Conversation Status */}
        <div className="pt-1.5 border-t border-border/40">
          <h4 className="text-xs font-medium text-foreground mb-1">Status</h4>
          <div className="flex flex-wrap gap-1">
            {flag && (
              <span className="px-1 py-0.5 bg-status-error/10 text-status-error text-xs rounded-full">
                Flagged
              </span>
            )}
            {spam && (
              <span className="px-1 py-0.5 bg-status-warning/10 text-status-warning text-xs rounded-full">
                Spam
              </span>
            )}
            {busy && (
              <span className="px-1 py-0.5 bg-status-warning/10 text-status-warning text-xs rounded-full">
                Busy
              </span>
            )}
            {lcp_enabled && (
              <span className="px-1 py-0.5 bg-status-success/10 text-status-success text-xs rounded-full">
                LCP Enabled
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 