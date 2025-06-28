import { ChevronLeft, ChevronRight } from "lucide-react"

/**
 * Column Toggle Button Component
 * Provides expand/collapse functionality for columns
 */
export function ColumnToggleButton({ 
  isExpanded, 
  onToggle, 
  position,
  label
}: { 
  isExpanded: boolean; 
  onToggle: () => void; 
  position: 'left' | 'right';
  label?: string;
}) {
  return (
    <button
      onClick={onToggle}
      className={`acs-toggle-btn group ${position}`}
      title={isExpanded ? `Collapse ${position} panel` : `Expand ${position} panel`}
      aria-label={label || (isExpanded ? `Collapse ${position} panel` : `Expand ${position} panel`)}
      type="button"
    >
      <span className="sr-only">{label || (isExpanded ? `Collapse ${position} panel` : `Expand ${position} panel`)}</span>
      <span className="flex items-center justify-center">
        {isExpanded ? (
          position === 'left' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />
        ) : (
          position === 'left' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />
        )}
      </span>
      <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
        {isExpanded ? `Collapse` : `Expand`}
      </span>
    </button>
  );
}

/**
 * Collapsible Column Component
 * Wraps content with expand/collapse functionality
 */
export function CollapsibleColumn({ 
  isExpanded, 
  children, 
  position 
}: { 
  isExpanded: boolean; 
  children: React.ReactNode; 
  position: 'left' | 'right';
}) {
  return (
    <div className={`column-transition ${isExpanded ? 'column-expanded' : 'column-collapsed'}`}>
      {children}
    </div>
  );
} 