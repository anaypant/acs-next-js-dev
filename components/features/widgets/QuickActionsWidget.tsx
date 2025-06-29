/**
 * Quick Actions Widget Component
 * Common actions and shortcuts
 */

import React from 'react';
import { BaseWidget } from './BaseWidget';
import { QuickActionsWidgetContent } from './QuickActionsWidgetContent';
import type { WidgetInstance, WidgetActions, WidgetState } from '@/types/widgets';
import type { Conversation } from '@/types/conversation';

interface QuickActionsWidgetProps {
  widget: WidgetInstance;
  conversation: Conversation | null;
  actions: WidgetActions;
  state: WidgetState;
  onRemoveWidget: (widgetId: string) => void;
  onMakeWidgetFloat?: (widgetId: string, position: { x: number; y: number }) => void;
  className?: string;
}

export function QuickActionsWidget({ 
  widget,
  conversation,
  actions,
  state,
  onRemoveWidget,
  onMakeWidgetFloat,
  className 
}: QuickActionsWidgetProps) {
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
      <QuickActionsWidgetContent
        actions={actions}
        className="w-full h-full"
      />
    </BaseWidget>
  );
} 