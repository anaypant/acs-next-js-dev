/**
 * File: app/dashboard/components/ConversationCard.tsx
 * Purpose: Renders individual conversation cards with status indicators, actions, and message previews.
 * Author: Alejo Cagliolo
 * Date: 06/11/25
 * Version: 1.0.1
 */

import { Bell, CheckCircle, ChevronRight, Clock, Flag, Trash2, XCircle } from 'lucide-react';
import type { Thread, Message, MessageWithResponseId } from '../../types/lcp';
import GradientText from './GradientText';
import OverrideStatus from './OverrideStatus';
import { Home, Mail, Users, MessageSquare, BarChart3, Settings, Phone, Calendar, PanelLeft, AlertTriangle, RefreshCw, ChevronDown, X, Shield, ShieldOff } from "lucide-react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';

/**
 * Props interface for ConversationCard component
 * @interface ConversationCardProps
 * @property {Thread} conv - The conversation thread data
 * @property {any} rawThread - Raw thread data including messages
 * @property {string | null} updatingRead - ID of conversation being marked as read
 * @property {string | null} updatingLcp - ID of conversation being updated for LCP
 * @property {string | null} deletingThread - ID of conversation being deleted
 * @property {Function} handleMarkAsRead - Handler for marking conversation as read
 * @property {Function} handleLcpToggle - Handler for toggling LCP status
 * @property {Function} handleDeleteThread - Handler for deleting conversation
 */
type ConversationCardProps = {
    conv: Thread;
    rawThread: any;
    updatingRead: string | null;
    updatingLcp: string | null;
    deletingThread: string | null;
    handleMarkAsRead: (conversationId: string) => void;
    handleLcpToggle: (conversationId: string, currentStatus: boolean) => void;
    handleDeleteThread: (conversationId: string, conversationName: string) => void;
};

// Add Pascal colors array
const PASCAL_COLORS = [
    '#FF6B6B', // Coral Red
    '#4ECDC4', // Turquoise
    '#45B7D1', // Sky Blue
    '#96CEB4', // Sage Green
    '#FFEEAD', // Cream
    '#D4A5A5', // Dusty Rose
    '#9B59B6', // Purple
    '#3498DB', // Blue
    '#E67E22', // Orange
    '#2ECC71', // Emerald
    '#F1C40F', // Yellow
    '#1ABC9C', // Teal
    '#E74C3C', // Red
    '#34495E', // Dark Blue
    '#16A085', // Dark Teal
];

// Function to get consistent color for a conversation
const getConversationColor = (conversationId: string) => {
    if (!conversationId) return PASCAL_COLORS[0]; // Return first color as fallback
    // Use the first 8 characters of the ID to generate a number
    const hash = conversationId.slice(0, 8).split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    // Use the hash to select a color
    return PASCAL_COLORS[Math.abs(hash) % PASCAL_COLORS.length];
};

// Returns a style object for the EV score badge based on the score (0-100)
function getEvScoreColor(score: number) {
    const s = Math.max(0, Math.min(100, score));
    let h = 0;
    if (s <= 50) {
        h = 0 + (48 - 0) * (s / 50);
    } else {
        h = 48 + (142 - 48) * ((s - 50) / 50);
    }
    return {
        backgroundColor: `hsl(${h}, 95%, 90%)`,
        color: `hsl(${h}, 60%, 30%)`,
    };
}

/**
 * ConversationCard Component
 * Displays individual conversation cards with interactive features and status indicators
 * 
 * Features:
 * - Responsive layout with mobile optimization
 * - Status indicators (unread, flagged, completion)
 * - Interactive actions (mark as read, toggle LCP, delete)
 * - Message preview with gradient text
 * - Dynamic color coding based on conversation ID
 * - Engagement value (EV) score display
 * 
 * @param {ConversationCardProps} props - Component props
 * @returns {JSX.Element} Conversation card with all interactive elements
 */
