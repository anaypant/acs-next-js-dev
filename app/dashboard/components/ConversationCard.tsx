import { Bell, CheckCircle, ChevronRight, Clock, Flag, Trash2, XCircle } from 'lucide-react';
import type { Thread, Message, MessageWithResponseId } from '../../types/lcp';
import GradientText from './GradientText';
import OverrideStatus from './OverrideStatus';

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
    const messages: Message[] = rawThread?.messages || [];
    const sortedMessages = [...messages].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const latestMessage = sortedMessages[0];

    const evMessage = sortedMessages
        .filter((msg: Message): msg is MessageWithResponseId => Boolean(msg.response_id))
        .sort((a: MessageWithResponseId, b: MessageWithResponseId) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    const ev_score = evMessage ? (typeof evMessage.ev_score === 'string' ? parseFloat(evMessage.ev_score) : evMessage.ev_score) : -1;

    let evColor = 'bg-gray-200 text-gray-700';
    if (ev_score >= 0 && ev_score <= 39) evColor = 'bg-red-100 text-red-800';
    else if (ev_score >= 40 && ev_score <= 69) evColor = 'bg-yellow-100 text-yellow-800';
    else if (ev_score >= 70 && ev_score <= 100) evColor = 'bg-green-100 text-green-800';

    const isPendingReply = latestMessage?.type === 'inbound-email';

    return (
        <div
            className={`flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors relative group ${
                conv.flag_for_review
                    ? 'flagged-review'
                    : ev_score > conv.lcp_flag_threshold
                    ? 'flagged-completion'
                    : 'border-[#0e6537]/20'
            }`}
            onClick={() => handleMarkAsRead(conv.conversation_id)}
        >
            {conv.flag_for_review && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1">
                    <Flag className="w-3 h-3" />
                    Flagged for Review
                </div>
            )}
            {!conv.flag_for_review && ev_score > conv.lcp_flag_threshold && (
                <div className="absolute -top-2 -right-2 bg-green-400 text-green-900 px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Flagged for Completion
                </div>
            )}
            <div className="flex flex-row sm:flex-col items-center justify-start gap-2 sm:gap-0 sm:w-10 md:w-12 pt-1">
                {!conv.read && !updatingRead && (
                    <span className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-100 text-red-800 text-xs rounded-full font-semibold shadow-md z-10">
                        <Bell className="w-3 h-3 sm:w-4 sm:h-4" /> Unread
                    </span>
                )}
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#0e6537]/10 rounded-full flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-semibold text-[#0e6537]">
                        {(latestMessage?.sender || latestMessage?.receiver || 'C').split(' ').map((n: string) => n[0]).join('')}
                    </span>
                </div>
            </div>
            <div className="flex-1 flex flex-col min-w-0 justify-between">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                    <div className="flex items-center gap-1">
                        <p className="font-medium text-xs sm:text-sm">{conv.source_name || latestMessage?.sender || latestMessage?.receiver || 'Unknown'}</p>
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
                <div className="flex items-center gap-2">
                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${evColor}`} title="Engagement Value (0=bad, 100=good)">
                        EV: {ev_score >= 0 ? ev_score : 'N/A'}
                    </span>
                    {ev_score > conv.lcp_flag_threshold && !conv.flag_for_review && (
                        <span className="flex items-center gap-1 text-green-600 font-bold" title="Flagged for completion">
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> Flagged
                        </span>
                    )}
                    <OverrideStatus isEnabled={conv.flag_review_override === 'true'} />
                    <button
                        className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold transition-colors duration-200 shadow-sm
                            ${conv.lcp_enabled ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}
                            ${updatingLcp === conv.conversation_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={e => {
                            e.stopPropagation();
                            handleLcpToggle(conv.conversation_id, conv.lcp_enabled);
                        }}
                        disabled={updatingLcp === conv.conversation_id}
                        title={conv.lcp_enabled ? 'Disable LCP' : 'Enable LCP'}
                    >
                        {updatingLcp === conv.conversation_id ? (
                            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate.spin" />
                        ) : conv.lcp_enabled ? (
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        ) : (
                            <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                        {conv.lcp_enabled ? 'LCP On' : 'LCP Off'}
                    </button>
                    <button
                        className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold transition-colors duration-200 shadow-sm
                            ${deletingThread === conv.conversation_id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-100 text-red-600 hover:text-red-700'}
                            ${deletingThread === conv.conversation_id ? 'bg-red-100' : 'bg-red-50'}`}
                        onClick={e => {
                            e.stopPropagation();
                            handleDeleteThread(
                                conv.conversation_id,
                                conv.source_name || latestMessage?.sender || latestMessage?.receiver || 'Unknown'
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
                        Delete
                    </button>
                </div>
                <p className="text-xs text-gray-600 mb-0.5 sm:mb-1">{latestMessage?.subject || 'No subject'}</p>
                <p className="text-xs text-gray-500 italic mb-0.5 sm:mb-1">Summary: <span className="not-italic text-gray-700">{conv.ai_summary}</span></p>
                <p className="text-xs text-gray-400">{latestMessage?.timestamp ? new Date(latestMessage.timestamp).toLocaleString() : ''}</p>
            </div>
            <div className="flex-[1.2] flex items-center justify-center min-w-0">
                <GradientText
                    text={latestMessage?.body || ''}
                    isPending={isPendingReply}
                    messageType={latestMessage?.type}
                />
            </div>
            <div className="flex flex-col justify-center items-end w-full sm:w-32 md:w-40 pl-2">
                <button
                    onClick={e => {
                        e.stopPropagation();
                        handleMarkAsRead(conv.conversation_id);
                    }}
                    className="arrow-animate-hover w-full sm:w-auto px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-[#0e6537] bg-[#e6f5ec] rounded-lg hover:bg-[#bbf7d0] hover:shadow-lg flex items-center justify-center gap-1 sm:gap-2 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0e6537]/30 group"
                >
                    <span className="relative flex items-center w-6 h-4 sm:w-8 sm:h-5 mr-0.5 sm:mr-1">
                        <ChevronRight className="arrow-1 absolute left-0 top-0 w-3 h-3 sm:w-4 sm:h-4 transition-transform" />
                        <ChevronRight className="arrow-2 absolute left-1.5 sm:left-2 top-0 w-3 h-3 sm:w-4 sm:h-4 transition-transform" />
                        <ChevronRight className="arrow-3 absolute left-3 sm:left-4 top-0 w-3 h-3 sm:w-4 sm:h-4 transition-transform" />
                    </span>
                    <span className="transition-colors duration-200 group-hover:text-[#166534]">View Thread</span>
                </button>
            </div>
        </div>
    );
};

export default ConversationCard; 