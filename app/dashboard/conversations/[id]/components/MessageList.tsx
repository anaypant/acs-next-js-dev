import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { ChevronDown, Search, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MessageItem } from './MessageItem';
import { groupMessagesByDate } from '@/lib/utils/conversation';
import type { Conversation, Message } from '@/types/conversation';

export interface MessageListProps {
  conversation: Conversation | null;
  feedback: Record<string, 'like' | 'dislike'>;
  evFeedback: Record<string, 'positive' | 'negative'>;
  updatingFeedbackId: string | null;
  updatingEvFeedbackId: string | null;
  onResponseFeedback: (messageId: string, feedback: 'like' | 'dislike') => void;
  onEvFeedback: (messageId: string, feedback: 'positive' | 'negative') => void;
  onReport: (messageId: string) => void;
  className?: string;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export const MessageList = forwardRef<HTMLDivElement, MessageListProps>(({
  conversation,
  feedback,
  evFeedback,
  updatingFeedbackId,
  updatingEvFeedbackId,
  onResponseFeedback,
  onEvFeedback,
  onReport,
  className,
  searchInputRef
}, ref) => {
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const internalSearchRef = useRef<HTMLInputElement>(null);
  
  // Use provided ref or internal ref
  const searchRef = searchInputRef || internalSearchRef;

  // Extract data from conversation
  const messages = conversation?.messages || [];
  const clientEmail = conversation?.thread?.client_email || '';

  const groupedMessages = groupMessagesByDate(messages);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Filter messages based on search query
  const filteredGroups = Object.entries(groupedMessages).map(([date, dateMessages]) => ({
    date,
    messages: dateMessages.filter(message =>
      message.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.messages.length > 0);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle scroll to show/hide new message button
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowNewMessageButton(!isNearBottom);
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Jump to last unread
  const jumpToLastUnread = () => {
    const unreadMessages = messages.filter(msg => !msg.read);
    if (unreadMessages.length > 0) {
      const lastUnread = unreadMessages[unreadMessages.length - 1];
      const element = document.getElementById(`message-${lastUnread.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div ref={ref} className={cn("flex flex-col h-full", className)}>
      {/* Toolbar */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e6537] text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={jumpToLastUnread}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Jump to unread
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0"
      >
        {filteredGroups.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {searchQuery ? 'No messages found matching your search.' : 'No messages found.'}
          </div>
        ) : (
          filteredGroups.map((group, groupIndex) => (
            <div key={group.date} className="space-y-4">
              {/* Date Separator */}
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">{group.date}</span>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4">
                {group.messages.map((message, messageIndex) => {
                  const isLastMessage = groupIndex === filteredGroups.length - 1 && 
                                       messageIndex === group.messages.length - 1;
                  
                  return (
                    <div
                      key={`${message.id}-${messageIndex}`}
                      id={`message-${message.id}`}
                      ref={isLastMessage ? endOfMessagesRef : undefined}
                    >
                      <MessageItem
                        message={message}
                        index={messageIndex}
                        clientEmail={clientEmail}
                        feedback={feedback}
                        evFeedback={evFeedback}
                        updatingFeedbackId={updatingFeedbackId}
                        updatingEvFeedbackId={updatingEvFeedbackId}
                        onResponseFeedback={onResponseFeedback}
                        onEvFeedback={onEvFeedback}
                        onReport={onReport}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating New Message Button */}
      {showNewMessageButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-24 right-8 flex items-center gap-2 px-4 py-2 bg-[#0e6537] text-white rounded-full shadow-lg hover:bg-[#0a5a2f] transition-colors z-10"
        >
          <ChevronDown className="w-4 h-4" />
          <span className="text-sm font-medium">New messages</span>
        </button>
      )}
    </div>
  );
});

MessageList.displayName = 'MessageList'; 