const ConversationCard = ({
    conv,
    rawThread,
    updatingRead,
    updatingLcp,
    deletingThread,
    handleMarkAsRead,
    handleLcpToggle,
    handleDeleteThread,
}: ConversationCardProps) => {
    const router = useRouter();
    // Add local state for LCP status
    const [localLcpEnabled, setLocalLcpEnabled] = useState(conv.lcp_enabled);
    const [isUpdatingLcp, setIsUpdatingLcp] = useState(false);

    // Update local state when prop changes
    useEffect(() => {
        setLocalLcpEnabled(conv.lcp_enabled);
    }, [conv.lcp_enabled]);

    // Handle LCP toggle with local state management
    const handleLocalLcpToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isUpdatingLcp) return;

        setIsUpdatingLcp(true);
        try {
            // Optimistically update UI
            setLocalLcpEnabled(!localLcpEnabled);
            // Call the parent handler
            await handleLcpToggle(conv.conversation_id, localLcpEnabled);
        } catch (error) {
            // Revert on error
            setLocalLcpEnabled(localLcpEnabled);
            console.error('Error toggling LCP:', error);
        } finally {
            setIsUpdatingLcp(false);
        }
    };

    console.log(rawThread);
    const messages: Message[] = rawThread?.messages || [];
    const sortedMessages = [...messages].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Find the most recent message (inbound or outbound)
    const mostRecentMessage = messages.length > 0
        ? [...messages].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
        : undefined;
    const subject = mostRecentMessage?.subject || 'No subject';

    // Find the most recent evaluable message for EV score
    const evMessage = sortedMessages.find((msg: Message) => {
        const score = typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score;
        return score !== undefined && score !== null && !isNaN(score);
    });
    const ev_score = evMessage ? (typeof evMessage.ev_score === 'string' ? parseFloat(evMessage.ev_score) : evMessage.ev_score) : -1;
    const score = typeof ev_score === 'number' && !isNaN(ev_score) ? ev_score : -1;

    const evColorStyle = score >= 0 ? getEvScoreColor(score) : { backgroundColor: '#e5e7eb', color: '#374151' };

    // Pending reply: only if the most recent message is inbound-email
    const isPendingReply = mostRecentMessage?.type === 'inbound-email';

    // Get the color for this conversation
    const circleColor = getConversationColor(conv.conversation_id);
    const initials = (mostRecentMessage?.sender || mostRecentMessage?.receiver || 'C')
        .split(' ')
        .map((n: string) => n[0].toUpperCase())
        .join('');

    // Add logging for AI summary display
    useEffect(() => {
        console.log('[ConversationCard] Rendering card:', {
            conversation_id: conv.conversation_id,
            has_ai_summary: !!conv.ai_summary,
            ai_summary_length: conv.ai_summary?.length,
            ai_summary_value: conv.ai_summary || 'UNKNOWN'
        });
    }, [conv]);

    return (
        <div
            className={`flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors relative ${
                conv.flag_for_review
                    ? 'flagged-review'
                    : score > conv.lcp_flag_threshold
                    ? 'flagged-completion'
                    : 'border-[#0e6537]/20'
            }`}
            onClick={() => handleMarkAsRead(conv.conversation_id)}
        >
            {conv.flag_for_review && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1">
                    <Flag className="w-3 h-3" />
                    <span className="hidden xs:inline">Flagged for Review</span>
                    <span className="xs:hidden">Review</span>
                </div>
            )}
            {!conv.flag_for_review && score > conv.lcp_flag_threshold && (
                <div className="absolute -top-2 -right-2 bg-green-400 text-green-900 px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span className="hidden xs:inline">Flagged for Completion</span>
                    <span className="xs:hidden">Complete</span>
                </div>
            )}
            <div className="flex flex-row sm:flex-col items-center justify-start gap-2 sm:gap-0 sm:w-10 md:w-12 pt-1">
                {!conv.read && !updatingRead && (
                    <button
                        className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-100 text-red-800 text-xs rounded-full font-semibold shadow-md z-10 hover:bg-red-200 transition-colors cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(conv.conversation_id);
                        }}
                        title="Click to mark as read"
                    >
                        <Bell className="w-3 h-3 sm:w-4 sm:h-4" /> 
                        <span className="hidden xs:inline">Unread</span>
                        <span className="xs:hidden">New</span>
                    </button>
                )}
                <div 
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: circleColor }}
                >
                    <span className="text-xs sm:text-sm font-semibold text-white">
                        {initials}
                    </span>
                </div>
            </div>
            <div className="flex-1 flex flex-col min-w-0 justify-between">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                    <div className="flex items-center gap-1">
                        <p className="font-medium text-xs sm:text-sm truncate max-w-[150px] xs:max-w-[200px] sm:max-w-none">{conv.source_name || mostRecentMessage?.sender || mostRecentMessage?.receiver || 'Unknown'}</p>
                        {isPendingReply && (
                            <span className="flex items-center gap-1 text-amber-600" title="Awaiting your reply">
                                <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        {conv.busy && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#0e6537]/10 rounded-full">
                                <div className="w-1.5 h-1.5 bg-[#0e6537] rounded-full animate-pulse" />
                                <span className="text-xs text-[#0e6537] font-medium">Email in progress</span>
                            </div>
                        )}
                        {conv.busy && (
                            <p className="text-xs text-[#0e6537] mt-1">Please wait while the email is being sent...</p>
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span
                        className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium whitespace-nowrap"
                        style={evColorStyle}
                        title="Engagement Value (0=bad, 100=good)"
                    >
                        EV: {score >= 0 ? score.toString() : 'N/A'}
                    </span>
                    {score > conv.lcp_flag_threshold && !conv.flag_for_review && (
                        <span className="flex items-center gap-1 text-green-600 font-bold" title="Flagged for completion">
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> 
                            <span className="hidden xs:inline">Flagged</span>
                        </span>
                    )}
                    <OverrideStatus isEnabled={Boolean(conv.flag_review_override)} />
                    <button
                        className={`flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-semibold transition-colors duration-200 shadow-sm whitespace-nowrap
                            ${localLcpEnabled ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}
                            ${isUpdatingLcp ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleLocalLcpToggle}
                        disabled={isUpdatingLcp}
                        title={localLcpEnabled ? 'Disable LCP' : 'Enable LCP'}
                    >
                        {isUpdatingLcp ? (
                            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : localLcpEnabled ? (
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        ) : (
                            <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                        <span className="hidden xs:inline">{localLcpEnabled ? 'LCP On' : 'LCP Off'}</span>
                        <span className="xs:hidden">{localLcpEnabled ? 'On' : 'Off'}</span>
                    </button>
                    <button
                        className={`flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-semibold transition-colors duration-200 shadow-sm whitespace-nowrap
                            ${deletingThread === conv.conversation_id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-100 text-red-600 hover:text-red-700'}
                            ${deletingThread === conv.conversation_id ? 'bg-red-100' : 'bg-red-50'}`}
                        onClick={e => {
                            e.stopPropagation();
                            handleDeleteThread(
                                conv.conversation_id,
                                conv.source_name || mostRecentMessage?.sender || mostRecentMessage?.receiver || 'Unknown'
                            );
                        }}
                        disabled={deletingThread === conv.conversation_id}
                        title="Delete conversation"
                    >
                        {deletingThread === conv.conversation_id ? (
                            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                        <span className="hidden xs:inline">Delete</span>
                    </button>
                </div>
                <p className="text-xs text-gray-600 mb-0.5 sm:mb-1 truncate">{subject}</p>
                <p className="text-xs text-gray-500 italic mb-0.5 sm:mb-1 line-clamp-1">
                    Summary: <span className="not-italic text-gray-700">
                        {(() => {
                            const summary = conv.ai_summary;
                            console.log('[ConversationCard] Displaying summary:', {
                                conversation_id: conv.conversation_id,
                                has_summary: !!summary,
                                summary_length: summary?.length,
                                summary_value: summary || 'UNKNOWN'
                            });
                            return summary || 'No summary available';
                        })()}
                    </span>
                </p>
                <p className="text-xs text-gray-400">{mostRecentMessage?.timestamp ? new Date(mostRecentMessage.timestamp).toLocaleString() : ''}</p>
            </div>
            <div className="flex-[1.2] flex items-center justify-center min-w-0 pl-6">
                <GradientText
                    text={mostRecentMessage?.body || ''}
                    isPending={isPendingReply}
                    messageType={mostRecentMessage?.type}
                />
            </div>
            <div className="flex flex-col justify-center items-end w-full sm:w-24 md:w-28 pl-2">
                <button
                    onClick={e => {
                        e.stopPropagation();
                        router.push(`/dashboard/conversations/${conv.conversation_id}`);
                    }}
                    className="arrow-animate-hover w-full sm:w-auto px-1.5 sm:px-2 py-1 sm:py-1.5 text-xs font-medium text-[#0e6537] bg-[#e6f5ec] rounded-lg hover:bg-[#bbf7d0] hover:shadow-lg flex items-center justify-center gap-1 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0e6537]/30 group cursor-pointer"
                >
                    <span className="relative flex items-center w-5 h-4 sm:w-6 sm:h-4 mr-0.5">
                        <ChevronRight className="arrow-1 absolute left-0 top-0 w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform" />
                        <ChevronRight className="arrow-2 absolute left-1.5 sm:left-2 top-0 w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform" />
                        <ChevronRight className="arrow-3 absolute left-3 sm:left-4 top-0 w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform" />
                    </span>
                    <span className="transition-colors duration-200 group-hover:text-[#166534]">View</span>
                </button>
            </div>
        </div>
    );
};

export default ConversationCard;

/**
 * Change Log:
 * 06/11/25 - Version 1.0.1
 * - Enhanced mobile responsiveness
 * - Improved status indicators
 * - Added comprehensive documentation
 * - Optimized performance
 * 
 * 5/25/25 - Version 1.0.0
 * - Initial implementation
 * - Basic conversation card layout
 * - Status indicators and actions
 * - Message preview functionality
 */ 