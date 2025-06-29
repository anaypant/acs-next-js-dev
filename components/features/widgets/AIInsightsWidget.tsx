/**
 * AI Insights Widget Component
 * Displays AI-powered conversation analysis and extracted information
 */

import React from 'react';
import { BaseWidget } from './BaseWidget';
import { AIInsightsWidgetContent } from './AIInsightsWidgetContent';
import type { WidgetInstance, WidgetActions, WidgetState } from '@/types/widgets';
import type { Conversation } from '@/types/conversation';

interface AIInsightsWidgetProps {
  widget: WidgetInstance;
  conversation: Conversation | null;
  actions: WidgetActions;
  state: WidgetState;
  onRemoveWidget: (widgetId: string) => void;
  onMakeWidgetFloat?: (widgetId: string, position: { x: number; y: number }) => void;
  className?: string;
}

export function AIInsightsWidget({ 
  widget,
  conversation, 
  actions,
  state,
  onRemoveWidget,
  onMakeWidgetFloat,
  className 
}: AIInsightsWidgetProps) {
  return (
    <BaseWidget
      widget={widget}
      conversation={conversation}
      actions={actions}
      state={state}
      onRemoveWidget={onRemoveWidget}
      onMakeWidgetFloat={onMakeWidgetFloat}
      className={className}
    >
      <AIInsightsWidgetContent
        conversation={conversation}
        className="w-full h-full"
      />
    </BaseWidget>
  );
} 