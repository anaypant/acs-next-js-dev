/**
 * File: app/dashboard/conversations/[id]/page.tsx
 * Purpose: Renders a detailed conversation view with message history, client information, and AI-powered insights.
 * Author: Alejo Cagliolo
 * Date: 5/25/25
 * Version: 1.0.0
 */

"use client"
import { ArrowLeft, Phone, Mail, Calendar, MapPin, RefreshCw, Sparkles, X, Info, Copy, Check, Download, ThumbsUp, ThumbsDown, AlertTriangle, Save, Edit2, Shield, ShieldOff, Flag, CheckCircle, MessageSquare } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, type ReactNode, type FC } from "react"
import type { Thread, Message } from "@/app/types/lcp"
import { useSession } from "next-auth/react"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';
import type { User } from "next-auth"
import { v4 as uuidv4 } from 'uuid';
import { ensureMessageFields, parseBoolean } from "@/app/dashboard/lib/dashboard-utils";
import ConversationProgression from "@/app/dashboard/components/ConversationProgression";
import { useConversationsData } from '../../lib/use-conversations';
import { formatLocalTime } from '@/app/utils/timezone';
import { Logo } from "@/app/utils/Logo"

// Import Session type from the local definition
import type { Session } from "next-auth"

// Add type declaration for jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

// Update ExtendedMessage interface to match Message type
interface ExtendedMessage extends Omit<Message, 'ev_score'> {
  sender_name: string;
  sender_email: string;
  body: string;
  timestamp: string;
  ev_score?: number; // Changed from string to number to match Message type
  type: "inbound-email" | "outbound-email";
}

/**
 * Logo Component
 * Displays the ACS logo with customizable size and gradient text
 * 
 * @param {Object} props - Component props
 * @param {"sm" | "lg"} props.size - Size variant of the logo
 * @returns {JSX.Element} ACS logo with gradient background and text
 */

// Utility to get a color for the EV score (red-yellow-green gradient)
function getEvColor(score: number) {
  if (score <= 39) return '#ef4444'; // red-500
  if (score <= 69) return '#facc15'; // yellow-400
  return '#22c55e'; // green-500
}

