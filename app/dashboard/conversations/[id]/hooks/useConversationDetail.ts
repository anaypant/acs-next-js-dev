import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useConversationById } from "@/lib/utils/api"
import type { Conversation } from "@/types/conversation"

// Temporary state type, will be removed.
interface ColumnState {
  left: boolean;
  right: boolean;
}

/**
 * Custom hook for managing conversation detail state and operations
 */
export function useConversationDetail() {
  const params = useParams();
  const { data: session } = useSession();
  const conversationId = params?.id as string;

  // Centralized data fetching
  const { 
    conversation, 
    loading: isLoading, 
    error: conversationError
  } = useConversationById(conversationId);

  // UI State
  const [messageInput, setMessageInput] = useState('');
  const [generatedResponse, setGeneratedResponse] = useState('');
  const [isResponseFlagged, setIsResponseFlagged] = useState(false);
  const [generatingResponse, setGeneratingResponse] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [userSignature, setUserSignature] = useState('');
  const [userResponseEmail, setUserResponseEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, 'like' | 'dislike'>>({});
  const [evFeedback, setEvFeedback] = useState<Record<string, 'positive' | 'negative'>>({});
  const [updatingFeedbackId, setUpdatingFeedbackId] = useState<string | null>(null);
  const [updatingEvFeedbackId, setUpdatingEvFeedbackId] = useState<string | null>(null);
  const [updatingOverride, setUpdatingOverride] = useState(false);
  const [unflagging, setUnflagging] = useState(false);
  const [clearingFlag, setClearingFlag] = useState(false);
  const [completingConversation, setCompletingConversation] = useState(false);
  const [updatingSpam, setUpdatingSpam] = useState(false);
  const [reportingResponse, setReportingResponse] = useState(false);
  const [reportMessageId, setReportMessageId] = useState<string>('');
  
  // Modal states
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showEmailPreviewModal, setShowEmailPreviewModal] = useState(false);
  const [showFlaggedNotification, setShowFlaggedNotification] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Column visibility state
  const [columnState, setColumnState] = useState<ColumnState>({
    left: true,
    right: true
  });

  // Column toggle handlers
  const toggleLeftColumn = () => setColumnState((prev: ColumnState) => ({ ...prev, left: !prev.left }));
  const toggleRightColumn = () => setColumnState((prev: ColumnState) => ({ ...prev, right: !prev.right }));

  // Load user signature
  useEffect(() => {
    const loadUserSignature = async () => {
      // In a real app, this would fetch from a user settings table
      setUserSignature('Best regards,\n[Your Name]\nReal Estate Agent');
      setUserResponseEmail(session?.user?.email || 'agent@example.com');
    };
    if (session?.user) loadUserSignature();
  }, [session]);

  if (conversationError) {
    console.error("Error loading conversation:", conversationError);
  }

  return {
    // Core data
    isLoading,
    conversation,
    
    // UI State
    messageInput, setMessageInput,
    generatedResponse, setGeneratedResponse,
    isResponseFlagged, setIsResponseFlagged,
    generatingResponse, setGeneratingResponse,
    sendingEmail, setSendingEmail,
    userSignature, setUserSignature,
    userResponseEmail, setUserResponseEmail,
    notes, setNotes,
    copySuccess, setCopySuccess,
    generatingPdf, setGeneratingPdf,
    feedback, setFeedback,
    evFeedback, setEvFeedback,
    updatingFeedbackId, setUpdatingFeedbackId,
    updatingEvFeedbackId, setUpdatingEvFeedbackId,
    updatingOverride, setUpdatingOverride,
    unflagging, setUnflagging,
    clearingFlag, setClearingFlag,
    completingConversation, setCompletingConversation,
    updatingSpam, setUpdatingSpam,
    reportingResponse, setReportingResponse,
    reportMessageId, setReportMessageId,
    
    // Modal states
    showGenerateModal, setShowGenerateModal,
    showEmailPreviewModal, setShowEmailPreviewModal,
    showFlaggedNotification, setShowFlaggedNotification,
    showCompletionModal, setShowCompletionModal,
    showReportModal, setShowReportModal,

    // Column state
    columnState,
    toggleLeftColumn,
    toggleRightColumn,
  };
} 