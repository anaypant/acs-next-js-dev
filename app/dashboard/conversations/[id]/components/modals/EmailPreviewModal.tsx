import { X } from "lucide-react"

/**
 * Email Preview Modal Component
 */
export const EmailPreviewModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSend: () => void;
  subject: string;
  body: string;
  signature: string;
  recipientEmail: string;
  recipientName: string;
  isSending: boolean;
  session: any;
  responseEmail: string;
}> = ({ isOpen, onClose, onSend, subject, body, signature, recipientEmail, recipientName, isSending, session, responseEmail }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Email Preview</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">To:</h4>
              <p className="text-gray-700">{recipientName} &lt;{recipientEmail}&gt;</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">From:</h4>
              <p className="text-gray-700">{session?.user?.name} &lt;{responseEmail}&gt;</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Subject:</h4>
              <p className="text-gray-700">{subject}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Message:</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="whitespace-pre-wrap text-gray-700 mb-4">{body}</div>
                {signature && (
                  <div className="border-t pt-4">
                    <div className="whitespace-pre-wrap text-gray-600 text-sm">{signature}</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSend}
                disabled={isSending}
                className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 