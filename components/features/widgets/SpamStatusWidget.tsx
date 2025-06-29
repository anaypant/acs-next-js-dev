/**
 * Spam Status Widget Component
 * Manages spam detection and filtering
 */

import React from 'react';
import { BaseWidget } from './BaseWidget';
import { SpamStatusWidgetContent } from './SpamStatusWidgetContent';
import type { WidgetInstance, WidgetActions, WidgetState } from '@/types/widgets';
import type { Conversation } from '@/types/conversation';

interface SpamStatusWidgetProps {
  widget: WidgetInstance;
  conversation: Conversation | null;
  actions: WidgetActions;
  state: WidgetState;
  onRemoveWidget: (widgetId: string) => void;
  onMakeWidgetFloat?: (widgetId: string, position: { x: number; y: number }) => void;
  className?: string;
}

export function SpamStatusWidget({ 
  widget,
  conversation,
  actions,
  state,
  onRemoveWidget,
  onMakeWidgetFloat,
  className 
}: SpamStatusWidgetProps) {
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
      <SpamStatusWidgetContent
        conversation={conversation}
        actions={actions}
        state={state}
        className="w-full h-full"
      />
    </BaseWidget>
  );
} 