import { Flag, CheckCircle, X } from "lucide-react"
import type { Conversation } from '@/types/conversation';

/**
 * Flagged Status Widget Component
 * Displays and manages conversation flags
 */
export function FlaggedStatusWidget({ 
  conversation,
  onUnflag, 
  updating, 
  onComplete, 
  onClearFlag, 
  clearingFlag 
}: { 
  conversation: Conversation | null;
  onUnflag: () => void; 
  updating: boolean;
  onComplete?: () => void;
  onClearFlag?: () => void;
  clearingFlag?: boolean;
}) {
  const isFlagged = conversation?.thread?.flag_for_review || false;
  const isFlaggedForCompletion = conversation?.thread?.flag || false;
  
  if (!isFlagged && !isFlaggedForCompletion) return null;
  
  return (
    <div className="bg-white rounded-2xl border shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center">
          <Flag className="h-5 w-5 text-yellow-500" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            {isFlaggedForCompletion ? 'Ready for Completion' : 'Flagged for Review'}
          </h3>
          <p className="text-sm text-gray-500">
            {isFlaggedForCompletion 
              ? 'This conversation is ready to be marked as complete'
              : 'This conversation needs human attention'
            }
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        {isFlagged && (
          <button
            onClick={onUnflag}
            disabled={updating}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
            <span>Clear Flag</span>
          </button>
        )}
        
        {isFlaggedForCompletion && onComplete && (
          <button
            onClick={onComplete}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#0e6537] text-white rounded-lg hover:bg-[#0a5a2f] transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Complete Conversation</span>
          </button>
        )}
        
        {isFlaggedForCompletion && onClearFlag && (
          <button
            onClick={onClearFlag}
            disabled={clearingFlag}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {clearingFlag ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <X className="w-4 h-4" />
            )}
            <span>Clear Completion Flag</span>
          </button>
        )}
      </div>
    </div>
  );
} 