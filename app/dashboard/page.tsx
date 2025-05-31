/**
 * File: app/dashboard/page.tsx
 * Purpose: Renders the main dashboard with lead conversion pipeline, performance metrics, and activity tracking.
 * Author: Alejo Cagliolo
 * Date: 5/25/25
 * Version: 1.0.0
 */

"use client"
import { Home, Mail, Users, MessageSquare, BarChart3, Settings, Phone, Calendar, PanelLeft, Bell, CheckCircle, XCircle, Flag, Trash2, AlertTriangle, RefreshCw, Clock, ChevronRight } from "lucide-react"
import type React from "react"
import { SidebarProvider, AppSidebar, SidebarTrigger, SidebarInset } from "./Sidebar"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { goto404 } from "../utils/error"
import type { Thread, Message } from "../types/lcp"
import type { Session } from "next-auth"

// Add Modal component at the top level
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, conversationName }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void;
  conversationName: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Delete Conversation</h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete the conversation with <span className="font-medium">{conversationName}</span>? 
          This action cannot be reversed.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Add helper function at the top level
const hasPendingReply = (messages: any[]) => {
  if (!messages || messages.length === 0) return false;
  const lastMessage = messages[messages.length - 1]; // Messages are ordered oldest first
  return lastMessage.type === 'inbound-email';
};

// Improved GradientText using CSS mask-image for smooth fade and whitespace preservation
const GradientText = ({ text, isPending, messageType }: { text: string, isPending: boolean, messageType?: string }) => {
  if (!text) return null;
  // Replace newlines with spaces
  const singleLineText = text.replace(/\n/g, ' ');
  // Add prefix based on message type
  const prefix = messageType === 'inbound-email' ? 'Lead: ' : 'You: ';
  // Limit to 95 characters (including prefix)
  const limitedText = (prefix + singleLineText).slice(0, 95) + '...';
  return (
    <span
      className="text-sm text-gray-500 block"
      style={{
        WebkitMaskImage:
          'linear-gradient(90deg, black 0%, black 80%, transparent 100%)',
        maskImage:
          'linear-gradient(90deg, black 0%, black 80%, transparent 100%)',
        maxWidth: '100%',
        overflow: 'hidden',
        display: 'block',
      }}
    >
      {limitedText}
    </span>
  );
};

// Add custom keyframes for icon animation
// Place this in the component file for now (can be moved to global CSS)
const IconAnimationStyle = () => (
  <style>{`
    @keyframes icon-slide-scale {
      0% { transform: scale(1) translateX(0); color: #166534; }
      60% { transform: scale(1.18) translateX(8px); color: #22c55e; }
      100% { transform: scale(1.12) translateX(6px); color: #16a34a; }
    }
    .icon-animate-hover:hover svg {
      animation: icon-slide-scale 0.5s cubic-bezier(0.4,0,0.2,1) forwards;
    }
    .icon-animate-active:active svg {
      transform: scale(0.92) translateX(0);
      transition: transform 0.1s;
    }
  `}</style>
);

// Add custom keyframes for triple arrow animation
const TripleArrowAnimationStyle = () => (
  <style>{`
    @keyframes arrow-move {
      0% { transform: translateX(0); opacity: 1; }
      60% { transform: translateX(12px); opacity: 1; }
      100% { transform: translateX(20px); opacity: 0; }
    }
    .arrow-animate-hover:hover .arrow-1 {
      animation: arrow-move 0.4s cubic-bezier(0.4,0,0.2,1) 0s forwards;
    }
    .arrow-animate-hover:hover .arrow-2 {
      animation: arrow-move 0.4s cubic-bezier(0.4,0,0.2,1) 0.08s forwards;
    }
    .arrow-animate-hover:hover .arrow-3 {
      animation: arrow-move 0.4s cubic-bezier(0.4,0,0.2,1) 0.16s forwards;
    }
    .arrow-animate-hover .arrow-1,
    .arrow-animate-hover .arrow-2,
    .arrow-animate-hover .arrow-3 {
      transition: transform 0.2s, opacity 0.2s;
    }
    .arrow-animate-hover:not(:hover) .arrow-1,
    .arrow-animate-hover:not(:hover) .arrow-2,
    .arrow-animate-hover:not(:hover) .arrow-3 {
      transform: translateX(0); opacity: 1;
      animation: none;
    }
  `}</style>
);

