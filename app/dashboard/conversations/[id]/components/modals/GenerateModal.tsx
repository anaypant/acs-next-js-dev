import { X, Check, RefreshCw, AlertTriangle } from "lucide-react"

/**
 * Generate Modal Component
 */
export const GenerateModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  generatedResponse: string;
  onUseResponse: () => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
  isFlagged?: boolean;
}> = ({ isOpen, onClose, generatedResponse, onUseResponse, onRegenerate, isRegenerating, isFlagged }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">AI Response Suggestions</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {isFlagged && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  This response has been flagged for review. Please review carefully before using.
                </span>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Generated Response:</h4>
              <div className="whitespace-pre-wrap text-gray-700">
                {generatedResponse || 'No response generated yet.'}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onUseResponse}
                disabled={!generatedResponse.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-[#0e6537] text-white rounded-lg hover:bg-[#0a5a2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                <span>Use This Response</span>
              </button>
              <button
                onClick={onRegenerate}
                disabled={isRegenerating}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRegenerating ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                <span>Regenerate</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 