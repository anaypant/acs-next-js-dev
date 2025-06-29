/**
 * Single Column Widget Layout Component
 * Provides a single column grid-based widget system with snap-to-grid functionality
 * Uses ACS theme colors and follows component standards
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Plus, Grid3X3, X, Move, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WidgetInstance, WidgetConfig, GridLayout, GridCell } from '@/types/widgets';
import type { Conversation } from '@/types/conversation';
import type { WidgetActions, WidgetState } from '@/types/widgets';

// Import widget components
import { ContactWidget } from './ContactWidget';
import { AIInsightsWidget } from './AIInsightsWidget';
import { FlaggedStatusWidget } from './FlaggedStatusWidget';
import { SpamStatusWidget } from './SpamStatusWidget';
import { NotesWidget } from './NotesWidget';
import { QuickActionsWidget } from './QuickActionsWidget';

interface SingleColumnWidgetLayoutProps {
  widgets: WidgetInstance[];
  conversation: Conversation | null;
  actions: WidgetActions;
  state: WidgetState;
  onAddWidget: () => void;
  onRemoveWidget: (widgetId: string) => void;
  onMoveWidget: (widgetId: string, newPosition: { x: number; y: number }) => void;
  onReorderColumnWidgets?: (draggedWidgetId: string, targetIndex: number) => void;
  onMakeWidgetFloat?: (widgetId: string, position: { x: number; y: number }) => void;
  className?: string;
}

// Grid configuration
const GRID_CONFIG = {
  columns: 1,
  rows: 4,
  minHeight: 400
};

// Widget component mapping
const WIDGET_COMPONENTS = {
  'contact': ContactWidget,
  'ai-insights': AIInsightsWidget,
  'flagged-status': FlaggedStatusWidget,
  'spam-status': SpamStatusWidget,
  'notes': NotesWidget,
  'quick-actions': QuickActionsWidget,
} as const;

export function SingleColumnWidgetLayout({
  widgets,
  conversation,
  actions,
  state,
  onAddWidget,
  onRemoveWidget,
  onMoveWidget,
  onReorderColumnWidgets,
  onMakeWidgetFloat,
  className
}: SingleColumnWidgetLayoutProps) {
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [screenWidth, setScreenWidth] = useState<number>(1200);
  const [dragStartPosition, setDragStartPosition] = useState<{ x: number; y: number } | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [draggedWidgetIndex, setDraggedWidgetIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      setScreenWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Calculate responsive grid dimensions
  const gridDimensions = useMemo(() => {
    // Base dimensions that work well across different screen sizes
    let baseCellSize = 80; // Smaller base size for better mobile support
    let baseGap = 8;
    let basePadding = 12;
    
    // Responsive adjustments based on screen size
    if (screenWidth >= 1200) {
      // Large screens - larger cells
      baseCellSize = 100;
      baseGap = 12;
      basePadding = 16;
    } else if (screenWidth >= 768) {
      // Medium screens - medium cells
      baseCellSize = 90;
      baseGap = 10;
      basePadding = 14;
    } else {
      // Small screens - smaller cells
      baseCellSize = 70;
      baseGap = 8;
      basePadding = 12;
    }
    
    return {
      cellSize: baseCellSize,
      gap: baseGap,
      padding: basePadding,
      totalWidth: baseCellSize + baseGap,
      minHeight: Math.max(GRID_CONFIG.minHeight, GRID_CONFIG.rows * baseCellSize + (GRID_CONFIG.rows - 1) * baseGap + basePadding * 2)
    };
  }, [screenWidth]);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, widget: WidgetInstance) => {
    setDraggedWidget(widget.id);
    setDragStartPosition({ x: e.clientX, y: e.clientY });
    e.dataTransfer.setData('text/plain', widget.id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Track the original index of the dragged widget
    const columnWidgets = widgets.filter(w => !w.isFloating);
    const originalIndex = columnWidgets.findIndex(w => w.id === widget.id);
    setDraggedWidgetIndex(originalIndex);
    
    // Set cursor to indicate dragging
    (e.currentTarget as HTMLElement).style.cursor = 'grabbing';
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (!draggedWidget || !containerRef.current) return;
    
    // Track drag position for visual feedback
    setDragPosition({ x: e.clientX, y: e.clientY });
    
    // Get dashboard bounds for responsive column detection
    const dashboard = document.querySelector('[data-dashboard-layout]') as HTMLElement;
    if (!dashboard) return;
    
    const dashboardRect = dashboard.getBoundingClientRect();
    
    // Calculate responsive column width
    let columnWidth;
    if (dashboardRect.width >= 1024) {
      columnWidth = dashboardRect.width * 0.33;
    } else if (dashboardRect.width >= 768) {
      columnWidth = dashboardRect.width * 0.4;
    } else {
      columnWidth = dashboardRect.width * 0.5;
    }
    
    const columnRight = dashboardRect.left + columnWidth;
    
    // Check if within column bounds for reordering
    const isWithinColumn = e.clientX <= columnRight;
    
    if (isWithinColumn) {
      setIsReordering(true);
      
      // Use improved drop target calculation
      const targetIndex = calculateDropTarget(e.clientY);
      setDropTargetIndex(targetIndex);
    } else {
      setIsReordering(false);
      setDropTargetIndex(null);
    }
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedWidget || !dragStartPosition) return;
    
    // Get dashboard bounds for responsive column detection
    const dashboard = document.querySelector('[data-dashboard-layout]') as HTMLElement;
    if (dashboard) {
      const dashboardRect = dashboard.getBoundingClientRect();
      
      // Calculate responsive column width
      let columnWidth;
      if (dashboardRect.width >= 1024) {
        columnWidth = dashboardRect.width * 0.33;
      } else if (dashboardRect.width >= 768) {
        columnWidth = dashboardRect.width * 0.4;
      } else {
        columnWidth = dashboardRect.width * 0.5;
      }
      
      const columnRight = dashboardRect.left + columnWidth;
      
      // Check if dragged outside the column area
      const isOutsideColumn = e.clientX > columnRight;
      
      if (isOutsideColumn && onMakeWidgetFloat) {
        // Pop out the widget - use absolute position relative to dashboard
        const relativeX = e.clientX - dashboardRect.left;
        const relativeY = e.clientY - dashboardRect.top;
        onMakeWidgetFloat(draggedWidget, { x: relativeX, y: relativeY });
      } else if (isReordering && dropTargetIndex !== null) {
        // Reorder within the column using the new function
        if (onReorderColumnWidgets) {
          onReorderColumnWidgets(draggedWidget, dropTargetIndex);
        }
      }
    }
    
    // Reset all drag states
    setDraggedWidget(null);
    setDragStartPosition(null);
    setDragPosition(null);
    setDropTargetIndex(null);
    setIsReordering(false);
    setDraggedWidgetIndex(null);
  };

  // Handle drag end
  const handleDragEnd = (e: React.DragEvent) => {
    // Reset cursor
    (e.currentTarget as HTMLElement).style.cursor = '';
    
    // Reset all drag states
    setDraggedWidget(null);
    setDragStartPosition(null);
    setDragPosition(null);
    setDropTargetIndex(null);
    setIsReordering(false);
    setDraggedWidgetIndex(null);
  };

  // Check if widget should pop out based on current drag position
  const shouldPopOut = (widgetId: string) => {
    if (!dragPosition || draggedWidget !== widgetId) return false;
    
    const dashboard = document.querySelector('[data-dashboard-layout]') as HTMLElement;
    if (!dashboard) return false;
    
    const dashboardRect = dashboard.getBoundingClientRect();
    
    // Calculate responsive column width
    let columnWidth;
    if (dashboardRect.width >= 1024) {
      columnWidth = dashboardRect.width * 0.33;
    } else if (dashboardRect.width >= 768) {
      columnWidth = dashboardRect.width * 0.4;
    } else {
      columnWidth = dashboardRect.width * 0.5;
    }
    
    const columnRight = dashboardRect.left + columnWidth;
    
    return dragPosition.x > columnRight;
  };

  // Calculate reordered widget positions for visual feedback
  const getReorderedWidgets = () => {
    if (!isReordering || dropTargetIndex === null || draggedWidgetIndex === null) {
      return columnWidgets;
    }

    const reordered = [...columnWidgets];
    const [draggedItem] = reordered.splice(draggedWidgetIndex, 1);
    
    // Adjust target index if dragging from before the target
    const adjustedTargetIndex = draggedWidgetIndex < dropTargetIndex ? dropTargetIndex - 1 : dropTargetIndex;
    reordered.splice(adjustedTargetIndex, 0, draggedItem);
    
    return reordered;
  };

  // Get widget component
  const getWidgetComponent = (widget: WidgetInstance) => {
    const WidgetComponent = WIDGET_COMPONENTS[widget.widgetId as keyof typeof WIDGET_COMPONENTS];
    if (!WidgetComponent) return null;
    
    return (
      <WidgetComponent
        widget={widget}
        conversation={conversation}
        actions={actions}
        state={state}
        onRemoveWidget={onRemoveWidget}
        onMakeWidgetFloat={onMakeWidgetFloat}
        className="w-full h-full"
      />
    );
  };

  // Calculate widget dimensions based on size and screen
  const getWidgetDimensions = (size: string) => {
    const [width, height] = size.split('x').map(Number);
    const baseHeight = height * gridDimensions.cellSize + (height - 1) * gridDimensions.gap;
    
    // Add responsive adjustments
    let responsiveHeight = baseHeight;
    if (screenWidth < 768) {
      // Mobile: reduce height slightly
      responsiveHeight = baseHeight * 0.9;
    } else if (screenWidth >= 1200) {
      // Large screens: increase height slightly
      responsiveHeight = baseHeight * 1.1;
    }
    
    return {
      width: '100%',
      height: responsiveHeight,
      gridWidth: width,
      gridHeight: height,
      minHeight: Math.max(80, responsiveHeight * 0.8) // Ensure minimum height
    };
  };

  // Filter widgets that are not floating and sort by position
  const columnWidgets = widgets
    .filter(w => !w.isFloating)
    .sort((a, b) => a.position.y - b.position.y);

  // Calculate drop zone position
  const calculateDropZonePosition = (index: number) => {
    let accumulatedHeight = 0;
    const gap = 12; // gap between widgets
    
    for (let i = 0; i < index; i++) {
      const widget = columnWidgets[i];
      const dimensions = getWidgetDimensions(widget.config.size);
      accumulatedHeight += dimensions.height + gap;
    }
    
    // For the target position, we want to show the drop zone at the top of where the widget would be placed
    return accumulatedHeight;
  };

  // Calculate drop zone height based on dragged widget size
  const calculateDropZoneHeight = () => {
    if (!draggedWidget) return 80; // Default height
    
    const widget = widgets.find(w => w.id === draggedWidget);
    if (!widget) return 80;
    
    const dimensions = getWidgetDimensions(widget.config.size);
    return dimensions.height;
  };

  // Calculate the actual widget positions for better drop zone visualization
  const calculateWidgetPositions = () => {
    const positions: { widget: WidgetInstance; top: number; height: number; index: number }[] = [];
    let accumulatedHeight = 0;
    const gap = 12;
    
    columnWidgets.forEach((widget, index) => {
      const dimensions = getWidgetDimensions(widget.config.size);
      positions.push({
        widget,
        top: accumulatedHeight,
        height: dimensions.height,
        index
      });
      accumulatedHeight += dimensions.height + gap;
    });
    
    return positions;
  };

  // Improved drop target calculation that considers widget boundaries
  const calculateDropTarget = (mouseY: number) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return columnWidgets.length;
    
    const widgetPositions = calculateWidgetPositions();
    const relativeY = mouseY - containerRect.top;
    
    // Find the best drop target based on widget boundaries
    for (let i = 0; i < widgetPositions.length; i++) {
      const position = widgetPositions[i];
      const widgetCenter = position.top + position.height / 2;
      
      if (relativeY < widgetCenter) {
        return i;
      }
    }
    
    // If we're past all widgets, drop at the end
    return widgetPositions.length;
  };

  // Calculate dragged widget height
  const getDraggedWidgetHeight = () => {
    if (draggedWidget) {
      const widget = widgets.find(w => w.id === draggedWidget);
      if (widget) {
        const dimensions = getWidgetDimensions(widget.config.size);
        return dimensions.height;
      }
    }
    return 80; // Default height if no widget is being dragged
  };

  return (
    <div className={cn("w-full h-full bg-card border-2 border-border/60 rounded-xl shadow-lg p-4 flex flex-col", className)}>
      {/* Grid Container */}
      <div
        ref={containerRef}
        className="flex-1 relative bg-muted/20 rounded-lg border border-border/40 p-2 min-h-0"
        style={{
          width: '100%',
          height: '100%',
          minHeight: gridDimensions.minHeight,
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Column Boundary Indicator - Only visible when dragging */}
        {draggedWidget && (
          <div 
            className={cn(
              "fixed top-0 w-1 bg-primary/20 pointer-events-none transition-opacity duration-300 z-40",
              "lg:left-[33.333%] md:left-[40%] left-[50%]",
              "opacity-60"
            )}
            style={{ height: '100vh' }}
          />
        )}

        {/* Widget Boundary Indicators - Show actual widget positions during drag */}
        {isReordering && draggedWidget && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {calculateWidgetPositions().map((position, index) => {
              const isDropTarget = index === dropTargetIndex;
              const isOriginalPosition = index === draggedWidgetIndex;
              const isShifted = draggedWidgetIndex !== null && dropTargetIndex !== null && 
                               ((draggedWidgetIndex < dropTargetIndex && index > draggedWidgetIndex && index <= dropTargetIndex) ||
                                (draggedWidgetIndex > dropTargetIndex && index >= dropTargetIndex && index < draggedWidgetIndex));
              
              return (
                <div
                  key={`boundary-${position.widget.id}`}
                  className={cn(
                    "absolute left-0 right-0 border-2 rounded-lg transition-all duration-200",
                    isDropTarget && "border-primary/60 bg-primary/5",
                    isOriginalPosition && "border-muted-foreground/40 bg-muted/20",
                    isShifted && !isDropTarget && !isOriginalPosition && "border-blue-500/30 bg-blue-500/5",
                    !isDropTarget && !isOriginalPosition && !isShifted && "border-border/20"
                  )}
                  style={{
                    top: `${position.top}px`,
                    height: `${position.height}px`,
                    opacity: isDropTarget ? 0.8 : isOriginalPosition ? 0.6 : isShifted ? 0.4 : 0.2
                  }}
                >
                  {isDropTarget && (
                    <div className="absolute inset-0 bg-primary/10 rounded-lg animate-pulse" />
                  )}
                  {isOriginalPosition && (
                    <div className="absolute inset-0 bg-muted/20 rounded-lg" />
                  )}
                  {isShifted && !isDropTarget && !isOriginalPosition && (
                    <div className="absolute inset-0 bg-blue-500/10 rounded-lg" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Drop Zone Indicators */}
        {isReordering && dropTargetIndex !== null && draggedWidgetIndex !== null && (
          <div
            className="absolute left-0 right-0 h-2 bg-primary/60 rounded-full z-20 transition-all duration-200 shadow-lg animate-pulse"
            style={{
              top: `${calculateDropZonePosition(dropTargetIndex)}px`,
              transform: 'translateY(-50%)',
              boxShadow: '0 0 8px rgba(var(--primary), 0.4)'
            }}
          />
        )}

        {/* Dragged Widget Destination Indicator */}
        {isReordering && dropTargetIndex !== null && draggedWidgetIndex !== null && (
          <div
            className="absolute left-0 right-0 bg-primary/10 border-2 border-dashed border-primary/40 rounded-lg z-15 transition-all duration-200"
            style={{
              top: `${calculateDropZonePosition(dropTargetIndex)}px`,
              height: `${calculateDropZoneHeight()}px`,
              transform: 'translateY(-2px)'
            }}
          >
            <div className="flex items-center justify-center h-full">
              <div className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium">
                Drop here
              </div>
            </div>
          </div>
        )}

        {/* Original Position Placeholder */}
        {isReordering && draggedWidgetIndex !== null && dropTargetIndex !== null && draggedWidgetIndex !== dropTargetIndex && (
          <div
            className="absolute left-0 right-0 bg-muted/30 border border-dashed border-muted-foreground/30 rounded-lg z-5 transition-all duration-200"
            style={{
              top: `${calculateDropZonePosition(draggedWidgetIndex)}px`,
              height: `${calculateDropZoneHeight()}px`,
              transform: 'translateY(-2px)'
            }}
          >
            <div className="flex items-center justify-center h-full">
              <div className="bg-muted/50 text-muted-foreground px-2 py-1 rounded text-xs">
                Original position
              </div>
            </div>
          </div>
        )}

        {/* Widgets */}
        <div className="flex flex-col gap-3 w-full">
          {getReorderedWidgets().map((widget, index) => {
            const dimensions = getWidgetDimensions(widget.config.size);
            const isDragging = draggedWidget === widget.id;
            const willPopOut = shouldPopOut(widget.id);
            const isDropTarget = isReordering && dropTargetIndex === index;
            const isShifted = isReordering && !isDragging && draggedWidgetIndex !== null && dropTargetIndex !== null;
            
            // Calculate if this widget will be shifted due to reordering
            let shiftDirection = 0;
            let shiftAmount = 0;
            if (isShifted && draggedWidgetIndex !== null && dropTargetIndex !== null) {
              if (draggedWidgetIndex < dropTargetIndex) {
                // Dragging down: widgets between dragged and target move up
                if (index > draggedWidgetIndex && index <= dropTargetIndex) {
                  shiftDirection = -1;
                  // Calculate how much to shift based on dragged widget height
                  const draggedWidgetInstance = widgets.find(w => w.id === draggedWidget);
                  if (draggedWidgetInstance) {
                    const draggedDimensions = getWidgetDimensions(draggedWidgetInstance.config.size);
                    shiftAmount = draggedDimensions.height + 12; // Include gap
                  }
                }
              } else {
                // Dragging up: widgets between target and dragged move down
                if (index >= dropTargetIndex && index < draggedWidgetIndex) {
                  shiftDirection = 1;
                  // Calculate how much to shift based on dragged widget height
                  const draggedWidgetInstance = widgets.find(w => w.id === draggedWidget);
                  if (draggedWidgetInstance) {
                    const draggedDimensions = getWidgetDimensions(draggedWidgetInstance.config.size);
                    shiftAmount = draggedDimensions.height + 12; // Include gap
                  }
                }
              }
            }
            
            return (
              <div
                key={widget.id}
                className={cn(
                  "bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden",
                  "transition-all duration-300 ease-out cursor-grab active:cursor-grabbing",
                  isDragging && "opacity-50 scale-95 shadow-lg rotate-1",
                  !isDragging && "hover:shadow-md hover:border-border hover:scale-[1.02]",
                  willPopOut && "border-secondary shadow-lg",
                  isDropTarget && "border-primary/40 bg-primary/5 ring-2 ring-primary/20",
                  isReordering && !isDragging && !isDropTarget && "opacity-60",
                  isShifted && shiftDirection !== 0 && "transform transition-transform duration-300 ease-out"
                )}
                style={{
                  height: dimensions.height,
                  minHeight: dimensions.minHeight,
                  zIndex: isDragging ? 10 : isDropTarget ? 5 : 1,
                  transform: isDragging 
                    ? 'scale(0.95) rotate(1deg)' 
                    : isDropTarget 
                    ? 'scale(1.02)' 
                    : isShifted && shiftDirection !== 0
                    ? `translateY(${shiftDirection * shiftAmount}px)`
                    : 'scale(1)',
                  transition: isShifted && shiftDirection !== 0 ? 'transform 0.3s ease-out' : undefined
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, widget)}
                onDragEnd={handleDragEnd}
              >
                {/* Widget Content */}
                <div className="p-2 bg-background/80 h-full">
                  {getWidgetComponent(widget)}
                </div>
                
                {/* Reordering indicator */}
                {isDropTarget && (
                  <div className="absolute inset-0 border-2 border-primary/60 rounded-lg pointer-events-none animate-pulse" />
                )}
                
                {/* Drop target glow */}
                {isDropTarget && (
                  <div className="absolute inset-0 bg-primary/5 rounded-lg pointer-events-none animate-pulse" 
                       style={{ boxShadow: '0 0 20px rgba(var(--primary), 0.3)' }} />
                )}
                
                {/* Shift indicator */}
                {isShifted && shiftDirection !== 0 && (
                  <div className={cn(
                    "absolute top-0 left-0 w-full h-1 rounded-t-lg pointer-events-none transition-opacity duration-200",
                    shiftDirection > 0 ? "bg-blue-500/60" : "bg-green-500/60"
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Widget Button */}
      <div className="mt-4 flex justify-center flex-shrink-0">
        <button
          onClick={onAddWidget}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Widget</span>
        </button>
      </div>

      {/* Pop Out Indicator */}
      {draggedWidget && shouldPopOut(draggedWidget) && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-secondary/10 border-2 border-dashed border-secondary/40 rounded-lg m-4 flex items-center justify-center">
            <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4" />
                <span className="text-sm font-medium">Release to float widget</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drag Mode Indicator */}
      {draggedWidget && (
        <div className="fixed top-4 right-4 pointer-events-none z-50">
          <div className={cn(
            "px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-all duration-200",
            isReordering 
              ? "bg-primary text-primary-foreground" 
              : shouldPopOut(draggedWidget)
              ? "bg-secondary text-secondary-foreground"
              : "bg-muted text-muted-foreground"
          )}>
            <div className="flex items-center gap-2">
              {isReordering ? (
                <>
                  <Move className="w-4 h-4" />
                  <span>
                    {draggedWidgetIndex !== null && dropTargetIndex !== null && draggedWidgetIndex !== dropTargetIndex
                      ? `Move from position ${draggedWidgetIndex + 1} to ${dropTargetIndex + 1}`
                      : "Release to reorder"
                    }
                  </span>
                </>
              ) : shouldPopOut(draggedWidget) ? (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span>Release to float widget</span>
                </>
              ) : (
                <>
                  <Move className="w-4 h-4" />
                  <span>Drag to reorder or float</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reordering Summary Indicator */}
      {isReordering && draggedWidgetIndex !== null && dropTargetIndex !== null && draggedWidgetIndex !== dropTargetIndex && (
        <div className="fixed bottom-4 left-4 pointer-events-none z-50">
          <div className="bg-primary/90 text-primary-foreground px-3 py-2 rounded-lg shadow-lg text-sm font-medium">
            <div className="flex items-center gap-2">
              <Move className="w-4 h-4" />
              <span>
                {draggedWidgetIndex < dropTargetIndex 
                  ? `Moving widget down: ${dropTargetIndex - draggedWidgetIndex} positions`
                  : `Moving widget up: ${draggedWidgetIndex - dropTargetIndex} positions`
                }
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Size Difference Indicator */}
      {isReordering && dropTargetIndex !== null && draggedWidgetIndex !== null && draggedWidgetIndex !== dropTargetIndex && (
        <div className="fixed top-20 right-4 pointer-events-none z-50">
          <div className="bg-primary/90 text-primary-foreground px-3 py-2 rounded-lg shadow-lg text-sm font-medium">
            <div className="flex items-center gap-2">
              <Move className="w-4 h-4" />
              <span>
                {(() => {
                  const draggedWidgetInstance = widgets.find(w => w.id === draggedWidget);
                  const targetWidget = columnWidgets[dropTargetIndex];
                  
                  if (draggedWidgetInstance && targetWidget) {
                    const draggedSize = draggedWidgetInstance.config.size;
                    const targetSize = targetWidget.config.size;
                    
                    if (draggedSize !== targetSize) {
                      return `Moving ${draggedSize} widget to ${targetSize} position`;
                    }
                  }
                  
                  return `Moving widget to position ${dropTargetIndex + 1}`;
                })()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Layout Preview Indicator */}
      {isReordering && dropTargetIndex !== null && draggedWidgetIndex !== null && draggedWidgetIndex !== dropTargetIndex && (
        <div className="fixed bottom-20 right-4 pointer-events-none z-50">
          <div className="bg-secondary/90 text-secondary-foreground px-3 py-2 rounded-lg shadow-lg text-sm font-medium max-w-xs">
            <div className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4" />
              <div>
                <div className="font-medium">Layout Preview:</div>
                <div className="text-xs opacity-90">
                  {(() => {
                    const draggedWidgetInstance = widgets.find(w => w.id === draggedWidget);
                    if (!draggedWidgetInstance) return "Widget will be reordered";
                    
                    const reorderedWidgets = getReorderedWidgets();
                    const preview = reorderedWidgets.map((w, i) => w.config.size).join(' → ');
                    return preview;
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 