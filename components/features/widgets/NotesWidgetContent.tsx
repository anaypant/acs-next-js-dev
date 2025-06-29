/**
 * Notes Widget Content Component
 * Contains only the notes-specific content without header controls
 */

import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotesWidgetContentProps {
  className?: string;
}

export function NotesWidgetContent({ className }: NotesWidgetContentProps) {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement save notes functionality
      // await saveNotes(conversation.thread.conversation_id, notes);
    } catch (error) {
      console.error('Failed to save notes:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 min-h-0">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this conversation..."
            className="w-full h-full min-h-[60px] p-2 bg-card border border-border/40 rounded-md text-xs text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary shadow-sm hover:shadow-md transition-shadow"
          />
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium mt-2"
        >
          {isSaving ? (
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-3 h-3" />
          )}
          <span>{isSaving ? 'Saving...' : 'Save Notes'}</span>
        </button>
      </div>
    </div>
  );
} 