/**
 * Notes Widget Component
 * Add and manage conversation notes
 */

import React from 'react';
import { BaseWidget } from './BaseWidget';
import { NotesWidgetContent } from './NotesWidgetContent';
import type { WidgetInstance, WidgetActions, WidgetState } from '@/types/widgets';
import type { Conversation } from '@/types/conversation';

interface NotesWidgetProps {
  widget: WidgetInstance;
  conversation: Conversation | null;
  actions: WidgetActions;
  state: WidgetState;
  onRemoveWidget: (widgetId: string) => void;
  onMakeWidgetFloat?: (widgetId: string, position: { x: number; y: number }) => void;
  className?: string;
}

export function NotesWidget({ 
  widget,
  conversation,
  actions,
  state,
  onRemoveWidget,
  onMakeWidgetFloat,
  className 
}: NotesWidgetProps) {
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
      <NotesWidgetContent className="w-full h-full" />
    </BaseWidget>
  );
} 