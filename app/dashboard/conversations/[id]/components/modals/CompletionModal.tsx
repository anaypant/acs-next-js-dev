import { useState, type ReactNode } from "react"

/**
 * Completion Modal Component
 */
export const CompletionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onComplete: (reason: string, nextSteps: string) => void;
  isSubmitting: boolean;
  leadName: string;
  clientEmail: string;
}> = ({ isOpen, onClose, onComplete, isSubmitting, leadName, clientEmail }) => {
  const [reason, setReason] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [customReason, setCustomReason] = useState('');

  const reasons = [
    'Lead converted to client',
    'Lead not interested',
    'Lead went with competitor',
    'Lead needs more time',
    'Lead unresponsive',
    'Other'
  ];

  const handleSubmit = () => {
    const finalReason = reason === 'Other' ? customReason : reason;
    if (finalReason.trim()) {
      onComplete(finalReason, nextSteps);
    }
  };

  const handleReasonSelect = (selectedReason: string) => {
    setReason(selectedReason);
    if (selectedReason !== 'Other') {
      setCustomReason('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Complete Conversation</h3>
          <p className="text-gray-600 mb-4">
            Mark this conversation as complete for {leadName} ({clientEmail})
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for completion
              </label>
              <select
                value={reason}
                onChange={(e) => handleReasonSelect(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e6537] focus:border-transparent"
              >
                <option value="">Select a reason</option>
                {reasons.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            
            {reason === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom reason
                </label>
                <input
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e6537] focus:border-transparent"
                  placeholder="Enter custom reason"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Next steps (optional)
              </label>
              <textarea
                value={nextSteps}
                onChange={(e) => setNextSteps(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e6537] focus:border-transparent"
                rows={3}
                placeholder="Any follow-up actions or notes"
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !reason.trim() || (reason === 'Other' && !customReason.trim())}
              className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Completing...' : 'Complete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 