/**
 * Page Component
 * Main dashboard component that displays the lead conversion pipeline and analytics
 * 
 * Features:
 * - Welcome section with active conversation count
 * - Lead statistics and performance metrics
 * - Recent conversations with AI scoring
 * - Lead performance analytics and trends
 * - Lead sources and activity tracking
 * 
 * @returns {JSX.Element} Complete dashboard view with sidebar integration
 */
export default function Page() {
  const { data: session, status } = useSession() as { data: Session | null, status: string }
  const router = useRouter()
  const [mounted, setMounted] = useState(false) 
  const [conversations, setConversations] = useState<Thread[]>([])
  const [rawThreads, setRawThreads] = useState<any[]>([])
  const [loadingConversations, setLoadingConversations] = useState(false)
  const [updatingLcp, setUpdatingLcp] = useState<string | null>(null)
  const [updatingRead, setUpdatingRead] = useState<string | null>(null)
  const [deletingThread, setDeletingThread] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [threadToDelete, setThreadToDelete] = useState<{ id: string; name: string } | null>(null)

  // Handle mounting state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Function to fetch threads
  const fetchThreads = async () => {
    if (!mounted || !session?.user?.id) return;

    try {
      setLoadingConversations(true);
      const response = await fetch('/api/lcp/get_all_threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch threads');
      }

      const data = await response.json();
      console.log('Threads data:', data);

      // Map threads to Thread type and set as conversations
      if (Array.isArray(data.data)) {
        // Sort threads by most recent message timestamp
        const sortedData = data.data.sort((a: any, b: any) => {
          const aMessages = a.messages || [];
          const bMessages = b.messages || [];
          
          const aLatestTimestamp = aMessages.length > 0 ? new Date(aMessages[0].timestamp).getTime() : 0;
          const bLatestTimestamp = bMessages.length > 0 ? new Date(bMessages[0].timestamp).getTime() : 0;
          
          return bLatestTimestamp - aLatestTimestamp; // Descending order (newest first)
        });

        setConversations(
          sortedData.map((item: any) => ({
            conversation_id: item.thread?.conversation_id || '',
            associated_account: item.thread?.associated_account || '',
            lcp_enabled: item.thread?.lcp_enabled === true || item.thread?.lcp_enabled === 'true',
            read: item.thread?.read === true || item.thread?.read === 'true',
            source: item.thread?.source || '',
            source_name: item.thread?.source_name || '',
            lcp_flag_threshold: typeof item.thread?.lcp_flag_threshold === 'number' ? item.thread.lcp_flag_threshold : Number(item.thread?.lcp_flag_threshold) || 0,
            ai_summary: item.thread?.ai_summary || '',
            budget_range: item.thread?.budget_range || '',
            preferred_property_types: item.thread?.preferred_property_types || '',
            timeline: item.thread?.timeline || '',
          }))
        )
        setRawThreads(sortedData)
      } else {
        setConversations([])
        setRawThreads([])
      }

      // Log id
      console.log('Session user ID:', session?.user?.id);
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setLoadingConversations(false);
    }
  };

  // Fetch threads when session is available
  useEffect(() => {
    if (mounted && session?.user?.id) {
      fetchThreads();
    }
  }, [session, mounted]);

  // Function to handle marking thread as read
  const handleMarkAsRead = async (conversationId: string) => {
    if (!session?.user?.id) return;
    
    try {
      setUpdatingRead(conversationId);
      
      const response = await fetch('/api/db/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'Threads',
          key_name: 'conversation_id',
          key_value: conversationId,
          update_data: {
            read: true
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to mark thread as read');
      }

      // Update local state after successful API call
      setConversations(prev => prev.map(conv => 
        conv.conversation_id === conversationId 
          ? { ...conv, read: true }
          : conv
      ));

      // Navigate to the conversation
      window.location.href = `/dashboard/conversations/${conversationId}`;
    } catch (error) {
      console.error('Error marking thread as read:', error);
      // Navigate anyway even if the update fails
      window.location.href = `/dashboard/conversations/${conversationId}`;
    } finally {
      setUpdatingRead(null);
    }
  };

  // Function to handle LCP toggle
  const handleLcpToggle = async (conversationId: string, currentStatus: boolean) => {
    if (!session?.user?.id) return;
    
    try {
      setUpdatingLcp(conversationId);
      
      const response = await fetch('/api/db/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'Threads',
          key_name: 'conversation_id',
          key_value: conversationId,
          update_data: {
            lcp_enabled: !currentStatus
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update LCP status');
      }

      // Update local state after successful API call
      setConversations(prev => prev.map(conv => 
        conv.conversation_id === conversationId 
          ? { ...conv, lcp_enabled: !currentStatus }
          : conv
      ));
    } catch (error) {
      console.error('Error updating LCP status:', error);
      // Optionally show an error message to the user
    } finally {
      setUpdatingLcp(null);
    }
  };

  // Update handleDeleteThread function
  const handleDeleteThread = async (conversationId: string, conversationName: string) => {
    if (!session?.user?.id) return;
    
    setThreadToDelete({ id: conversationId, name: conversationName });
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!threadToDelete) return;
    
    try {
      setDeletingThread(threadToDelete.id);
      
      const response = await fetch('/api/lcp/delete_thread', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: threadToDelete.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to delete thread');
      }

      // Update local state after successful deletion
      setConversations(prev => prev.filter(conv => conv.conversation_id !== threadToDelete.id));
      setRawThreads(prev => prev.filter(thread => thread.thread?.conversation_id !== threadToDelete.id));
    } catch (error) {
      console.error('Error deleting thread:', error);
      alert('Failed to delete conversation. Please try again.');
    } finally {
      setDeletingThread(null);
      setDeleteModalOpen(false);
      setThreadToDelete(null);
    }
  };

  // Calculate metrics from conversations data
  const calculateMetrics = () => {
    if (!rawThreads.length) return {
      newLeadsToday: 0,
      pendingReplies: 0,
      unopenedLeads: 0
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const metrics = {
      newLeadsToday: 0,
      pendingReplies: 0,
      unopenedLeads: 0
    };

    rawThreads.forEach((threadData) => {
      const messages = threadData.messages || [];
      const thread = threadData.thread;

      // Calculate unopened leads
      if (!thread?.read) {
        metrics.unopenedLeads++;
      }

      // Calculate pending replies
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1]; // Messages are ordered newest first
        if (lastMessage.type === 'inbound-email') {
          metrics.pendingReplies++;
        }
      }

      // Calculate new leads today
      if (messages.length > 0) {
        const firstMessage = messages[messages.length - 1]; // Get the first message
        const messageDate = new Date(firstMessage.timestamp);
        messageDate.setHours(0, 0, 0, 0);
        
        if (messageDate.getTime() === today.getTime()) {
          metrics.newLeadsToday++;
        }
      }
    });

    return metrics;
  };

  // Get metrics
  const metrics = calculateMetrics();

  // Check authentication status
  useEffect(() => {
    if (!mounted) return;
    if (status === "unauthenticated") {
      goto404("401", "No active session found", router)
    }
  }, [status, session, router, mounted])

  return (
    <>
      <IconAnimationStyle />
      <TripleArrowAnimationStyle />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Header with navigation and title */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-[#0e6537]/20 px-4 bg-gradient-to-r from-[#e6f5ec] to-[#f0f9f4]">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Lead Conversion Pipeline</h1>
            </div>
          </header>

          {/* Add DeleteConfirmationModal */}
          <DeleteConfirmationModal
            isOpen={deleteModalOpen}
            onClose={() => {
              setDeleteModalOpen(false);
              setThreadToDelete(null);
            }}
            onConfirm={confirmDelete}
            conversationName={threadToDelete?.name || 'Unknown'}
          />

          {/* Main dashboard content with gradient background */}
          <div className="flex flex-1 flex-col gap-6 p-6 bg-gradient-to-b from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1] min-h-screen">
            {/* Welcome section with personalized greeting */}
            <div className="bg-gradient-to-b from-[#0a5a2f] via-[#0e6537] to-[#157a42] p-8 rounded-lg">
              <h1 style={{ color: 'white' }} className="text-3xl font-bold mb-2">Welcome, {session?.user?.name || 'User'}</h1>
              <p style={{ color: 'white' }}>Ready to convert more leads today?</p>
            </div>

            {/* Lead statistics widgets with mini charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* New leads widget */}
              <div className="bg-white p-6 rounded-lg border border-[#0e6537]/20 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-[#0e6537]">{metrics.newLeadsToday}</p>
                    <p className="text-sm text-gray-600">New Leads Today</p>
                  </div>
                  {/* Mini bar chart visualization */}
                  <div className="w-16 h-8 bg-[#0e6537]/10 rounded flex items-end justify-center gap-1 p-1">
                    <div className="w-1 bg-[#0e6537] h-2"></div>
                    <div className="w-1 bg-[#0e6537] h-4"></div>
                    <div className="w-1 bg-[#0e6537] h-3"></div>
                    <div className="w-1 bg-[#0e6537] h-6"></div>
                    <div className="w-1 bg-[#0e6537] h-2"></div>
                  </div>
                </div>
              </div>

              {/* Pending replies widget */}
              <div className="bg-white p-6 rounded-lg border border-[#0e6537]/20 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-[#0e6537]">{metrics.pendingReplies}</p>
                    <p className="text-sm text-gray-600">Pending Replies</p>
                  </div>
                  {/* Mini bar chart visualization */}
                  <div className="w-16 h-8 bg-[#0e6537]/10 rounded flex items-end justify-center gap-1 p-1">
                    <div className="w-1 bg-[#0e6537] h-3"></div>
                    <div className="w-1 bg-[#0e6537] h-5"></div>
                    <div className="w-1 bg-[#0e6537] h-2"></div>
                    <div className="w-1 bg-[#0e6537] h-6"></div>
                    <div className="w-1 bg-[#0e6537] h-4"></div>
                  </div>
                </div>
              </div>

              {/* Unopened leads widget */}
              <div className="bg-white p-6 rounded-lg border border-[#0e6537]/20 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-[#0e6537]">{metrics.unopenedLeads}</p>
                    <p className="text-sm text-gray-600">Unopened Leads</p>
                  </div>
                  {/* Mini bar chart visualization */}
                  <div className="w-16 h-8 bg-[#0e6537]/10 rounded flex items-end justify-center gap-1 p-1">
                    <div className="w-1 bg-[#0e6537] h-4"></div>
                    <div className="w-1 bg-[#0e6537] h-2"></div>
                    <div className="w-1 bg-[#0e6537] h-6"></div>
                    <div className="w-1 bg-[#0e6537] h-3"></div>
                    <div className="w-1 bg-[#0e6537] h-5"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main dashboard grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Recent conversations section */}
              <div className="lg:col-span-3 bg-white p-6 rounded-lg border border-[#0e6537]/20 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Recent Conversations</h3>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm flex items-center gap-2"
                      onClick={fetchThreads}
                      disabled={loadingConversations}
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingConversations ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                    <button
                      className="px-4 py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm"
                      onClick={() => (window.location.href = "/dashboard/conversations")}
                    >
                      Load All Conversations
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  {loadingConversations ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="w-8 h-8 animate-spin text-[#0e6537]" />
                      <span className="ml-2 text-gray-600">Loading conversations...</span>
                    </div>
                  ) : conversations.length === 0 ? (
                    <div className="text-center py-8 text-gray-600">No conversations found.</div>
                  ) : (
                    conversations.map((conv, idx) => {
                      // All messages for this thread
                      const messages: Message[] = rawThreads?.[idx]?.messages || [];
                      // Sort messages by timestamp descending (newest first)
                      const sortedMessages = [...messages].sort((a, b) => 
                        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                      );
                      
                      // Get the latest message (first in sorted array) for gradient text
                      const latestMessage = sortedMessages[0];

                      // Find the most recent message with a valid ev_score (0-100) - only for EV score display
                      const evMessage = sortedMessages
                        .filter(msg => {
                          const score = typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score;
                          return typeof score === 'number' && !isNaN(score) && score >= 0 && score <= 100;
                        })
                        .reduce((latest, msg) => {
                          if (!latest) return msg;
                          return new Date(msg.timestamp) > new Date(latest.timestamp) ? msg : latest;
                        }, undefined as Message | undefined);
                      
                      // Calculate EV score - only for display purposes
                      const ev_score = evMessage ? (typeof evMessage.ev_score === 'string' ? parseFloat(evMessage.ev_score) : evMessage.ev_score) : -1;
                      // Determine badge color
                      let evColor = 'bg-gray-200 text-gray-700';
                      if (ev_score >= 0 && ev_score <= 39) evColor = 'bg-red-100 text-red-800';
                      else if (ev_score >= 40 && ev_score <= 69) evColor = 'bg-yellow-100 text-yellow-800';
                      else if (ev_score >= 70 && ev_score <= 100) evColor = 'bg-green-100 text-green-800';

                      const isPendingReply = hasPendingReply(messages);

                      return (
                        <div
                          key={conv.conversation_id || idx}
                          className="flex items-stretch gap-4 p-4 border border-[#0e6537]/20 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors relative group"
                          onClick={() => handleMarkAsRead(conv.conversation_id)}
                        >
                          {/* Avatar and left section */}
                          <div className="flex flex-col items-center justify-start w-12 pt-1">
                            {/* Unread alert badge */}
                            {!conv.read && !updatingRead && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-semibold shadow-md z-10 mb-2">
                                <Bell className="w-4 h-4" /> Unread
                              </span>
                            )}
                            <div className="w-10 h-10 bg-[#0e6537]/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-[#0e6537]">
                                {(latestMessage?.sender || latestMessage?.receiver || 'C').split(' ').map((n: string) => n[0]).join('')}
                              </span>
                            </div>
                          </div>

                          {/* Main content: left third */}
                          <div className="flex-1 flex flex-col min-w-0 justify-between">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex items-center gap-1">
                                <p className="font-medium text-sm">{conv.source_name || latestMessage?.sender || latestMessage?.receiver || 'Unknown'}</p>
                                {isPendingReply && (
                                  <span className="flex items-center gap-1 text-amber-600" title="Awaiting your reply">
                                    <Clock className="w-3 h-3" />
                                  </span>
                                )}
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${evColor}`} title="Engagement Value (0=bad, 100=good)">
                                EV: {ev_score >= 0 ? ev_score : 'N/A'}
                              </span>
                              {/* Flag indicator if EV score > threshold */}
                              {ev_score > conv.lcp_flag_threshold && (
                                <span className="ml-2 flex items-center gap-1 text-red-600 font-bold" title="Flagged for review">
                                  <Flag className="w-4 h-4" /> Flagged
                                </span>
                              )}
                              {/* LCP toggle button */}
                              <button
                                className={`ml-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-colors duration-200 shadow-sm
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
                                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : conv.lcp_enabled ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                                {conv.lcp_enabled ? 'LCP On' : 'LCP Off'}
                              </button>
                              {/* Update Delete button */}
                              <button
                                className={`ml-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-colors duration-200 shadow-sm
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
                                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                                Delete
                              </button>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{latestMessage?.subject || 'No subject'}</p>
                            {/* Placeholder for summary */}
                            <p className="text-xs text-gray-500 italic mb-1">Summary: <span className="not-italic text-gray-700">{conv.ai_summary}</span></p>
                            <p className="text-xs text-gray-400">{latestMessage?.timestamp ? new Date(latestMessage.timestamp).toLocaleString() : ''}</p>
                          </div>

                          {/* Body: center third */}
                          <div className="flex-[1.2] flex items-center justify-center min-w-0">
                            <GradientText 
                              text={latestMessage?.body || ''} 
                              isPending={isPendingReply} 
                              messageType={latestMessage?.type}
                            />
                          </div>

                          {/* View Thread: right third, always visible and vertically centered */}
                          <div className="flex flex-col justify-center items-end w-40 pl-2">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleMarkAsRead(conv.conversation_id);
                              }}
                              className="arrow-animate-hover px-3 py-2 text-sm font-medium text-[#0e6537] bg-[#e6f5ec] rounded-lg hover:bg-[#bbf7d0] hover:shadow-lg flex items-center gap-2 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0e6537]/30 group"
                            >
                              <span className="relative flex items-center w-8 h-5 mr-1">
                                <ChevronRight className="arrow-1 absolute left-0 top-0 w-4 h-4 transition-transform" />
                                <ChevronRight className="arrow-2 absolute left-2 top-0 w-4 h-4 transition-transform" />
                                <ChevronRight className="arrow-3 absolute left-4 top-0 w-4 h-4 transition-transform" />
                              </span>
                              <span className="transition-colors duration-200 group-hover:text-[#166534]">View Thread</span>
                            </button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Lead performance metrics section */}
              <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-[#0e6537]/20 shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Lead Performance</h3>
                <p className="text-sm text-gray-600 mb-8">Your conversion metrics for this month</p>

                {/* Performance metrics grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  {/* Conversion rate with circular progress */}
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-3">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="32" stroke="#e5e7eb" strokeWidth="4" fill="none" />
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          stroke="#10b981"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${23.5 * 2.01} 201`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold">23.5%</span>
                        <span className="text-xs text-green-600">+2.1%</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Conversion Rate</p>
                    {/* Trend visualization */}
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-16 h-4 bg-green-100 rounded flex items-end gap-px p-px">
                        <div className="w-1 bg-green-300 h-1"></div>
                        <div className="w-1 bg-green-400 h-2"></div>
                        <div className="w-1 bg-green-500 h-3"></div>
                        <div className="w-1 bg-green-600 h-4"></div>
                      </div>
                    </div>
                  </div>

                  {/* Response time with area chart */}
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-3">
                      <div className="w-full h-12 bg-[#0e6537]/10 rounded-lg flex items-end justify-center overflow-hidden">
                        <svg className="w-full h-full" viewBox="0 0 80 48">
                          <path d="M0,48 L0,35 Q20,25 40,30 T80,20 L80,48 Z" fill="#3b82f6" opacity="0.7" />
                          <path d="M0,35 Q20,25 40,30 T80,20" stroke="#1d4ed8" strokeWidth="2" fill="none" />
                        </svg>
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold">12 min</span>
                        <span className="text-xs text-[#0e6537]">-3 min</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Response Time</p>
                    {/* Trend visualization */}
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-16 h-4 bg-[#0e6537]/10 rounded flex items-end gap-px p-px">
                        <div className="w-1 bg-[#0e6537] h-4"></div>
                        <div className="w-1 bg-[#0e6537] h-3"></div>
                        <div className="w-1 bg-[#0e6537] h-2"></div>
                        <div className="w-1 bg-[#0e6537] h-1"></div>
                      </div>
                    </div>
                  </div>

                  {/* Active leads with bar chart */}
                  <div className="text-center">
                    <div className="flex items-end justify-center gap-1 h-16 mb-3">
                      <div className="w-3 bg-[#0e6537]/20 h-6 rounded-sm"></div>
                      <div className="w-3 bg-[#0e6537]/30 h-8 rounded-sm"></div>
                      <div className="w-3 bg-[#0e6537]/40 h-10 rounded-sm"></div>
                      <div className="w-3 bg-[#0e6537]/50 h-14 rounded-sm"></div>
                      <div className="w-3 bg-[#0e6537]/60 h-16 rounded-sm"></div>
                    </div>
                    <div className="text-center">
                      <span className="text-lg font-bold">47</span>
                      <span className="text-xs text-[#0e6537] block">+12 this week</span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Active Leads</p>
                  </div>
                </div>

                {/* Monthly trend chart */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-700">Monthly Performance Trend</h4>
                  <div className="h-24 flex items-end justify-between gap-2 bg-gray-50 rounded-lg p-4">
                    {[
                      { month: "Jan", conversion: 18, leads: 32 },
                      { month: "Feb", conversion: 20, leads: 38 },
                      { month: "Mar", conversion: 22, leads: 41 },
                      { month: "Apr", conversion: 23.5, leads: 47 },
                    ].map((data, index) => (
                      <div key={index} className="flex flex-col items-center gap-1 flex-1">
                        <div className="flex gap-1">
                          <div
                            className="w-2 bg-[#0e6537] rounded-sm"
                            style={{ height: `${data.conversion * 2}px` }}
                          ></div>
                          <div className="w-2 bg-[#0e6537]/40 rounded-sm" style={{ height: `${data.leads}px` }}></div>
                        </div>
                        <span className="text-xs text-gray-600">{data.month}</span>
                      </div>
                    ))}
                  </div>
                  {/* Chart legend */}
                  <div className="flex justify-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-[#0e6537] rounded"></div>
                      <span className="text-xs text-gray-600">Conversion %</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-[#0e6537]/40 rounded"></div>
                      <span className="text-xs text-gray-600">Active Leads</span>
                    </div>
                  </div>
                </div>

                {/* Quick actions section */}
                <div>
                  <h4 className="font-semibold mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <button className="px-3 py-2 text-sm bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm">
                      Send Follow-ups
                    </button>
                    <button className="px-3 py-2 text-sm bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm">
                      Schedule Showings
                    </button>
                    <button className="px-3 py-2 text-sm bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm">
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom section with lead sources and activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lead sources section */}
              <div className="bg-white p-6 rounded-lg border border-[#0e6537]/20 shadow-sm">
                <h3 className="text-lg font-semibold mb-6">Lead Sources This Week</h3>

                {/* Lead source progress bars */}
                <div className="space-y-4">
                  {[
                    { source: "Website Forms", count: 45, percentage: 75 },
                    { source: "Social Media", count: 28, percentage: 50 },
                    { source: "Referrals", count: 18, percentage: 33 },
                    { source: "Open Houses", count: 12, percentage: 25 },
                  ].map((source, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{source.source}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-[#0e6537] rounded-full"
                            style={{ width: `${source.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{source.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent activity section */}
              <div className="bg-white p-6 rounded-lg border border-[#0e6537]/20 shadow-sm">
                <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>

                {/* Activity timeline */}
                <div className="space-y-4">
                  {[
                    { action: "New lead from website", client: "Michael Rodriguez", time: "5 min ago", type: "new" },
                    { action: "Scheduled showing", client: "Jennifer Chen", time: "1 hour ago", type: "scheduled" },
                    {
                      action: "Sent property recommendations",
                      client: "David Thompson",
                      time: "2 hours ago",
                      type: "sent",
                    },
                    { action: "Lead responded to email", client: "Lisa Park", time: "3 hours ago", type: "response" },
                    { action: "Follow-up call completed", client: "Robert Wilson", time: "4 hours ago", type: "call" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 py-2">
                      {/* Activity type indicator */}
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.type === "new"
                            ? "bg-[#0e6537]"
                            : activity.type === "scheduled"
                              ? "bg-blue-500"
                              : activity.type === "sent"
                                ? "bg-purple-500"
                                : activity.type === "response"
                                  ? "bg-orange-500"
                                  : "bg-gray-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-gray-600">{activity.client}</p>
                      </div>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}

/**
 * Change Log:
 * 5/25/25 - Initial version
 * - Created main dashboard with lead conversion pipeline
 * - Implemented performance metrics and analytics
 * - Added lead sources and activity tracking
 * - Integrated responsive design and interactive components
 */
