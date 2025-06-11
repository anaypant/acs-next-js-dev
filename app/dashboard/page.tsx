/**
 * File: app/dashboard/page.tsx
 * Purpose: Renders the main dashboard with lead conversion pipeline, performance metrics, and activity tracking.
 * Author: Alejo Cagliolo
 * Date: 5/25/25
 * Version: 1.1.0
 */

"use client"
import { Home, Mail, Users, MessageSquare, BarChart3, Settings, Phone, Calendar, PanelLeft, Bell, CheckCircle, XCircle, Flag, Trash2, AlertTriangle, RefreshCw, Clock, ChevronRight, ChevronDown, X, Shield, ShieldOff } from "lucide-react"
import type React from "react"
import { SidebarProvider, AppSidebar, SidebarTrigger, SidebarInset } from "./components/Sidebar"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback, useMemo } from "react"
import { goto404 } from "../utils/error"
import type { Thread, Message, MessageWithResponseId } from "../types/lcp"
import type { Session } from "next-auth"
import LeadFunnel from './components/LeadFunnel'
import LeadReport from './components/LeadReport'
import ConversationProgression from './components/ConversationProgression'
import DeleteConfirmationModal from "./components/DeleteConfirmationModal"
import DashboardStyles from "./components/DashboardStyles"
import ConversationCard from "./components/ConversationCard"
import { useConversations } from "./hooks/useConversations"
import { useDashboardMetrics } from "./hooks/useDashboardMetrics"