/**
 * LoadingSkeleton Component
 * Displays an animated loading state for the conversation detail page
 */
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1]">
      <div className="max-w-[1600px] mx-auto p-6">
        {/* Header skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <Logo />
          <div className="h-8 w-8 bg-white/50 rounded-lg animate-pulse" />
          <div className="h-8 w-64 bg-white/50 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ gridTemplateColumns: '1fr 1fr 320px' }}>
          {/* Messages section skeleton */}
          <div className="bg-white rounded-lg border shadow-sm flex flex-col relative h-[50rem]">
            <div className="p-4 border-b">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
              {[...Array(5)].map((_, index) => (
                <div key={`skeleton-message-${index}`} className="flex justify-start">
                  <div className="flex items-center gap-2">
                    <div className="h-16 w-64 bg-gray-100 rounded-lg animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* AI Response section skeleton */}
          <div className="space-y-6">
            {/* AI Response skeleton */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="h-32 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            {/* Client info and flags skeleton - in one row */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-4" />
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
          {/* Right sidebar skeleton */}
          <div className="space-y-6">
            {/* AI Summary skeleton */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            {/* Notes skeleton */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Utility to robustly convert string/boolean to boolean
function getBoolean(val: any) {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") return val.toLowerCase() === "true";
  return false;
}

// Update OverrideStatus component to add data attribute
function OverrideStatus({ isEnabled, onToggle, updating, pulsating }: { isEnabled: boolean; onToggle: () => void; updating: boolean; pulsating?: boolean }) {
  return (
    <button
      onClick={onToggle}
      disabled={updating}
      data-override-status
      className={`group relative inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        pulsating ? 'animate-pulse ring-2 ring-yellow-400 ring-opacity-75' : ''
      }`}
    >
      {updating ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : isEnabled ? (
        <ShieldOff className="w-4 h-4 text-yellow-500" />
      ) : (
        <Shield className="w-4 h-4 text-green-500" />
      )}
      <span className="text-sm font-medium">
        {isEnabled ? "Review Check Disabled" : "Review Check Enabled"}
      </span>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-64">
        {isEnabled ? (
          "AI review checks are disabled for this conversation. The AI will not flag this conversation for review, even if it detects potential issues."
        ) : (
          "AI review checks are enabled. The AI will flag this conversation for review if it detects any uncertainty or issues that need human attention."
        )}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
      </div>
    </button>
  );
}

// Add FlaggedStatus component
function FlaggedStatus({ isFlagged, onUnflag, updating }: { isFlagged: boolean; onUnflag: () => void; updating: boolean }) {
  if (!isFlagged) return null;
  
  return (
    <div className="flex items-center gap-2">
      <div className="group relative inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-lg">
        <Flag className="w-4 h-4 text-yellow-500" />
        <span className="text-sm font-medium text-yellow-700">Flagged for Review</span>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-64">
          This conversation has been flagged for human review. The AI system detected potential issues or uncertainty that needs human attention.
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
        </div>
      </div>
      <button
        onClick={onUnflag}
        disabled={updating}
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {updating ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm">Unflag</span>
          </>
        )}
      </button>
    </div>
  );
}

// Add CompletionModal component
const CompletionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onComplete: (reason: string, nextSteps: string) => void;
  isSubmitting: boolean;
  leadName: string;
  clientEmail: string;
}> = ({ isOpen, onClose, onComplete, isSubmitting, leadName, clientEmail }) => {
  const [completionReason, setCompletionReason] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  const completionReasons = [
    { value: 'deal_closed', label: 'Deal Successfully Closed', description: 'The lead converted and the deal was completed' },
    { value: 'lead_unresponsive', label: 'Lead Became Unresponsive', description: 'The lead stopped responding to follow-ups' },
    { value: 'not_qualified', label: 'Lead Not Qualified', description: 'The lead does not meet qualification criteria' },
    { value: 'wrong_contact', label: 'Wrong Contact Information', description: 'The contact information is incorrect or outdated' },
    { value: 'competitor_won', label: 'Competitor Won the Deal', description: 'The lead chose a competitor instead' },
    { value: 'timeline_mismatch', label: 'Timeline Mismatch', description: 'The lead\'s timeline doesn\'t align with our services' },
    { value: 'budget_mismatch', label: 'Budget Mismatch', description: 'The lead\'s budget is outside our range' },
    { value: 'other', label: 'Other', description: 'Other reason for completion' }
  ];

  const continueSuggestions = [
    'Schedule a follow-up call to discuss specific requirements',
    'Send additional property listings that match their criteria',
    'Provide a detailed proposal with pricing information',
    'Arrange a property viewing or virtual tour',
    'Share testimonials from similar clients',
    'Offer a consultation to address their concerns',
    'Send market analysis for their target area',
    'Propose a meeting to discuss next steps'
  ];

  const handleSubmit = () => {
    const finalReason = selectedReason === 'other' ? completionReason : selectedReason;
    onComplete(finalReason, nextSteps);
  };

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
    if (reason !== 'other') {
      setCompletionReason('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl">
        <div className="p-6 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Complete Conversation</h3>
              <p className="text-sm text-gray-600">Mark this conversation as completed</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Completion Details */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-3">Conversation Summary</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Lead:</span>
                    <span>{leadName}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Email:</span>
                    <span>{clientEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">Ready for Completion</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-3">Completion Reason</h4>
                <div className="space-y-2">
                  {completionReasons.map((reason) => (
                    <label key={reason.value} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="completionReason"
                        value={reason.value}
                        checked={selectedReason === reason.value}
                        onChange={() => handleReasonSelect(reason.value)}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium">{reason.label}</div>
                        <div className="text-sm text-gray-600">{reason.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
                
                {selectedReason === 'other' && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specify Other Reason
                    </label>
                    <textarea
                      value={completionReason}
                      onChange={(e) => setCompletionReason(e.target.value)}
                      className="w-full h-20 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e6537] resize-none"
                      placeholder="Please specify the reason for completion..."
                    />
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-lg font-medium mb-3">Next Steps (Optional)</h4>
                <textarea
                  value={nextSteps}
                  onChange={(e) => setNextSteps(e.target.value)}
                  className="w-full h-24 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e6537] resize-none"
                  placeholder="Document any next steps, follow-up actions, or important notes..."
                />
              </div>
            </div>

            {/* Right Column - Suggestions */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium mb-3">Suggestions to Continue</h4>
                <p className="text-sm text-gray-600 mb-4">
                  If you're not ready to complete this conversation, here are some suggestions to keep it active:
                </p>
                <div className="space-y-2">
                  {continueSuggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-blue-800">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium text-yellow-800 mb-1">Important Note</h5>
                    <p className="text-sm text-yellow-700">
                      Completing a conversation will archive it and remove it from your active leads. 
                      Make sure you have all necessary information documented before proceeding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedReason || (selectedReason === 'other' && !completionReason.trim()) || isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Completing...</span>
              </div>
            ) : (
              'Complete Conversation'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Update FlaggedStatusWidget component to handle completion status
function FlaggedStatusWidget({ isFlagged, onUnflag, updating, isFlaggedForCompletion, onComplete, onClearFlag, clearingFlag }: { 
  isFlagged: boolean; 
  onUnflag: () => void; 
  updating: boolean;
  isFlaggedForCompletion?: boolean;
  onComplete?: () => void;
  onClearFlag?: () => void;
  clearingFlag?: boolean;
}) {
  // If flagged for completion, show completion status
  if (isFlaggedForCompletion) {
    return (
      <div className="bg-white rounded-2xl border shadow-lg p-6 flex flex-col items-center text-center min-h-[170px] relative overflow-hidden">
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-green-500/20 to-green-600/20 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-transparent to-green-600/10"></div>
        
        <div className="relative z-10">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-2 border-2 border-green-300">
            <CheckCircle className="h-7 w-7 text-green-600" />
          </div>
          <div className="mb-1 font-bold text-lg text-green-700">Flagged for Completion</div>
          <div className="text-gray-600 text-sm mb-4">
            This conversation is ready to be marked as completed
          </div>
          <div className="flex flex-col gap-2 w-full">
            {onComplete && (
              <button
                onClick={onComplete}
                disabled={updating}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {updating ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Complete Conversation</span>
                  </>
                )}
              </button>
            )}
            {onClearFlag && (
              <button
                onClick={onClearFlag}
                disabled={clearingFlag}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {clearingFlag ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span>Clear Flag</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Regular flagged status (for review)
  return (
    <div className="bg-white rounded-2xl border shadow-lg p-6 flex flex-col items-center text-center min-h-[170px]">
      <div className="w-14 h-14 bg-yellow-50 rounded-full flex items-center justify-center mb-2">
        {isFlagged ? (
          <Flag className="h-7 w-7 text-yellow-500" />
        ) : (
          <CheckCircle className="h-7 w-7 text-green-500" />
        )}
      </div>
      <div className="mb-1 font-bold text-lg">
        {isFlagged ? "Flagged for Review" : "No Flags"}
      </div>
      <div className="text-gray-500 text-sm mb-4">
        {isFlagged 
          ? "This conversation has been flagged for human review"
          : "No review flags are active for this conversation"
        }
      </div>
      {isFlagged && (
        <button
          onClick={onUnflag}
          disabled={updating}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updating ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Unflag Conversation</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}

// Update NotesWidget to be a proper React component
const NotesWidget: FC<{
  notes: string;
  onSave: (notes: string) => void;
}> = ({ notes, onSave }) => {
  const [localNotes, setLocalNotes] = useState(notes);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="bg-white rounded-2xl border shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Context Notes</h3>
        <button
          onClick={() => {
            if (isEditing) {
              onSave(localNotes);
            }
            setIsEditing(!isEditing);
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
          <span>{isEditing ? "Save" : "Edit"}</span>
        </button>
      </div>
      {isEditing ? (
        <textarea
          value={localNotes}
          onChange={(e) => setLocalNotes(e.target.value)}
          className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e6537] resize-none"
          placeholder="Add notes about this conversation..."
        />
      ) : (
        <div className="text-gray-700 whitespace-pre-wrap">{notes || "No notes added yet."}</div>
      )}
    </div>
  );
};

// Update ReportModal usage in the return statement
const ReportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
  isSubmitting: boolean;
}> = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Report Conversation</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {[
              { key: 'reason', label: 'Reason', type: 'text', value: reason, onChange: setReason, placeholder: 'Brief reason for reporting' },
              { key: 'details', label: 'Details', type: 'textarea', value: details, onChange: setDetails, placeholder: 'Additional details about the report' }
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full h-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e6537] resize-none"
                    placeholder={field.placeholder}
                  />
                ) : (
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e6537]"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(reason, details)}
              disabled={!reason.trim() || isSubmitting}
              className="px-4 py-2 bg-[#0e6537] text-white rounded-lg hover:bg-[#0a5a2f] disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// GenerateModal component to show the generated response
const GenerateModal: React.FC<{
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
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#0e6537]" />
            <h3 className="text-lg font-semibold">AI Generated Response</h3>
            {isFlagged && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 text-xs">
                <AlertTriangle className="h-3 w-3" />
                <span>Flagged for Review</span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="space-y-4">
            {/* Info banner */}
            <div className="bg-[#0e6537]/5 border border-[#0e6537]/20 rounded-lg p-3 flex items-start gap-2">
              <Info className="h-5 w-5 text-[#0e6537] mt-0.5 flex-shrink-0" />
              <div className="text-sm text-[#0e6537]">
                <p className="font-medium mb-1">Review Your Response</p>
                <ul className="list-disc list-inside space-y-1 text-[#0e6537]/80">
                  <li>Review the AI-generated response before using it</li>
                  <li>You can edit the response after applying it to the input field</li>
                  <li>Click "Use Response" to apply it, or "Regenerate" for a new version</li>
                </ul>
              </div>
            </div>

            {/* Generated response */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Generated Response:</label>
              <div className="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="whitespace-pre-line text-base text-gray-900">{generatedResponse}</div>
              </div>
            </div>

            {/* Warning if flagged */}
            {isFlagged && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Response Flagged for Review</p>
                  <p>This response has been flagged by our AI for potential issues. Please review carefully before sending.</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isRegenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Regenerating...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Regenerate</span>
              </>
            )}
          </button>
          <button
            onClick={onUseResponse}
            className="px-4 py-2 bg-[#0e6537] text-white rounded-lg hover:bg-[#0a5a2f] transition-colors"
          >
            Use Response
          </button>
        </div>
      </div>
    </div>
  );
};

// Add EmailPreviewModal component before the ConversationDetailPage component
const EmailPreviewModal: React.FC<{
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

  const fullEmailBody = body + (signature ? `\n\n${signature}` : '');
  const signatureLength = signature ? signature.length : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#0e6537]" />
            <h3 className="text-lg font-semibold">Email Preview</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="space-y-6">
            {/* Email Header */}
            <div className="border-b pb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">From:</span>
                  <div className="text-gray-900">{responseEmail}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">To:</span>
                  <div className="text-gray-900">{recipientName} &lt;{recipientEmail}&gt;</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Subject:</span>
                  <div className="text-gray-900">{subject}</div>
                </div>
              </div>
            </div>

            {/* Email Body */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Body:</label>
                <div className="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-y-auto">
                  <div className="whitespace-pre-line text-base text-gray-900">{fullEmailBody}</div>
                </div>
              </div>
            </div>

            {/* Email Structure Breakdown */}
            <div className="bg-[#0e6537]/5 border border-[#0e6537]/20 rounded-lg p-4">
              <h4 className="font-medium text-[#0e6537] mb-3">Email Structure:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Your Message:</span>
                  <span className="text-gray-900">{body.length} characters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Signature:</span>
                  <span className="text-gray-900">{signatureLength} characters</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-gray-700">Total:</span>
                  <span className="text-gray-900">{fullEmailBody.length} characters</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onSend}
            disabled={isSending || !body.trim()}
            className="px-4 py-2 bg-[#0e6537] text-white rounded-lg hover:bg-[#0a5a2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline mr-2" />
                Sending...
              </>
            ) : (
              'Send Email'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Add FlaggedNotificationModal component
const FlaggedNotificationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onFocusOverrideButton: () => void;
}> = ({ isOpen, onClose, onFocusOverrideButton }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Flag className="h-8 w-8 text-yellow-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Conversation Flagged for Review</h3>
          <p className="text-gray-600 mb-6">
            Our AI system has flagged this conversation for human review. This typically happens when the AI detects potential issues or uncertainty that requires human attention.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">What this means:</p>
                <p className="mb-3">The AI could not generate a quality response. Look for:</p>
                <ul className="list-disc list-inside space-y-1 text-left mb-3">
                  <li>Any tangibles that the user has expressed</li>
                  <li>Information that is unclear or ambiguous</li>
                </ul>
                <p className="mb-2">You can:</p>
                <ul className="list-disc list-inside space-y-1 text-left mb-3">
                  <li>Add any context you feel necessary in the notes section</li>
                  <li>If this is a mistake, disable review checking</li>
                </ul>
                <button
                  onClick={onFocusOverrideButton}
                  className="w-full px-3 py-2 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
                >
                  Disable Review Checking
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-[#0e6537] text-white rounded-lg hover:bg-[#0a5a2f] transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * ConversationDetailPage Component
 * Main conversation detail component displaying message history and client information
 * 
 * Features:
 * - Real-time message display
 * - Client information panel
 * - AI-powered conversation summary
 * - Quick action buttons
 * 
 * @returns {JSX.Element} Complete conversation detail view
 */
export default function ConversationDetailPage() {
  // All hooks must be at the top, before any conditional returns
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;
  const { data: session, status } = useSession()

  // Session check - redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0e6537] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated
  if (status === 'unauthenticated') {
    return null
  }

  const [mounted, setMounted] = useState(false);
  const [userSignature, setUserSignature] = useState<string>('');
  const [userResponseEmail, setUserResponseEmail] = useState<string>('');
  const [updatingRead, setUpdatingRead] = useState<string | null>(null);
  const [updatingLcp, setUpdatingLcp] = useState<string | null>(null);
  const [updatingFlag, setUpdatingFlag] = useState<string | null>(null);
  const [updatingSpam, setUpdatingSpam] = useState<boolean>(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [previewMessageId, setPreviewMessageId] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportingResponse, setReportingResponse] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [evFeedbackLoading, setEvFeedbackLoading] = useState(false);
  const [updatingEvFeedbackId, setUpdatingEvFeedbackId] = useState<string | null>(null);
  const [evFeedback, setEvFeedback] = useState<{ [key: string]: 'positive' | 'negative' | null }>({});
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [updatingFeedbackId, setUpdatingFeedbackId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ [key: string]: 'like' | 'dislike' | null }>({});
  const [reportMessageId, setReportMessageId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [generatingResponse, setGeneratingResponse] = useState(false);
  const [updatingOverride, setUpdatingOverride] = useState(false);
  const [unflagging, setUnflagging] = useState(false);
  const [clearingFlag, setClearingFlag] = useState(false);
  const [notes, setNotes] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatedResponse, setGeneratedResponse] = useState('');
  const [isResponseFlagged, setIsResponseFlagged] = useState(false);
  const [showEmailPreviewModal, setShowEmailPreviewModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');

  // Completion modal state
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completingConversation, setCompletingConversation] = useState(false);

  // Flagged notification modal state
  const [showFlaggedNotification, setShowFlaggedNotification] = useState(false);
  const [overrideButtonPulsing, setOverrideButtonPulsing] = useState(false);

  const {
    conversations,
    getConversationById,
    updateThreadMetadata,
    updateMessage,
    addMessage,
    refreshConversations,
    isLoading,
    error: cacheError
  } = useConversationsData();

  // All useEffects must be at the top level
  useEffect(() => {
    setMounted(true);
  }, []);

  // Define fetchUserSignature before the useEffect that calls it
  const fetchUserSignature = async () => {
    try {
      const response = await fetch('/api/db/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'Users',
          index_name: 'id-index',
          key_name: 'id',
          key_value: (session as any)?.user?.id,
          account_id: (session as any)?.user?.id,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data.items[0];
        setUserSignature(userData?.email_signature || '');
        setUserResponseEmail(userData?.responseEmail || (session as any)?.user?.email || '');
        
      }
    } catch (error) {
      console.error('Error fetching signature:', error);
    }
  };

  const markAsRead = async () => {
    if (!conversationId || !(session as any)?.user?.id) return;

    setUpdatingRead(conversationId);
    try {
      const response = await fetch('/api/db/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'Threads',
          index_name: 'conversation_id-index',
          key_name: 'conversation_id',
          key_value: conversationId,
          account_id: (session as any)?.user?.id,
          update_data: {
            read: true,
          },
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to mark as read');
      }

      // Update cache
      updateThreadMetadata(conversationId, { read: true });
    } catch (error) {
      console.error('Error marking as read:', error);
    } finally {
      setUpdatingRead(null);
    }
  };

  useEffect(() => {
    if (mounted && (session as any)?.user?.id) {
      fetchUserSignature();
    }
  }, [mounted, (session as any)?.user?.id]);

  useEffect(() => {
    if (mounted && conversationId) {
      const conversation = getConversationById(conversationId);
      if (conversation?.thread && !conversation.thread.read) {
        markAsRead();
      }
    }
  }, [mounted, conversationId, getConversationById]);

  // Get conversation data after hooks
  const conversation = getConversationById(conversationId);
  const thread = conversation?.thread;
  const messages = conversation?.messages || [];

  // Process thread data using dashboard utilities
  const processedThread = thread ? {
    ...thread,
    flag_for_review: parseBoolean(thread.flag_for_review),
    flag_review_override: parseBoolean(thread.flag_review_override),
    read: parseBoolean(thread.read),
    busy: parseBoolean(thread.busy),
    spam: parseBoolean(thread.spam),
    lcp_enabled: parseBoolean(thread.lcp_enabled),
    flag: parseBoolean(thread.flag),
    completed: parseBoolean(thread.completed),
    lcp_flag_threshold: typeof thread.lcp_flag_threshold === 'number' ? thread.lcp_flag_threshold : Number(thread.lcp_flag_threshold) || 70,
  } as typeof thread & {
    flag_for_review: boolean;
    flag_review_override: boolean;
    read: boolean;
    busy: boolean;
    spam: boolean;
    lcp_enabled: boolean;
    flag: boolean;
    completed: boolean;
    lcp_flag_threshold: number;
  } : null;

  // Debug: Log processed thread data
  console.log('Processed Thread:', processedThread);

  // Process messages using dashboard utilities
  const processedMessages = messages.map(ensureMessageFields);

  // Initialize notes from processed thread
  useEffect(() => {
    if (processedThread?.notes) {
      setNotes(processedThread.notes);
    }
  }, [processedThread?.notes]);

  // Early returns after all hooks
  if (!mounted) return <LoadingSkeleton />;
  if (isLoading) return <LoadingSkeleton />;
  if (cacheError) return <div className="text-red-500">Error: {cacheError}</div>;
  if (!processedThread) return <div>Conversation not found</div>;

  // Parse thread and messages from conversation
  const leadName = processedThread?.source_name || 'Unknown Lead';
  const clientEmail = processedThread?.source || '';
  // Utility to normalize timestamp to ISO-8601 (UTC) if missing 'Z' or timezone
  function normalizeTimestamp(ts: string) {
    if (!ts) return '';
    // If already ends with Z or has a timezone offset, return as is
    if (ts.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(ts)) return ts;
    // If it has microseconds but no Z, add Z
    return ts + 'Z';
  }
  const sortedMessages = [...(processedMessages.map((msg: any) => ({
    ...msg,
    sender_name: msg.sender_name || msg.sender || '',
    sender_email: msg.sender_email || msg.sender || '',
    body: msg.body || msg.content || '',
    timestamp: normalizeTimestamp(msg.timestamp),
    ev_score: typeof msg.ev_score === 'number' ? msg.ev_score : (msg.ev_score ? Number(msg.ev_score) : undefined),
    type: msg.type || 'inbound-email',
  })) as ExtendedMessage[])].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  


  const handleReportSubmit = async () => {
    if (!conversationId || !(session as any)?.user?.id || !reportReason) return;

    setReportingResponse(true);
    try {
      // Generate unique report ID
      const reportId = uuidv4();
      
      const response = await fetch('/api/db/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'LLMReportData',
          index_name: 'report_id-index',
          key_name: 'report_id',
          key_value: reportId,
          update_data: {
            conversation_id: conversationId,
            associated_account: (session as any).user.id,
            reason: reportReason,
            details: reportDetails,
            timestamp: new Date().toISOString()
          },
          account_id: (session as any).user.id,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit report');
      }
      // Update cache
      updateThreadMetadata(conversationId, { 
        reported: true,
        report_reason: reportReason,
        report_details: reportDetails,
        report_timestamp: new Date().toISOString()
      });
      
      setShowReportModal(false);
      setReportReason('');
      setReportDetails('');
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setReportingResponse(false);
    }
  };

  const handleClosePreview = () => {
    setShowEmailPreview(false);
    setPreviewMessageId(null);
  };


  const handleCopyConversation = async () => {
    try {
      const text = sortedMessages.map(msg => 
        `${msg.sender_name} (${msg.sender_email}):\n${msg.body}\n\n`
      ).join('---\n\n');
      
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Error copying conversation:', error);
    }
  };

  const generatePDF = async () => {
    if (!processedThread || !sortedMessages.length) return;

    setGeneratingPdf(true);
    try {
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(20);
      doc.text('Conversation Report', 20, 20);
      
      // Add thread details
      doc.setFontSize(12);
      doc.text(`Lead: ${leadName}`, 20, 40);
      doc.text(`Status: ${processedThread.completed ? 'Completed' : 'Active'}`, 20, 50);
      doc.text(`Created: ${formatLocalTime(processedThread.created_at).toLocaleString()}`, 20, 60);
      
      // Add messages
      let y = 80;
      sortedMessages.forEach((msg: ExtendedMessage) => {
        const sender = `${msg.sender_name} (${msg.sender_email})`;
        const timestamp = formatLocalTime(msg.timestamp, undefined, msg.type).toLocaleString();
        const content = `${sender} - ${timestamp}\n\n${msg.body}\n\n`;
        
        const splitContent = doc.splitTextToSize(content, 170);
        if (y + splitContent.length * 7 > 280) {
          doc.addPage();
          y = 20;
        }
        
        doc.text(splitContent, 20, y);
        y += splitContent.length * 7 + 10;
      });
      
      doc.save(`conversation-${processedThread.conversation_id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleEvFeedback = async (messageId: string, feedback: 'positive' | 'negative') => {
    setUpdatingEvFeedbackId(messageId);
    try {
      // Implement EV feedback API call
      setEvFeedback(prev => ({ ...prev, [messageId]: feedback }));
    } catch (error) {
      console.error('Error submitting EV feedback:', error);
    } finally {
      setUpdatingEvFeedbackId(null);
    }
  };

  const handleResponseFeedback = async (messageId: string, feedback: 'like' | 'dislike') => {
    setUpdatingFeedbackId(messageId);
    try {
      // Implement response feedback API call
      setFeedback(prev => ({ ...prev, [messageId]: feedback }));
    } catch (error) {
      console.error('Error submitting response feedback:', error);
    } finally {
      setUpdatingFeedbackId(null);
    }
  };

  const handleOverride = async () => {
    if (!conversationId || !(session as any)?.user?.id) return;
    
    setUpdatingOverride(true);
    try {
      // Toggle the current override status
      const currentOverride = processedThread?.flag_review_override || false;
      const newOverrideStatus = !currentOverride;
      
      const response = await fetch('/api/db/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'Threads',
          index_name: 'conversation_id-index',
          key_name: 'conversation_id',
          key_value: conversationId,
          update_data: {
            flag_review_override: newOverrideStatus.toString()
          },
          account_id: (session as any).user.id,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to toggle override status');
      }

      // Update the local cache to reflect the change
      updateThreadMetadata(conversationId, { flag_review_override: newOverrideStatus });
    } catch (error) {
      console.error('Error toggling override:', error);
    } finally {
      setUpdatingOverride(false);
    }
  };

  const handleUnflag = async () => {
    if (!conversationId || !(session as any)?.user?.id) return;
    
    setUnflagging(true);
    try {
      const response = await fetch('/api/db/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'Threads',
          index_name: 'conversation_id-index',
          key_name: 'conversation_id',
          key_value: conversationId,
          update_data: {
            flag_for_review: 'false'
          },
          account_id: (session as any).user.id,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to unflag conversation');
      }

      // Update the local cache to reflect the change
      updateThreadMetadata(conversationId, { flag_for_review: false });
    } catch (error) {
      console.error('Error unflagging conversation:', error);
    } finally {
      setUnflagging(false);
    }
  };

  const handleCompleteConversation = async (reason: string, nextSteps: string) => {
    if (!conversationId || !(session as any)?.user?.id) return;
    
    setCompletingConversation(true);
    try {
      const response = await fetch('/api/db/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'Threads',
          index_name: 'conversation_id-index',
          key_name: 'conversation_id',
          key_value: conversationId,
          update_data: {
            flag: 'false',
            completed: 'true',
            completion_reason: reason,
            completion_notes: nextSteps,
            completed_at: new Date().toISOString()
          },
          account_id: (session as any).user.id,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete conversation');
      }

      // Update the local cache to reflect the change
      updateThreadMetadata(conversationId, { 
        flag: false,
        completed: true,
        completion_reason: reason,
        completion_notes: nextSteps,
        completed_at: new Date().toISOString()
      });

      // Close the modal
      setShowCompletionModal(false);
      
      // Redirect to dashboard after successful completion
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Error completing conversation:', error);
    } finally {
      setCompletingConversation(false);
    }
  };

  const handleOpenCompletionModal = () => {
    setShowCompletionModal(true);
  };

  const handleFocusOverrideButton = () => {
    setShowFlaggedNotification(false);
    setOverrideButtonPulsing(true);
    // Stop the pulsating effect after 3 seconds
    setTimeout(() => setOverrideButtonPulsing(false), 3000);
  };

  const handleMarkAsNotSpam = async () => {
    if (!conversationId || !(session as any)?.user?.id) return;
    
    setUpdatingSpam(true);
    try {
      const response = await fetch('/api/db/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'Threads',
          index_name: 'conversation_id-index',
          key_name: 'conversation_id',
          key_value: conversationId,
          update_data: {
            spam: 'false'
          },
          account_id: (session as any).user.id,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to mark as not spam');
      }

      // Update the local cache to reflect the change
      updateThreadMetadata(conversationId, { spam: false });
    } catch (error) {
      console.error('Error marking as not spam:', error);
    } finally {
      setUpdatingSpam(false);
    }
  };

  const handleClearFlag = async () => {
    if (!conversationId || !(session as any)?.user?.id) return;
    
    setClearingFlag(true);
    try {
      const response = await fetch('/api/db/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'Threads',
          index_name: 'conversation_id-index',
          key_name: 'conversation_id',
          key_value: conversationId,
          update_data: {
            flag: false
          },
          account_id: (session as any).user.id,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to clear flag');
      }

      // Update the local cache to reflect the change
      updateThreadMetadata(conversationId, { flag: false });
    } catch (error) {
      console.error('Error clearing flag:', error);
    } finally {
      setClearingFlag(false);
    }
  };

  const generateAIResponse = async () => {
    if (!conversationId || !(session as any)?.user?.id) return;
    
    setGeneratingResponse(true);
    try {
      // Determine if this is the first email (no outbound messages yet)
      const outboundMessages = sortedMessages.filter(msg => msg.type === "outbound-email");
      const isFirstEmail = outboundMessages.length === 0;

      const response = await fetch('/api/lcp/get_llm_response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          account_id: (session as any).user.id,
          is_first_email: isFirstEmail
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate AI response');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        // Check if the response is flagged for review
        if (data.data.status === 'flagged') {
          // Update the local cache to reflect the flagged status
          updateThreadMetadata(conversationId, { flag_for_review: true });
          // Refresh conversations to update the UI
          refreshConversations();
          // Show the flagged notification modal
          setShowFlaggedNotification(true);
        }
        
        // Store the generated response and show the modal
        if (data.data.response) {
          setGeneratedResponse(data.data.response);
          setIsResponseFlagged(data.flagged || false);
          setShowGenerateModal(true);
        }
      } else {
        throw new Error('Invalid response from AI service');
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      // You might want to show an error notification here
    } finally {
      setGeneratingResponse(false);
    }
  };

  const handleOpenEmailPreview = () => {
    // Generate a subject based on the conversation context if not already set
    if (!emailSubject.trim()) {
      const lastMessage = sortedMessages[sortedMessages.length - 1];
      let subject = '';
      if (lastMessage) {
        subject = lastMessage.subject;
      }
      
      if (lastMessage && lastMessage.is_first_email === true) {
        // Try to extract subject from the last message or create a generic one
        subject = "Re: " + subject;
      } 

      if (lastMessage.type === 'outbound-email' ) {
        subject = "Follow up";
      }
      if (subject.length === 0) {
        subject = '<No subject>';
      }
      
      setEmailSubject(subject);
    }
    
    setShowEmailPreviewModal(true);
  };

  const sendEmail = async () => {
    if (!conversationId || !(session as any)?.user?.id || !messageInput.trim()) return;
    
    setSendingEmail(true);
    try {
      const response = await fetch('/api/lcp/send_email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          account_id: (session as any).user.id,
          subject: emailSubject,
          response_body: messageInput,
          signature: userSignature,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        // Update the busy attribute to false in the database when we get a non-200 response
        try {
          const updateResponse = await fetch('/api/db/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              table_name: 'Threads',
              index_name: 'conversation_id-index',
              key_name: 'conversation_id',
              key_value: conversationId,
              update_data: {
                busy: false
              },
              account_id: (session as any).user.id,
            }),
            credentials: 'include',
          });

          if (updateResponse.ok) {
            // Optimistically update the local thread data
            updateThreadMetadata(conversationId, { busy: false });
          }
        } catch (updateError) {
          console.error('Error updating busy status:', updateError);
        }
        
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }

      const data = await response.json();
      
      if (response.ok) {
        // Close the modal and clear the input
        setShowEmailPreviewModal(false);
        setMessageInput('');
        setEmailSubject('');
        
        // Refresh the conversation to show the new message
        refreshConversations();
        // Also update busy to false if the response indicates failure
        
      }
    } catch (error) {
      // Update busy to false on any error
      try {
        const updateResponse = await fetch('/api/db/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            table_name: 'Threads',
            index_name: 'conversation_id-index',
            key_name: 'conversation_id',
            key_value: conversationId,
            update_data: {
              busy: false
            },
            account_id: (session as any).user.id,
          }),
          credentials: 'include',
        });

        if (updateResponse.ok) {
          // Optimistically update the local thread data
          updateThreadMetadata(conversationId, { busy: false });
        }
      } catch (updateError) {
        console.error('Error updating busy status:', updateError);
      }
      
      console.error('Error sending email:', error);
      // You might want to show an error notification here
    } finally {
      setSendingEmail(false);
    }
  };

  const saveNotes = async (newNotes: string) => {
    if (!conversationId || !(session as any)?.user?.id) return;
    
    try {
      const response = await fetch('/api/db/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'Threads',
          index_name: 'conversation_id-index',
          key_name: 'conversation_id',
          key_value: conversationId,
          update_data: {
            notes: newNotes
          },
          account_id: (session as any).user.id,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save notes');
      }

      // Update local state
      setNotes(newNotes);
      // Update the local cache to reflect the change
      updateThreadMetadata(conversationId, { notes: newNotes });
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const handleUseGeneratedResponse = () => {
    setMessageInput(generatedResponse);
    setShowGenerateModal(false);
  };

  const handleCloseGenerateModal = () => {
    setShowGenerateModal(false);
    setGeneratedResponse('');
    setIsResponseFlagged(false);
  };


  return (
    <>
      {showEmailPreview && previewMessageId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Email Preview</h3>
              <button
                onClick={handleClosePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
              {/* Email preview content */}
            </div>
          </div>
        </div>
      )}


      <div className="min-h-screen h-screen w-full bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1] pb-0 flex flex-col">
        {/* Page Header */}
        <div className="w-full max-w-[1600px] mx-auto p-4 flex-shrink-0">
          <div className="flex items-center gap-4 mb-4">
            <Logo size="md" variant="icon-only" />
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-[#0e6537]/10 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5 text-[#0e6537]" />
            </button>
            <h1 className="text-2xl font-bold text-[#0e6537]">Conversation Detail</h1>
          </div>
        </div>

        <div className="w-full flex-1 max-w-[1600px] mx-auto p-4 grid gap-6" style={{ gridTemplateColumns: '1.5fr 2fr 1.5fr', minHeight: 0 }}>
          {/* Left: Notes and Context */}
          <div className="flex flex-col gap-6">
            {/* Context Notes Widget */}
            <NotesWidget
              notes={notes}
              onSave={saveNotes}
            />
            
            {/* AI Insights */}
            {processedThread && (() => {
              const aiSummary = processedThread.ai_summary?.trim();
              const budgetRange = processedThread.budget_range?.trim();
              const propertyTypes = processedThread.preferred_property_types?.trim();
              const timeline = processedThread.timeline?.trim();
              const isEmpty = [aiSummary, budgetRange, propertyTypes, timeline].every((val) => !val || val === 'UNKNOWN');
              if (isEmpty) return null;
              const insights = [
                { key: 'summary', label: 'Summary', value: aiSummary },
                { key: 'budget', label: 'Budget', value: budgetRange },
                { key: 'property-types', label: 'Property Types', value: propertyTypes },
                { key: 'timeline', label: 'Timeline', value: timeline }
              ].filter(insight => insight.value && insight.value !== 'UNKNOWN');
              return (
                <div className="bg-white rounded-2xl border shadow-lg p-6 text-left min-h-[170px] flex flex-col justify-center">
                  <h3 className="text-lg font-semibold mb-2">AI Insights</h3>
                  {insights.map(insight => (
                    <div key={insight.key} className="mb-2 text-gray-700">
                      <span className="font-medium">{insight.label}:</span> {insight.value}
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Client Information */}
            <div className="bg-white rounded-2xl border shadow-lg p-6 flex flex-col items-center text-center min-h-[170px]">
              <div className="w-14 h-14 bg-[#0e6537]/10 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl font-semibold text-[#0e6537]">{leadName[0]?.toUpperCase()}</span>
              </div>
              <div className="mb-1 font-bold text-lg">{leadName}</div>
              <div className="text-gray-500 text-sm mb-2">{clientEmail}</div>
              {processedThread?.phone && <div className="text-gray-500 text-sm mb-1 flex items-center justify-center gap-1"><Phone className="h-4 w-4" />{processedThread.phone}</div>}
              {processedThread?.location && <div className="text-gray-500 text-sm mb-1 flex items-center justify-center gap-1"><MapPin className="h-4 w-4" />{processedThread.location}</div>}
            </div>

            {/* Flagged Status Widget */}
            <FlaggedStatusWidget
              isFlagged={processedThread?.flag_for_review || false}
              onUnflag={handleUnflag}
              updating={unflagging}
              isFlaggedForCompletion={processedThread?.flag || false}
              onComplete={handleOpenCompletionModal}
              onClearFlag={handleClearFlag}
              clearingFlag={clearingFlag}
            />
          </div>

          {/* Center: Conversation History */}
          <div className="flex flex-col min-h-0 h-full">
            <div className="bg-white rounded-2xl border shadow-lg p-0 overflow-hidden flex flex-col flex-1 min-h-0">
              <div className="px-8 py-4 border-b bg-[#f7faf9] flex items-center justify-between flex-shrink-0">
                <h2 className="text-xl font-semibold">Conversation History</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyConversation}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm"
                    title="Copy conversation to clipboard"
                  >
                    {copySuccess ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-600">Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={generatePDF}
                    disabled={generatingPdf}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm disabled:opacity-50"
                    title="Download conversation as PDF"
                  >
                    {generatingPdf ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Generating... </span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span className="text-sm">PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="px-8 py-6 space-y-8 overflow-y-auto flex-1 min-h-0">
                {isLoading ? (
                  <div className="space-y-4">
                    {['skeleton-1', 'skeleton-2', 'skeleton-3'].map((id) => (
                      <div key={id} className="h-16 w-full bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : sortedMessages.length === 0 ? (
                  <div>No messages found.</div>
                ) : (
                  sortedMessages.map((msg: ExtendedMessage, index) => (
                    <div
                      key={`message-${msg.id || `index-${index}`}-${index}`}
                      className={`flex ${msg.type === "outbound-email" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-md w-full flex flex-col gap-1 ${msg.type === "outbound-email" ? "items-end" : "items-start"}`}>
                        <div className={`rounded-xl px-6 py-4 shadow-sm ${msg.type === "outbound-email" ? "bg-gradient-to-br from-[#0e6537] to-[#157a42] text-white" : "bg-gray-50 text-gray-900 border"}`}>
                          <div className="whitespace-pre-line text-base">{msg.body}</div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span>{msg.type === "inbound-email" ? clientEmail : "You"}</span>
                          <span>·</span>
                          <span>{msg.timestamp ? formatLocalTime(msg.timestamp, undefined, msg.type).toLocaleString() : ""}</span>
                          {msg.type === "inbound-email" && typeof msg.ev_score === 'number' && msg.ev_score >= 0 && msg.ev_score <= 100 && (
                            <span className="ml-2 flex items-center gap-1">
                              <span className="font-semibold text-green-700">EV {msg.ev_score}</span>
                              {!evFeedbackLoading && (
                                <>
                                  <button
                                    className={`p-0.5 rounded-full ${evFeedback[msg.id] === 'positive' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100 text-gray-400'}`}
                                    onClick={() => handleEvFeedback(msg.id, 'positive')}
                                    disabled={updatingEvFeedbackId === msg.id}
                                    aria-label="Thumbs up EV score"
                                    title="Rate the accuracy of the AI's EV score for this message."
                                  >
                                    {updatingEvFeedbackId === msg.id ? (
                                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <ThumbsUp className="w-4 h-4" fill={evFeedback[msg.id] === 'positive' ? '#22c55e' : 'none'} />
                                    )}
                                  </button>
                                  <button
                                    className={`p-0.5 rounded-full ${evFeedback[msg.id] === 'negative' ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100 text-gray-400'}`}
                                    onClick={() => handleEvFeedback(msg.id, 'negative')}
                                    disabled={updatingEvFeedbackId === msg.id}
                                    aria-label="Thumbs down EV score"
                                    title="Rate the accuracy of the AI's EV score for this message."
                                  >
                                    {updatingEvFeedbackId === msg.id ? (
                                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <ThumbsDown className="w-4 h-4" fill={evFeedback[msg.id] === 'negative' ? '#ef4444' : 'none'} />
                                    )}
                                  </button>
                                </>
                              )}
                            </span>
                          )}
                          {msg.type === "outbound-email" && !feedbackLoading && (
                            <span className="ml-2 flex items-center gap-1">
                              <button
                                className={`p-0.5 rounded-full ${feedback[msg.id] === 'like' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100 text-gray-400'}`}
                                onClick={() => handleResponseFeedback(msg.id, 'like')}
                                disabled={updatingFeedbackId === msg.id}
                                aria-label="Thumbs up response"
                                title="Rate the helpfulness of the AI-generated response."
                              >
                                {updatingFeedbackId === msg.id ? (
                                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <ThumbsUp className="w-4 h-4" fill={feedback[msg.id] === 'like' ? '#22c55e' : 'none'} />
                                )}
                              </button>
                              <button
                                className={`p-0.5 rounded-full ${feedback[msg.id] === 'dislike' ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100 text-gray-400'}`}
                                onClick={() => handleResponseFeedback(msg.id, 'dislike')}
                                disabled={updatingFeedbackId === msg.id}
                                aria-label="Thumbs down response"
                                title="Rate the helpfulness of the AI-generated response."
                              >
                                {updatingFeedbackId === msg.id ? (
                                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <ThumbsDown className="w-4 h-4" fill={feedback[msg.id] === 'dislike' ? '#ef4444' : 'none'} />
                                )}
                              </button>
                              <button
                                className="p-0.5 rounded-full hover:bg-gray-100 text-gray-400"
                                onClick={() => {
                                  setReportMessageId(msg.id);
                                  setShowReportModal(true);
                                }}
                                aria-label="Report response"
                                title="Report this AI response"
                              >
                                <AlertTriangle className="w-4 h-4" />
                              </button>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: AI Response section */}
          <div className="flex flex-col">
            <div className="bg-white rounded-2xl border shadow-lg p-0 overflow-hidden w-full">
              <div className="px-8 py-4 border-b bg-[#f7faf9] flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#0e6537]" />
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  AI Response
                  <span className="relative group ml-2">
                    <button
                      type="button"
                      onClick={() => setShowGenerateModal(true)}
                      className="p-1 rounded-full hover:bg-[#0e6537]/10 focus:outline-none"
                    >
                      <Sparkles className="h-4 w-4 text-[#0e6537]" />
                    </button>
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                      Open AI Suggestions
                    </span>
                  </span>
                </h2>
                <span className="text-xs text-gray-400">(Draft a reply with AI assistance)</span>
              </div>
              <div className="px-8 py-6 flex flex-col gap-4">
                {/* Info banner */}
                <div className="bg-[#0e6537]/5 border border-[#0e6537]/20 rounded-lg p-3 flex items-start gap-2">
                  <Info className="h-5 w-5 text-[#0e6537] mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-[#0e6537]">
                    <p className="font-medium mb-1">Email Details</p>
                    <ul className="list-disc list-inside space-y-1 text-[#0e6537]/80">
                      <li>Subject will be automatically generated based on the conversation</li>
                      <li>Your email signature will be appended to the message</li>
                      <li>You can edit the response before sending</li>
                    </ul>
                  </div>
                </div>
                {/* AI Response section */}
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">AI Response</h3>
                  <div className="flex items-center gap-3">
                    <OverrideStatus 
                      isEnabled={processedThread?.flag_review_override || false} 
                      onToggle={handleOverride}
                      updating={updatingOverride}
                      pulsating={overrideButtonPulsing}
                    />
                  </div>
                </div>
                <div className="px-8 py-6 flex flex-col gap-4">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={processedThread?.busy ? "Email sending in progress..." : "Type or generate your reply..."}
                    className="w-full h-56 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e6537] resize-none text-base text-gray-900"
                    style={{ minHeight: '220px', fontSize: '1.1rem' }}
                    disabled={processedThread?.busy || false}
                  />
                  <div className="flex gap-2 justify-between items-center">
                    <div className="flex gap-2">
                      <button
                        onClick={generateAIResponse}
                        disabled={processedThread?.busy || generatingResponse || processedThread?.flag_for_review || processedThread?.flag}
                        className="flex items-center gap-1 px-2 py-1 bg-[#0e6537] text-white rounded hover:bg-[#0a5a2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        style={{ minWidth: '110px' }}
                      >
                        {generatingResponse ? (
                          <>
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            <span>Generating... (This may take up to 15 seonds)</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Generate</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleOpenEmailPreview}
                        disabled={!messageInput.trim() || processedThread?.busy}
                        className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 text-gray-700 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        style={{ minWidth: '110px' }}
                      >
                        <Mail className="w-4 h-4" />
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Widgets grid below AI Response */}
            <div className="grid grid-cols-2 gap-6 w-full mt-6">
              {/* Spam Status Widget - separate row when needed */}
              {processedThread?.spam && (
                <div className="bg-white rounded-2xl border shadow-lg p-6 flex flex-col items-center text-center min-h-[170px] mt-6">
                  <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-2">
                    <AlertTriangle className="h-7 w-7 text-red-500" />
                  </div>
                  <div className="mb-1 font-bold text-lg text-red-700">Marked as Spam</div>
                  <div className="text-gray-500 text-sm mb-4">
                    This conversation has been marked as spam
                  </div>
                  <button
                    onClick={handleMarkAsNotSpam}
                    disabled={updatingSpam}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingSpam ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Shield className="w-4 h-4 text-green-500" />
                        <span>Mark as Not Spam</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
        onRegenerate={generateAIResponse}
        isRegenerating={generatingResponse}
        isFlagged={isResponseFlagged}
      />
      <EmailPreviewModal
        isOpen={showEmailPreviewModal}
        onClose={() => setShowEmailPreviewModal(false)}
        onSend={sendEmail}
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
    </>
  )
}

/**
 * Change Log:
 * 5/25/25 - Initial version
 * - Created conversation detail page with message history
 * - Implemented client information panel
 * - Added AI-powered conversation summary
 * - Integrated quick action buttons
 * - Added responsive design for all screen sizes
 */
