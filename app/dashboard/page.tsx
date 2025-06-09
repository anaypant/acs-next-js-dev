/**
 * File: app/dashboard/page.tsx
 * Purpose: Renders the main dashboard with lead conversion pipeline, performance metrics, and activity tracking.
 * Author: Alejo Cagliolo
 * Date: 5/25/25
 * Version: 1.0.0
 */

"use client"
import { Home, Mail, Users, MessageSquare, BarChart3, Settings, Phone, Calendar, PanelLeft, Bell, CheckCircle, XCircle, Flag, Trash2, AlertTriangle, RefreshCw, Clock, ChevronRight, ChevronDown, X, Shield, ShieldOff } from "lucide-react"
import type React from "react"
import { SidebarProvider, AppSidebar, SidebarTrigger, SidebarInset } from "./Sidebar"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { goto404 } from "../utils/error"
import type { Thread, Message } from "../types/lcp"
import type { Session } from "next-auth"
import LeadFunnel from '../components/dashboard/LeadFunnel'
import LeadReport from '../components/dashboard/LeadReport'
import ConversationProgression from '../components/dashboard/ConversationProgression'

// Add Modal component at the top level
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, conversationName, isDeleting }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void;
  conversationName: string;
  isDeleting: boolean;
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
            disabled={isDeleting}
            className={`px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg transition-colors ${
              isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className={`px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg transition-colors flex items-center gap-2 ${
              isDeleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
            }`}
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
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

// Add custom keyframes for flagged glow effects
const FlaggedGlowStyle = () => (
  <style>{`
    @keyframes flagged-review-glow {
      0% { box-shadow: 0 0 5px rgba(234, 179, 8, 0.5), 0 0 10px rgba(234, 179, 8, 0.3); }
      50% { box-shadow: 0 0 10px rgba(234, 179, 8, 0.7), 0 0 20px rgba(234, 179, 8, 0.5); }
      100% { box-shadow: 0 0 5px rgba(234, 179, 8, 0.5), 0 0 10px rgba(234, 179, 8, 0.3); }
    }
    @keyframes flagged-completion-glow {
      0% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.3), 0 0 10px rgba(34, 197, 94, 0.2); }
      50% { box-shadow: 0 0 10px rgba(34, 197, 94, 0.4), 0 0 20px rgba(34, 197, 94, 0.3); }
      100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.3), 0 0 10px rgba(34, 197, 94, 0.2); }
    }
    .flagged-review {
      animation: flagged-review-glow 2s infinite;
      border: 2px solid #eab308;
      background: linear-gradient(to right, rgba(234, 179, 8, 0.05), rgba(234, 179, 8, 0.02));
    }
    .flagged-review:hover {
      background: linear-gradient(to right, rgba(234, 179, 8, 0.08), rgba(234, 179, 8, 0.04));
    }
    .flagged-completion {
      animation: flagged-completion-glow 2s infinite;
      border: 2px solid #22c55e;
      background: linear-gradient(to right, rgba(34, 197, 94, 0.05), rgba(34, 197, 94, 0.02));
    }
    .flagged-completion:hover {
      background: linear-gradient(to right, rgba(34, 197, 94, 0.08), rgba(34, 197, 94, 0.04));
    }
  `}</style>
);

// Update OverrideStatus component to only show icon
const OverrideStatus = ({ isEnabled }: { isEnabled: boolean }) => {
  return (
    <div className="group relative inline-flex items-center p-1.5 bg-gray-50 rounded-lg">
      {isEnabled ? (
        <ShieldOff className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
      ) : (
        <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
      )}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-48">
        {isEnabled ? (
          "AI review checks are disabled for this conversation. The AI will not flag this conversation for review, even if it detects potential issues."
        ) : (
          "AI review checks are enabled. The AI will flag this conversation for review if it detects any uncertainty or issues that need human attention."
        )}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
      </div>
    </div>
  );
};

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
  const [showFunnel, setShowFunnel] = useState(true)
  const [showProgression, setShowProgression] = useState(false)
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week')
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false)

  // New state for lead performance data
  const [leadPerformanceData, setLeadPerformanceData] = useState<any[]>([])
  const [loadingLeadPerformance, setLoadingLeadPerformance] = useState(false)

  // Add new state for lead performance refresh
  const [refreshingLeadPerformance, setRefreshingLeadPerformance] = useState(false)

  // Add new state for filters
  const [filters, setFilters] = useState({
    unread: false,
    review: false,
    completion: false
  });

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
      if (data.success && Array.isArray(data.data)) {
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
            busy: item.thread?.busy === 'true',
            flag_for_review: Boolean(item.thread?.flag_for_review),
          }))
        )
        setRawThreads(sortedData)
         // Also update lead performance data
        setLeadPerformanceData(data.data);
      } else {
        setConversations([])
        setRawThreads([])
        setLeadPerformanceData([]);
      }

      // Log id
      console.log('Session user ID:', session?.user?.id);
    } catch (error) {
      console.error('Error fetching threads:', error);
      setConversations([])
      setRawThreads([])
       setLeadPerformanceData([]);
    } finally {
      setLoadingConversations(false);
       setLoadingLeadPerformance(false); // Set loading to false here as well
    }
  };

  // Fetch threads and lead performance data when session is available
  useEffect(() => {
    if (mounted && session?.user?.id) {
      setLoadingLeadPerformance(true); // Set loading true before fetching
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

  // Function to calculate metrics based on time range
  const calculateMetrics = () => {
    if (!rawThreads.length) return {
      newLeads: 0,
      pendingReplies: 0,
      unopenedLeads: 0
    };

    const now = new Date();
    let startDate = new Date();

    // Set start date based on time range
    switch (timeRange) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const metrics = {
      newLeads: 0,
      pendingReplies: 0,
      unopenedLeads: 0
    };

    rawThreads.forEach((threadData) => {
      const messages = threadData.messages || [];
      const thread = threadData.thread;

      // Sort messages by timestamp descending (newest first)
      const sortedMessages = [...messages].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      const latestMessage = sortedMessages[0];

      // Calculate unopened leads
      if (!thread?.read) {
        metrics.unopenedLeads++;
      }

      // Calculate pending replies (latest message is inbound-email)
      if (latestMessage && latestMessage.type === 'inbound-email') {
        metrics.pendingReplies++;
      }

      // Calculate new leads within time range
      if (latestMessage) {
        const messageDate = new Date(latestMessage.timestamp);
        if (messageDate >= startDate && messageDate <= now) {
          metrics.newLeads++;
        }
      }
    });

    return metrics;
  };

  // Get metrics
  const metrics = calculateMetrics();

  // Time range options
  const timeRangeOptions = [
    { value: 'day', label: 'Last 24 Hours' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'year', label: 'Last 12 Months' }
  ];

  // Check authentication status
  useEffect(() => {
    if (!mounted) return;
    if (status === "unauthenticated") {
      goto404("401", "No active session found", router)
    }
  }, [status, session, router, mounted])

  // Memoize the refresh function
  const refreshLeadPerformance = useCallback(async () => {
    if (!session?.user?.id) return;
    
    try {
      setRefreshingLeadPerformance(true);
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
        throw new Error('Failed to fetch lead performance data');
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setLeadPerformanceData(data.data);
      }
    } catch (error) {
      console.error('Error refreshing lead performance:', error);
    } finally {
      setRefreshingLeadPerformance(false);
    }
  }, [session?.user?.id]); // Only recreate if userId changes

  // Update the time range text based on selection
  const getTimeRangeText = () => {
    switch (timeRange) {
      case 'day':
        return 'Last 24 Hours';
      case 'week':
        return 'Last 7 Days';
      case 'month':
        return 'Last 30 Days';
      case 'year':
        return 'Last 12 Months';
      default:
        return 'Last 24 Hours';
    }
  };

  // Add CSS for pulsating glow effect
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulsate {
        0% { box-shadow: 0 0 0 0 rgba(14, 101, 55, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(14, 101, 55, 0); }
        100% { box-shadow: 0 0 0 0 rgba(14, 101, 55, 0); }
      }
      .thread-busy-card {
        animation: pulsate 2s infinite;
        border: 2px solid #0e6537;
        background-color: rgba(14, 101, 55, 0.05);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Add filter toggle function
  const toggleFilter = (filter: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  // Add filtered conversations function
  const getFilteredConversations = () => {
    return conversations.filter(conv => {
      const messages = rawThreads.find(t => t.thread?.conversation_id === conv.conversation_id)?.messages || [];
      const evMessage = messages
        .filter((msg: any) => {
          const score = typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score;
          return typeof score === 'number' && !isNaN(score) && score >= 0 && score <= 100;
        })
        .reduce((latest: any, msg: any) => {
          if (!latest) return msg;
          return new Date(msg.timestamp) > new Date(latest.timestamp) ? msg : latest;
        }, undefined);

      const ev_score = evMessage ? (typeof evMessage.ev_score === 'string' ? parseFloat(evMessage.ev_score) : evMessage.ev_score) : -1;
      const isFlaggedForCompletion = ev_score > conv.lcp_flag_threshold;

      if (filters.unread && !conv.read) return true;
      if (filters.review && conv.flag_for_review) return true;
      if (filters.completion && isFlaggedForCompletion && !conv.flag_for_review) return true;
      if (!filters.unread && !filters.review && !filters.completion) return true;
      return false;
    });
  };

  return (
    <>
      <IconAnimationStyle />
      <TripleArrowAnimationStyle />
      <FlaggedGlowStyle />
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
            isDeleting={deletingThread !== null}
          />

          {/* Main dashboard content with gradient background */}
          <div className="flex flex-1 flex-col gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6 bg-gradient-to-b from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1] min-h-screen">
            {/* Welcome section with personalized greeting */}
            <div className="bg-gradient-to-b from-[#0a5a2f] via-[#0e6537] to-[#157a42] p-4 sm:p-6 md:p-8 rounded-lg">
              <h1 style={{ color: 'white' }} className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Welcome, {session?.user?.name || 'User'}</h1>
              <p style={{ color: 'white' }} className="text-sm sm:text-base">Ready to convert more leads today?</p>
            </div>

            {/* Lead statistics widgets with mini charts */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {/* New leads widget */}
              <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-[#0e6537]/20 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-700">Lead Statistics</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0e6537]">{metrics.newLeads}</p>
                    <p className="text-xs sm:text-sm text-gray-600">New Leads</p>
                  </div>
                  {/* Mini bar chart visualization */}
                  <div className="w-10 sm:w-12 md:w-16 h-5 sm:h-6 md:h-8 bg-[#0e6537]/10 rounded flex items-end justify-center gap-1 p-1">
                    <div className="w-1 bg-[#0e6537] h-2"></div>
                    <div className="w-1 bg-[#0e6537] h-4"></div>
                    <div className="w-1 bg-[#0e6537] h-3"></div>
                    <div className="w-1 bg-[#0e6537] h-6"></div>
                    <div className="w-1 bg-[#0e6537] h-2"></div>
                  </div>
                </div>
              </div>

              {/* Pending replies widget */}
              <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-[#0e6537]/20 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-700">Response Status</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0e6537]">{metrics.pendingReplies}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Pending Replies</p>
                  </div>
                  {/* Mini bar chart visualization */}
                  <div className="w-10 sm:w-12 md:w-16 h-5 sm:h-6 md:h-8 bg-[#0e6537]/10 rounded flex items-end justify-center gap-1 p-1">
                    <div className="w-1 bg-[#0e6537] h-3"></div>
                    <div className="w-1 bg-[#0e6537] h-5"></div>
                    <div className="w-1 bg-[#0e6537] h-2"></div>
                    <div className="w-1 bg-[#0e6537] h-6"></div>
                    <div className="w-1 bg-[#0e6537] h-4"></div>
                  </div>
                </div>
              </div>

              {/* Unopened leads widget */}
              <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-[#0e6537]/20 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-700">Lead Status</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0e6537]">{metrics.unopenedLeads}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Unopened Leads</p>
                  </div>
                  {/* Mini bar chart visualization */}
                  <div className="w-10 sm:w-12 md:w-16 h-5 sm:h-6 md:h-8 bg-[#0e6537]/10 rounded flex items-end justify-center gap-1 p-1">
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
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {/* Recent conversations section */}
              <div className="lg:col-span-3 bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-[#0e6537]/20 shadow-sm">
                <div className="flex flex-col gap-3 sm:gap-4">
                  {/* Header with title and actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
                    <h3 className="text-base sm:text-lg font-semibold">Recent Conversations</h3>
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-center">
                      {/* Centered filter bar with label */}
                      <div className="flex items-center gap-1 px-3 py-1 bg-gray-50 rounded-lg border border-gray-200 mx-auto">
                        <span className="text-sm font-medium text-gray-700 mr-1">Filters:</span>
                        <button
                          onClick={() => toggleFilter('unread')}
                          className={`p-1.5 rounded-md transition-all duration-200 relative group ${
                            filters.unread 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          title="Show unread messages"
                        >
                          <Bell className="w-4 h-4" />
                          {filters.unread && (
                            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-blue-200 text-blue-700 rounded-full text-xs">
                              {conversations.filter(c => !c.read).length}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => toggleFilter('review')}
                          className={`p-1.5 rounded-md transition-all duration-200 relative group ${
                            filters.review 
                              ? 'bg-yellow-100 text-yellow-700' 
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          title="Show flagged for review"
                        >
                          <Flag className="w-4 h-4" />
                          {filters.review && (
                            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-yellow-200 text-yellow-700 rounded-full text-xs">
                              {conversations.filter(c => c.flag_for_review).length}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => toggleFilter('completion')}
                          className={`p-1.5 rounded-md transition-all duration-200 relative group ${
                            filters.completion 
                              ? 'bg-green-100 text-green-700' 
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          title="Show flagged for completion"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {filters.completion && (
                            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-green-200 text-green-700 rounded-full text-xs">
                              {conversations.filter(c => {
                                const thread = rawThreads.find(t => t.thread?.conversation_id === c.conversation_id);
                                const messages = thread?.messages || [];
                                const evMessage = messages
                                  .filter((msg: any) => {
                                    const score = typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score;
                                    return typeof score === 'number' && !isNaN(score) && score >= 0 && score <= 100;
                                  })
                                  .reduce((latest: any, msg: any) => {
                                    if (!latest) return msg;
                                    return new Date(msg.timestamp) > new Date(latest.timestamp) ? msg : latest;
                                  }, undefined);
                                const ev_score = evMessage ? (typeof evMessage.ev_score === 'string' ? parseFloat(evMessage.ev_score) : evMessage.ev_score) : -1;
                                return ev_score > c.lcp_flag_threshold && !c.flag_for_review;
                              }).length}
                            </span>
                          )}
                        </button>
                        {(filters.unread || filters.review || filters.completion) && (
                          <button
                            onClick={() => setFilters({ unread: false, review: false, completion: false })}
                            className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                            title="Clear all filters"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <button
                        className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
                        onClick={fetchThreads}
                        disabled={loadingConversations}
                      >
                        <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${loadingConversations ? 'animate-spin' : ''}`} />
                        Refresh
                      </button>
                      <button
                        className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm text-xs sm:text-sm md:text-base"
                        onClick={() => (window.location.href = "/dashboard/conversations")}
                      >
                        Load All Conversations
                      </button>
                    </div>
                  </div>

                  {/* Conversations list */}
                  <div className="space-y-2 sm:space-y-3 md:space-y-4 mt-3 sm:mt-4">
                    {loadingConversations ? (
                      <div className="flex items-center justify-center py-6 sm:py-8">
                        <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-[#0e6537]" />
                        <span className="ml-2 text-sm sm:text-base text-gray-600">Loading conversations...</span>
                      </div>
                    ) : getFilteredConversations().length === 0 ? (
                      <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-gray-600">
                        {Object.values(filters).some(Boolean) 
                          ? "No conversations match the selected filters."
                          : "No conversations found."}
                      </div>
                    ) : (
                      getFilteredConversations().map((conv, idx) => {
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

                        // Mark as pending if the latest message is inbound-email
                        const isPendingReply = latestMessage?.type === 'inbound-email';
                        console.log(conv.busy)
                        return (
                          <div
                            key={conv.conversation_id || idx}
                            className={`flex flex-col sm:flex-row items-stretch gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors relative group ${
                              conv.flag_for_review 
                                ? 'flagged-review' 
                                : ev_score > conv.lcp_flag_threshold 
                                  ? 'flagged-completion'
                                  : 'border-[#0e6537]/20'
                            }`}
                            onClick={() => handleMarkAsRead(conv.conversation_id)}
                          >
                            {/* Add flag indicator badges */}
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
                            {/* Avatar and left section */}
                            <div className="flex flex-row sm:flex-col items-center justify-start gap-2 sm:gap-0 sm:w-10 md:w-12 pt-1">
                              {/* Unread alert badge */}
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

                            {/* Main content: left third */}
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
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
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

                            {/* Body: center third */}
                            <div className="flex-[1.2] flex items-center justify-center min-w-0">
                              <GradientText 
                                text={latestMessage?.body || ''} 
                                isPending={isPendingReply} 
                                messageType={latestMessage?.type}
                              />
                            </div>

                            {/* View Thread: right third */}
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
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Lead performance metrics section */}
              <div className="lg:col-span-2 bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-[#0e6537]/20 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold">Lead Performance</h3>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <button
                        onClick={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
                        className="flex items-center gap-1.5 px-2 py-1 text-xs sm:text-sm bg-[#0e6537]/10 text-[#0e6537] rounded-lg hover:bg-[#0e6537]/20 transition-colors"
                      >
                        {timeRangeOptions.find(opt => opt.value === timeRange)?.label}
                        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showTimeRangeDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      {showTimeRangeDropdown && (
                        <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          {timeRangeOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setTimeRange(option.value as 'day' | 'week' | 'month' | 'year');
                                setShowTimeRangeDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs sm:text-sm hover:bg-gray-50 ${
                                timeRange === option.value ? 'bg-[#0e6537]/10 text-[#0e6537]' : 'text-gray-700'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm flex items-center gap-1"
                      onClick={refreshLeadPerformance}
                      disabled={refreshingLeadPerformance}
                    >
                      <RefreshCw className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${refreshingLeadPerformance ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 md:mb-8">Your conversion metrics for {getTimeRangeText().toLowerCase()}</p>

                {/* Conditionally render Funnel or Report */}
                {showFunnel ? (
                  <LeadFunnel 
                    userId={session?.user?.id} 
                    leadData={leadPerformanceData} 
                    loading={loadingLeadPerformance} 
                    timeRange={timeRange}
                    onRefresh={refreshLeadPerformance}
                  />
                ) : showProgression ? (
                  <ConversationProgression 
                    leadData={leadPerformanceData} 
                    loading={loadingLeadPerformance} 
                    timeRange={timeRange}
                    onRefresh={refreshLeadPerformance}
                  />
                ) : (
                  <LeadReport 
                    userId={session?.user?.id} 
                    leadData={leadPerformanceData} 
                    loading={loadingLeadPerformance} 
                    timeRange={timeRange}
                    onRefresh={refreshLeadPerformance}
                  />
                )}

                {/* Quick actions section */}
                <div className="mt-3 sm:mt-4 md:mt-6">
                  <h4 className="font-semibold mb-2 sm:mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm text-xs sm:text-sm md:text-base"
                      onClick={() => {
                        setShowFunnel(true);
                        setShowProgression(false);
                      }}
                    >
                      Track Lead Journey
                    </button>
                    <button
                      className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm"
                      onClick={() => {
                        setShowFunnel(false);
                        setShowProgression(true);
                      }}
                    >
                      Conversation Progression
                    </button>
                    <button
                      className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm"
                      onClick={() => {
                        setShowFunnel(false);
                        setShowProgression(false);
                      }}
                    >
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom section with lead sources and activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {/* Lead sources section */}
              <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-[#0e6537]/20 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 md:mb-6">Lead Sources This Week</h3>

                {/* Lead source progress bars */}
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  {[
                    { source: "Website Forms", count: 45, percentage: 75 },
                    { source: "Social Media", count: 28, percentage: 50 },
                    { source: "Referrals", count: 18, percentage: 33 },
                    { source: "Open Houses", count: 12, percentage: 25 },
                  ].map((source, index) => (
                    <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 sm:gap-2">
                      <span className="text-xs sm:text-sm text-gray-600">{source.source}</span>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="flex-1 sm:w-24 h-1.5 sm:h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-1.5 sm:h-2 bg-[#0e6537] rounded-full"
                            style={{ width: `${source.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs sm:text-sm font-medium">{source.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lead Statistics section */}
              <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-[#0e6537]/20 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 md:mb-6">Lead Statistics</h3>

                {/* Statistics cards */}
                <div className="space-y-4">
                  {/* Average EV Score */}
                  <div className="bg-[#0e6537]/5 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">Average EV Score</h4>
                      <span className="text-xs text-gray-500">Last 7 days</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-[#0e6537]">
                        {(() => {
                          const recentLeads = rawThreads.filter(thread => {
                            const firstMessage = thread.messages?.[0];
                            if (!firstMessage) return false;
                            const messageDate = new Date(firstMessage.timestamp);
                            const weekAgo = new Date();
                            weekAgo.setDate(weekAgo.getDate() - 7);
                            return messageDate >= weekAgo;
                          });

                          const totalEv = recentLeads.reduce((sum, thread) => {
                            const highestEv = thread.messages?.reduce((max: number, msg: Message) => {
                              const ev = typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score;
                              return typeof ev === 'number' && !isNaN(ev) ? Math.max(max, ev) : max;
                            }, -1) || 0;
                            return sum + highestEv;
                          }, 0);

                          return recentLeads.length ? Math.round(totalEv / recentLeads.length) : 0;
                        })()}
                      </span>
                      <span className="text-sm text-gray-600">/ 100</span>
                    </div>
                  </div>

                  {/* Conversion Rate */}
                  <div className="bg-[#0e6537]/5 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">Conversion Rate</h4>
                      <span className="text-xs text-gray-500">Last 7 days</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-[#0e6537]">
                        {(() => {
                          const recentLeads = rawThreads.filter(thread => {
                            const firstMessage = thread.messages?.[0];
                            if (!firstMessage) return false;
                            const messageDate = new Date(firstMessage.timestamp);
                            const weekAgo = new Date();
                            weekAgo.setDate(weekAgo.getDate() - 7);
                            return messageDate >= weekAgo;
                          });

                          const flaggedLeads = recentLeads.filter(thread => {
                            const highestEv = thread.messages?.reduce((max: number, msg: Message) => {
                              const ev = typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score;
                              return typeof ev === 'number' && !isNaN(ev) ? Math.max(max, ev) : max;
                            }, -1) || 0;
                            return highestEv > (thread.thread?.lcp_flag_threshold || 70);
                          });

                          return recentLeads.length ? Math.round((flaggedLeads.length / recentLeads.length) * 100) : 0;
                        })()}%
                      </span>
                      <span className="text-sm text-gray-600">of leads flagged</span>
                    </div>
                  </div>

                  {/* Average Time to Convert */}
                  <div className="bg-[#0e6537]/5 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">Avg. Time to Convert</h4>
                      <span className="text-xs text-gray-500">Last 7 days</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-[#0e6537]">
                        {(() => {
                          const recentLeads = rawThreads.filter(thread => {
                            const firstMessage = thread.messages?.[0];
                            if (!firstMessage) return false;
                            const messageDate = new Date(firstMessage.timestamp);
                            const weekAgo = new Date();
                            weekAgo.setDate(weekAgo.getDate() - 7);
                            return messageDate >= weekAgo;
                          });

                          const conversionTimes = recentLeads.map(thread => {
                            const messages = thread.messages || [];
                            const firstMessage = messages[0];
                            const flaggedMessage = messages.find(msg => {
                              const ev = typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score;
                              return typeof ev === 'number' && !isNaN(ev) && ev > (thread.thread?.lcp_flag_threshold || 70);
                            });

                            if (!firstMessage || !flaggedMessage) return null;
                            const startTime = new Date(firstMessage.timestamp);
                            const endTime = new Date(flaggedMessage.timestamp);
                            return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // Convert to hours
                          }).filter(time => time !== null) as number[];

                          if (conversionTimes.length === 0) return 'N/A';
                          const avgHours = conversionTimes.reduce((sum, time) => sum + time, 0) / conversionTimes.length;
                          return avgHours < 24 
                            ? `${Math.round(avgHours)}h`
                            : `${Math.round(avgHours / 24)}d`;
                        })()}
                      </span>
                      <span className="text-sm text-gray-600">to flag</span>
                    </div>
                  </div>
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
