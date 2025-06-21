/**
 * File: app/dashboard/conversations/[id]/page.tsx
 * Purpose: Renders a detailed conversation view with message history, client information, and AI-powered insights.
 * Author: Alejo Cagliolo
 * Date: 5/25/25
 * Version: 4.3.0 - Simplified to use conversation object directly
 */

"use client"
import { ArrowLeft, HelpCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Logo } from "@/app/utils/Logo"

// Import components
import {
  LoadingSkeleton,
  ColumnToggleButton,
  ResizableSidebar,
  EnhancedContactCard,
  EnhancedAIInsights,
  EnhancedReplyComposer,
  MessageList,
  FlaggedStatusWidget,
  SpamStatusWidget,
  CompletionModal,
  ReportModal,
  GenerateModal,
  EmailPreviewModal,
  FlaggedNotificationModal
} from "./components"
import type { Conversation } from '@/types/conversation';

// Import hooks and utilities
import { useConversationDetail } from "./hooks/useConversationDetail"
import { useConversationActions } from "./hooks/useConversationActions"
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts"

export default function ConversationDetailPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const conversationDetail = useConversationDetail();
  const {
    isLoading, conversation,
    messageInput, generatedResponse, isResponseFlagged, generatingResponse,
    sendingEmail, userSignature, userResponseEmail, notes, copySuccess,
    generatingPdf, feedback, evFeedback, updatingFeedbackId,
    updatingEvFeedbackId, updatingOverride, unflagging, clearingFlag,
    completingConversation, updatingSpam, reportingResponse, reportMessageId,
    showGenerateModal, showEmailPreviewModal, showFlaggedNotification,
    showCompletionModal, showReportModal, columnState,
    setMessageInput, setGeneratedResponse, setIsResponseFlagged,
    setGeneratingResponse, setSendingEmail, setNotes, setCopySuccess,
    setGeneratingPdf, setFeedback, setEvFeedback,
    setUpdatingFeedbackId, setUpdatingEvFeedbackId,
    setUpdatingOverride, setUnflagging, setClearingFlag,
    setCompletingConversation, setUpdatingSpam, setReportingResponse,
    setReportMessageId, setShowGenerateModal, setShowEmailPreviewModal,
    setShowFlaggedNotification, setShowCompletionModal, setShowReportModal,
    toggleLeftColumn, toggleRightColumn,
  } = conversationDetail;

  // Custom hooks
  const conversationActions = useConversationActions();

  // Action handlers
  const handleReportSubmit = (reason: string, details: string) => {
    conversationActions.handleReportSubmit(reason, details, reportMessageId);
    setShowReportModal(false);
  };

  const handleCloseGenerateModal = () => {
    conversationActions.handleCloseGenerateModal(setShowGenerateModal, setGeneratedResponse, setIsResponseFlagged);
  };

  const handleUseGeneratedResponse = () => {
    conversationActions.handleUseGeneratedResponse(generatedResponse, setMessageInput, setShowGenerateModal);
  };

  const handleGenerateAIResponse = () => {
    conversationActions.generateAIResponse(setGeneratingResponse);
  };

  const handleSendEmail = () => {
    conversationActions.sendEmail(setSendingEmail, setShowEmailPreviewModal);
  };

  const handleFocusOverrideButton = () => {
    conversationActions.handleFocusOverrideButton(setShowFlaggedNotification);
  };

  const handleCompleteConversation = (reason: string, nextSteps: string) => {
    conversationActions.handleCompleteConversation(reason, nextSteps, setCompletingConversation, setShowCompletionModal);
  };

  const handleUnflag = () => {
    conversationActions.handleUnflag(setUnflagging);
  };

  const saveNotes = (newNotes: string) => {
    conversationActions.saveNotes(newNotes, setNotes);
  };

  const handleCopyConversation = () => {
    const messages = conversation?.messages || [];
    const clientEmail = conversation?.thread?.client_email || '';
    conversationActions.handleCopyConversation(messages, clientEmail, setCopySuccess);
  };

  const handleGeneratePDF = () => {
    conversationActions.generatePDF(setGeneratingPdf);
  };

  const handleOpenEmailPreview = () => {
    conversationActions.handleOpenEmailPreview(setShowEmailPreviewModal);
  };

  const handleEvFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    conversationActions.handleEvFeedback(messageId, feedback, setEvFeedback, setUpdatingEvFeedbackId);
  };

  const handleResponseFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
    conversationActions.handleResponseFeedback(messageId, feedback, setFeedback, setUpdatingFeedbackId);
  };

  const handleOverride = () => {
    conversationActions.handleOverride(setUpdatingOverride);
  };

  const handleMarkAsNotSpam = () => {
    conversationActions.handleMarkAsNotSpam(setUpdatingSpam);
  };

  const handleClearFlag = () => {
    conversationActions.handleClearFlag(setClearingFlag);
  };

  const handleOpenCompletionModal = () => {
    conversationActions.handleOpenCompletionModal(setShowCompletionModal);
  };

  const handleReport = (messageId: string) => {
    setReportMessageId(messageId);
    setShowReportModal(true);
  };

  // Contact card actions
  const handleCall = () => {
    const phone = conversation?.thread?.phone;
    if (phone) {
      window.open(`tel:${phone}`, '_blank');
    }
  };

  const handleEmail = () => {
    const clientEmail = conversation?.thread?.client_email;
    if (clientEmail) {
      window.open(`mailto:${clientEmail}`, '_blank');
    }
  };

  const handleAddNote = () => {
    // Focus on notes widget or open a quick note modal
    const notesTextarea = document.querySelector('textarea[placeholder*="notes"]') as HTMLTextAreaElement;
    if (notesTextarea) {
      notesTextarea.focus();
    }
  };

  // Keyboard shortcuts handlers
  const handleFocusSearch = () => {
    searchInputRef.current?.focus();
  };

  const handleJumpToUnread = () => {
    const messages = conversation?.messages || [];
    const unreadMessages = messages.filter((msg) => !msg.read);
    if (unreadMessages.length > 0) {
      const lastUnread = unreadMessages[unreadMessages.length - 1];
      const element = document.getElementById(`message-${lastUnread.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const { showKeyboardShortcuts } = useKeyboardShortcuts({
    onToggleLeftPanel: toggleLeftColumn,
    onToggleRightPanel: toggleRightColumn,
    onSendMessage: handleOpenEmailPreview,
    onGenerateResponse: handleGenerateAIResponse,
    onSearch: handleFocusSearch,
    onJumpToUnread: handleJumpToUnread
  });

  // Extract data for modals
  const leadName = conversation?.thread?.lead_name || 'Unknown Lead';
  const clientEmail = conversation?.thread?.client_email || '';
  const emailSubject = conversation?.thread?.subject || '';
  const isBusy = conversation?.thread?.busy || false;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col h-full max-h-full bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1]">
      {/* Modals */}
      <ReportModal 
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
        isSubmitting={reportingResponse}
      />
      <GenerateModal
        isOpen={showGenerateModal}
        onClose={handleCloseGenerateModal}
        generatedResponse={generatedResponse}
        onUseResponse={handleUseGeneratedResponse}
        onRegenerate={handleGenerateAIResponse}
        isRegenerating={generatingResponse}
        isFlagged={isResponseFlagged}
      />
      <EmailPreviewModal
        isOpen={showEmailPreviewModal}
        onClose={() => setShowEmailPreviewModal(false)}
        onSend={handleSendEmail}
        subject={emailSubject}
        body={messageInput}
        signature={userSignature}
        recipientEmail={clientEmail}
        recipientName={leadName}
        isSending={sendingEmail}
        session={session}
        responseEmail={userResponseEmail}
      />
      <FlaggedNotificationModal
        isOpen={showFlaggedNotification}
        onClose={() => setShowFlaggedNotification(false)}
        onFocusOverrideButton={handleFocusOverrideButton}
      />
      <CompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        onComplete={handleCompleteConversation}
        isSubmitting={completingConversation}
        leadName={leadName}
        clientEmail={clientEmail}
      />

      {/* Fixed Header */}
      <header className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="w-full max-w-[1600px] mx-auto p-4">
          <div className="flex items-center gap-4">
            <Logo size="md" variant="icon-only" />
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-[#0e6537]/10 rounded-lg transition-colors"
              title="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-[#0e6537]" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-[#0e6537]">Conversation Detail</h1>
              <p className="text-sm text-gray-600">with {leadName}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={showKeyboardShortcuts}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Keyboard shortcuts (Ctrl + ?)"
              >
                <HelpCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 flex gap-4 min-h-0 overflow-hidden">
        {/* Left Sidebar or Toggle */}
        {columnState.left ? (
          <ResizableSidebar
            position="left"
            isExpanded={columnState.left}
            onToggle={toggleLeftColumn}
            className="w-[320px] min-w-[280px] max-w-[400px]"
          >
            <div className="flex flex-col gap-4 h-full max-h-full overflow-y-auto">
              <EnhancedContactCard
                conversation={conversation}
                onCall={handleCall}
                onEmail={handleEmail}
                onAddNote={handleAddNote}
              />
              <EnhancedAIInsights
                conversation={conversation}
              />
              <FlaggedStatusWidget
                conversation={conversation}
                onUnflag={handleUnflag}
                updating={unflagging}
                onComplete={handleOpenCompletionModal}
                onClearFlag={handleClearFlag}
                clearingFlag={clearingFlag}
              />
            </div>
          </ResizableSidebar>
        ) : (
          <div className="flex flex-col justify-center">
            <ColumnToggleButton
              isExpanded={columnState.left}
              onToggle={toggleLeftColumn}
              position="left"
              label="Show/hide context panel"
            />
          </div>
        )}

        {/* Center Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0">
            <MessageList
              conversation={conversation}
              feedback={feedback}
              evFeedback={evFeedback}
              updatingFeedbackId={updatingFeedbackId}
              updatingEvFeedbackId={updatingEvFeedbackId}
              onResponseFeedback={handleResponseFeedback}
              onEvFeedback={handleEvFeedback}
              onReport={handleReport}
              searchInputRef={searchInputRef}
            />
          </div>
        </div>

        {/* Right Sidebar or Toggle */}
        {columnState.right ? (
          <ResizableSidebar
            position="right"
            isExpanded={columnState.right}
            onToggle={toggleRightColumn}
            className="w-[320px] min-w-[280px] max-w-[400px]"
          >
            <div className="flex flex-col h-full max-h-full p-4 overflow-y-auto" data-panel="right">
              <EnhancedReplyComposer
                conversation={conversation}
                messageInput={messageInput}
                onMessageChange={setMessageInput}
                onGenerateResponse={handleGenerateAIResponse}
                onSendEmail={handleOpenEmailPreview}
                generatingResponse={generatingResponse}
                isBusy={isBusy}
                onOverrideToggle={handleOverride}
                updatingOverride={updatingOverride}
                onOpenGenerateModal={() => setShowGenerateModal(true)}
              />
              <div className="mt-4">
                <SpamStatusWidget
                  conversation={conversation}
                  onMarkAsNotSpam={handleMarkAsNotSpam}
                  updating={updatingSpam}
                />
              </div>
            </div>
          </ResizableSidebar>
        ) : (
          <div className="flex flex-col justify-center">
            <ColumnToggleButton
              isExpanded={columnState.right}
              onToggle={toggleRightColumn}
              position="right"
              label="Show/hide reply panel"
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Change Log:
 * 5/25/25 - Initial version
 * - Created conversation detail page with message history
 * - Implemented client information panel
 * - Added AI-powered conversation summary
 * - Integrated quick action buttons
 * - Added responsive design for all screen sizes
 * 
 * 5/25/25 - Version 3.0.0 - Modular Architecture
 * - Broke down monolithic component into smaller, focused components
 * - Created custom hooks for state management and actions
 * - Separated utility functions and styles
 * - Improved maintainability and code organization
 * - Added proper TypeScript types and interfaces
 * 
 * 5/25/25 - Version 4.0.0 - Enhanced Layout
 * - Implemented resizable sidebars with drag-to-resize functionality
 * - Enhanced contact card with avatar and action buttons
 * - Improved AI insights with collapsible sections
 * - Added rich text editor with formatting toolbar
 * - Implemented message list with date separators and search
 * - Added floating "new messages" button
 * - Enhanced responsive design and accessibility
 * - Improved visual hierarchy and user experience
 * - Added keyboard shortcuts and help system
 * 
 * 5/25/25 - Version 4.1.0 - Fixed Layout Conflicts
 * - Removed min-h-screen to prevent conflicts with dashboard layout
 * - Changed to h-full to work within dashboard container
 * - Added overflow-hidden to main content area
 * - Fixed header to use flex-shrink-0 instead of sticky
 * - Ensured proper height distribution within dashboard layout
 * - Eliminated black components and layout shifting issues
 * 
 * 5/25/25 - Version 4.2.0 - Canonical Conversation Type
 * - Updated components to accept entire conversation object
 * - Removed individual property passing in favor of conversation object
 * - Improved type safety and consistency across components
 * - Enhanced maintainability by centralizing conversation data access
 * 
 * 5/25/25 - Version 4.3.0 - Simplified Conversation Usage
 * - Removed redundant data extraction from useConversationDetail hook
 * - Components now extract data directly from conversation object
 * - Simplified prop passing and reduced code duplication
 * - Improved maintainability by centralizing data access in components
 */
