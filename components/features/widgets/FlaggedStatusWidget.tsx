/**
 * Flagged Status Widget Component
 * Manages conversation flags and completion status
 */

import React from 'react';
import { BaseWidget } from './BaseWidget';
import { FlaggedStatusWidgetContent } from './FlaggedStatusWidgetContent';
import type { WidgetInstance, WidgetActions, WidgetState } from '@/types/widgets';
import type { Conversation } from '@/types/conversation';

interface FlaggedStatusWidgetProps {
  widget: WidgetInstance;
  conversation: Conversation | null;
  actions: WidgetActions;
  state: WidgetState;
  onRemoveWidget: (widgetId: string) => void;
  onMakeWidgetFloat?: (widgetId: string, position: { x: number; y: number }) => void;
  className?: string;
}

export function FlaggedStatusWidget({ 
  widget,
  conversation,
  actions,
  state,
  onRemoveWidget,
  onMakeWidgetFloat,
  className 
}: FlaggedStatusWidgetProps) {
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
      <FlaggedStatusWidgetContent
        conversation={conversation}
        actions={actions}
        state={state}
        className="w-full h-full"
      />
    </BaseWidget>
  );
} 