// Helper function to get the latest message with a response ID
const getLatestEvaluableMessage = (messages: Message[]): MessageWithResponseId | undefined => {
  if (!messages) return undefined;
  return messages
    .filter((msg): msg is MessageWithResponseId => Boolean(msg.response_id))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
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
  
  const {
    conversations,
    rawThreads,
    loadingConversations,
    updatingLcp,
    updatingRead,
    deletingThread,
    deleteModalOpen,
    threadToDelete,
    fetchThreads,
    handleMarkAsRead,
    handleLcpToggle,
    handleDeleteThread,
    confirmDelete,
    setDeleteModalOpen,
    setThreadToDelete,
  } = useConversations(session, status === 'authenticated', router);

  const [showFunnel, setShowFunnel] = useState(true)
  const [showProgression, setShowProgression] = useState(false)
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week')
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false)

  // New state for lead performance data
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

  // Fetch threads and lead performance data when session is available
  useEffect(() => {
    if (status === 'authenticated') {
      setLoadingLeadPerformance(true); // Set loading true before fetching
      fetchThreads().finally(() => setLoadingLeadPerformance(false));
    }
  }, [status, fetchThreads]);

  const metrics = useDashboardMetrics(rawThreads, timeRange);

  // Time range options
  const timeRangeOptions = [
    { value: 'day', label: 'Last 24 Hours' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'year', label: 'Last 12 Months' }
  ];

  // Check authentication status
  useEffect(() => {
    if (status === "unauthenticated") {
      goto404("401", "No active session found", router)
    }
  }, [status, router])

  // Memoize the refresh function
  const refreshLeadPerformance = useCallback(async () => {
    if (!session?.user?.id) return;
    
    try {
      setRefreshingLeadPerformance(true);
      await fetchThreads();
    } catch (error) {
      console.error('Error refreshing lead performance:', error);
    } finally {
      setRefreshingLeadPerformance(false);
    }
  }, [session?.user?.id, fetchThreads]); // Only recreate if userId changes

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

  // Memoize filter counts
  const filterCounts = useMemo(() => {
    const unread = conversations.filter((c: Thread) => !c.read).length;
    const review = conversations.filter((c: Thread) => c.flag_for_review).length;
    
    const completion = conversations.filter((c: Thread) => {
      const rawThread = rawThreads.find((t: any) => t.thread?.conversation_id === c.conversation_id);
      const messages = rawThread?.messages || [];
      const evMessage = getLatestEvaluableMessage(messages);
      if (!evMessage) return false;

      const ev_score = typeof evMessage.ev_score === 'string' ? parseFloat(evMessage.ev_score) : evMessage.ev_score;
      return ev_score > c.lcp_flag_threshold && !c.flag_for_review;
    }).length;

    return { unread, review, completion };
  }, [conversations, rawThreads]);

  // Memoize filtered conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv: Thread) => {
      // First filter out any spam threads
      if (conv.spam) return false;

      const rawThread = rawThreads.find((t: any) => t.thread?.conversation_id === conv.conversation_id);
      const messages = rawThread?.messages || [];
      const evMessage = getLatestEvaluableMessage(messages);

      const ev_score = evMessage ? (typeof evMessage.ev_score === 'string' ? parseFloat(evMessage.ev_score) : evMessage.ev_score) : -1;
      const isFlaggedForCompletion = ev_score > conv.lcp_flag_threshold;

      if (filters.unread && !conv.read) return true;
      if (filters.review && conv.flag_for_review) return true;
      if (filters.completion && isFlaggedForCompletion && !conv.flag_for_review) return true;
      if (!filters.unread && !filters.review && !filters.completion) return true;
      return false;
    });
  }, [conversations, rawThreads, filters]);

  const recentLeads = useMemo(() => {
    const now = new Date();
    const timeRanges = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000,
    };
    const timeLimit = now.getTime() - (timeRanges[timeRange] || timeRanges.week);

    console.log('Filtering leads for time range:', timeRange, 'Time limit:', new Date(timeLimit));
    const filtered = rawThreads.filter((thread: any) => {
      const firstMessage = thread.messages?.[0];
      if (!firstMessage) {
        console.log('No messages found for thread:', thread.thread?.conversation_id);
        return false;
      }
      const messageDate = new Date(firstMessage.timestamp);
      const isInRange = messageDate.getTime() >= timeLimit;
      console.log('Thread:', thread.thread?.conversation_id, 'Date:', messageDate, 'In range:', isInRange);
      return isInRange;
    });
    console.log('Filtered leads count:', filtered.length);
    return filtered;
  }, [rawThreads, timeRange]);

  const averageEvScore = useMemo(() => {
    if (recentLeads.length === 0) return 0;
    
    const threadsWithScores = recentLeads.map((thread: any) => {
      const messages = thread.messages || [];
      // Get the most recent message with any EV score
      const evMessage = messages
        .sort((a: Message, b: Message) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // Sort by newest first
        .find((msg: Message) => {
          const score = typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score;
          console.log('Message EV score:', msg.ev_score, 'Parsed:', score, 'Thread:', thread.thread?.conversation_id);
          return score !== undefined && score !== null && !isNaN(score);
        });

      if (!evMessage) {
        console.log('No EV score found for thread:', thread.thread?.conversation_id);
        return null;
      }
      const score = typeof evMessage.ev_score === 'string' ? parseFloat(evMessage.ev_score) : evMessage.ev_score;
      console.log('Found EV score:', score, 'for thread:', thread.thread?.conversation_id);
      return score;
    }).filter((score): score is number => score !== null);

    console.log('Threads with scores:', threadsWithScores);
    if (threadsWithScores.length === 0) return 0;

    const totalEv = threadsWithScores.reduce((sum, score) => sum + score, 0);
    const average = Math.round(totalEv / threadsWithScores.length);
    console.log('Final average EV score:', average);
    return average;
  }, [recentLeads]);

  const conversionRate = useMemo(() => {
    if (recentLeads.length === 0) return 0;

    const flaggedLeads = recentLeads.filter((thread: any) => {
      const messages = thread.messages || [];
      const evMessage = messages
        .sort((a: Message, b: Message) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .find((msg: Message) => {
          const score = typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score;
          return typeof score === 'number' && !isNaN(score) && score >= 0 && score <= 100;
        });

      const evScore = evMessage ? (typeof evMessage.ev_score === 'string' ? parseFloat(evMessage.ev_score) : evMessage.ev_score) : 0;
      return evScore > (thread.thread?.lcp_flag_threshold || 70);
    });

    return Math.round((flaggedLeads.length / recentLeads.length) * 100);
  }, [recentLeads]);

  const avgTimeToConvert = useMemo(() => {
    const conversionTimes = recentLeads.map((thread: any) => {
      const messages = thread.messages || [];
      const firstMessage = messages[0];
      const evMessage = messages
        .sort((a: Message, b: Message) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .find((msg: Message) => {
          const score = typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score;
          return typeof score === 'number' && !isNaN(score) && score > (thread.thread?.lcp_flag_threshold || 70);
        });

      if (!firstMessage || !evMessage) return null;
      const startTime = new Date(firstMessage.timestamp);
      const endTime = new Date(evMessage.timestamp);
      return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // Convert to hours
    }).filter((time): time is number => time !== null);

    if (conversionTimes.length === 0) return 'N/A';
    const avgHours = conversionTimes.reduce((sum, time) => sum + time, 0) / conversionTimes.length;
    return avgHours < 24 
      ? `${Math.round(avgHours)}h`
      : `${Math.round(avgHours / 24)}d`;
  }, [recentLeads]);

  return (
    <>
      <DashboardStyles />
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
              <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-2">Welcome, {session?.user?.name || 'User'}</h1>
              <p className="text-white text-sm sm:text-base">Ready to convert more leads today?</p>
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
                              {filterCounts.unread}
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
                              {filterCounts.review}
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
                              {filterCounts.completion}
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
                        onClick={() => fetchThreads()}
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
                    ) : filteredConversations.length === 0 ? (
                      <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-gray-600">
                        {Object.values(filters).some(Boolean) 
                          ? "No conversations match the selected filters."
                          : "No conversations found."}
                      </div>
                    ) : (
                      filteredConversations.map((conv: Thread) => {
                        const rawThread = rawThreads.find((t: any) => t.thread?.conversation_id === conv.conversation_id);
                        return (
                          <ConversationCard
                            key={conv.conversation_id}
                            conv={conv}
                            rawThread={rawThread}
                            updatingRead={updatingRead}
                            updatingLcp={updatingLcp}
                            deletingThread={deletingThread}
                            handleMarkAsRead={handleMarkAsRead}
                            handleLcpToggle={handleLcpToggle}
                            handleDeleteThread={handleDeleteThread}
                          />
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
                    leadData={rawThreads} 
                    loading={loadingLeadPerformance} 
                    timeRange={timeRange}
                    onRefresh={refreshLeadPerformance}
                  />
                ) : showProgression ? (
                  <ConversationProgression 
                    leadData={rawThreads} 
                    loading={loadingLeadPerformance} 
                    timeRange={timeRange}
                    onRefresh={refreshLeadPerformance}
                  />
                ) : (
                  <LeadReport 
                    userId={session?.user?.id} 
                    leadData={rawThreads} 
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
                      <span className="text-xs text-gray-500">{getTimeRangeText()}</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-[#0e6537]">
                        {averageEvScore}
                      </span>
                      <span className="text-sm text-gray-600">/ 100</span>
                    </div>
                  </div>

                  {/* Conversion Rate */}
                  <div className="bg-[#0e6537]/5 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">Conversion Rate</h4>
                      <span className="text-xs text-gray-500">{getTimeRangeText()}</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-[#0e6537]">
                        {conversionRate}%
                      </span>
                      <span className="text-sm text-gray-600">of leads flagged</span>
                    </div>
                  </div>

                  {/* Average Time to Convert */}
                  <div className="bg-[#0e6537]/5 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">Avg. Time to Convert</h4>
                      <span className="text-xs text-gray-500">{getTimeRangeText()}</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-[#0e6537]">
                        {avgTimeToConvert}
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
 * 5/26/25 - Refactor 1.1.0
 * - Extracted components: DeleteConfirmationModal, DashboardStyles, ConversationCard
 * - Extracted hooks: useConversations, useDashboardMetrics
 * - Simplified Page component to act as a container
 * - Centralized type definitions
 */
