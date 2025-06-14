/**
 * File: app/dashboard/page.tsx
 * Purpose: Renders the main dashboard with lead conversion pipeline, performance metrics, and activity tracking.
 * Author: Alejo Cagliolo
 * Date: 06/11/25
 * Version: 1.1.1
 */

"use client"
import { Home, Mail, Users, MessageSquare, BarChart3, Settings, Phone, Calendar, PanelLeft, Bell, CheckCircle, XCircle, Flag, Trash2, AlertTriangle, RefreshCw, Clock, ChevronRight, ChevronDown, X, Shield, ShieldOff } from "lucide-react"
import type React from "react"
import { SidebarProvider, AppSidebar, SidebarTrigger, SidebarInset, Logo } from "./components/Sidebar"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback, useMemo } from "react"
import { goto404 } from "../utils/error"
import type { Thread, Message, MessageWithResponseId, TimeRange } from "@/app/types/lcp"
import type { Session } from "next-auth"
import LeadFunnel from './components/LeadFunnel'
import LeadReport from './components/LeadReport'
import ConversationProgression from './components/ConversationProgression'
import DeleteConfirmationModal from "./components/DeleteConfirmationModal"
import ConversationCard from "./components/ConversationCard"
import { useDashboard } from "./lib/dashboard-client"

// Time range options
const timeRangeOptions = [
  { value: 'day' as const, label: 'Last 24 Hours' },
  { value: 'week' as const, label: 'Last 7 Days' },
  { value: 'month' as const, label: 'Last 30 Days' },
  { value: 'year' as const, label: 'Last 12 Months' }
] as const;

// Helper function to get time range text
const getTimeRangeText = (range: TimeRange): string => {
  switch (range) {
    case 'day': return 'Last 24 Hours';
    case 'week': return 'Last 7 Days';
    case 'month': return 'Last 30 Days';
    case 'year': return 'Last 12 Months';
    default: return 'Last 24 Hours';
  }
};

// Helper function to get the latest message with a valid ev_score
const getLatestEvaluableMessage = (messages: Message[]): Message | undefined => {
  if (!messages?.length) return undefined;
  return [...messages]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .find(msg => {
      let score = msg.ev_score;
      if (typeof score === 'string') score = parseFloat(score);
      return Number.isFinite(score);
    });
};

interface LeadPerformanceData {
  timestamp: string;
  score?: number;
  messages?: Array<{
    ev_score?: number | string;
    timestamp: string;
  }>;
}

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
  const {
    session,
    conversations,
    loadingConversations,
    updatingLcp,
    updatingRead,
    deletingThread,
    deleteModalOpen,
    threadToDelete,
    showFunnel,
    showProgression,
    timeRange,
    showTimeRangeDropdown,
    leadPerformanceData,
    loadingLeadPerformance,
    refreshingLeadPerformance,
    filters,
    metrics,
    filteredConversations,
    setDeleteModalOpen,
    setThreadToDelete,
    setShowFunnel,
    setShowProgression,
    setTimeRange,
    setShowTimeRangeDropdown,
    toggleFilter,
    loadThreads,
    handleMarkAsRead,
    handleLcpToggle,
    handleDeleteThread,
    confirmDelete,
    refreshLeadPerformance,
  } = useDashboard();

  const [mounted, setMounted] = useState(false);

  // Handle mounting state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Add CSS for animations and effects
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Icon Animation */
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

      /* Triple Arrow Animation */
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

      /* Flagged Glow Effects */
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

      /* Pulsating effect for busy cards */
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

  // Memoize filter counts (should match the filteredConversations logic and exclude spam/junk)
  const filterCounts = useMemo(() => {
    const getCount = (filterKey: keyof typeof filters) => {
      return conversations.filter((c: Thread) => {
        if (c.spam) return false; // Exclude junk
        if (filterKey === 'unread') return !c.read;
        if (filterKey === 'review') return c.flag_for_review;
        if (filterKey === 'completion') {
          const evMessage = getLatestEvaluableMessage(c.messages);
          const ev_score = evMessage?.ev_score ?? 0;
          return ev_score > (c.lcp_flag_threshold ?? 70) && !c.flag_for_review;
        }
        return false;
      }).length;
    };
    return {
      unread: getCount('unread'),
      review: getCount('review'),
      completion: getCount('completion'),
    };
  }, [conversations, filters]);

  // Memoize filtered leads based on time range
  const filteredLeads = useMemo(() => {
    const now = new Date();
    const timeRanges = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000,
    };
    const timeLimit = now.getTime() - (timeRanges[timeRange as TimeRange] || timeRanges.week);
    return conversations.filter(thread => {
      const messages = thread.messages || [];
      const latestMsg = messages[0];
      if (!latestMsg) return false;
      const messageDate = new Date(latestMsg.timestamp);
      return messageDate.getTime() >= timeLimit;
    });
  }, [conversations, timeRange]);

  // Calculate average EV score
  const averageEvScore = useMemo(() => {
    if (filteredLeads.length === 0) return 0;
    const validScores = filteredLeads
      .map(thread => {
        const evMsg = getLatestEvaluableMessage(thread.messages || []);
        let score = evMsg?.ev_score;
        if (typeof score === 'string') score = parseFloat(score);
        return Number.isFinite(score) ? score : null;
      })
      .filter((score): score is number => score !== null);
    if (validScores.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('No valid EV scores found in filteredLeads:', filteredLeads);
      }
      return 0;
    }
    if (process.env.NODE_ENV === 'development') {
      const invalidThreads = filteredLeads.filter(thread => {
        const evMsg = getLatestEvaluableMessage(thread.messages || []);
        let score = evMsg?.ev_score;
        if (typeof score === 'string') score = parseFloat(score);
        return !Number.isFinite(score);
      });
      if (invalidThreads.length > 0) {
        console.warn('Invalid EV scores found:', invalidThreads);
      }
    }
    console.log(validScores);
    const totalEv = validScores.reduce((sum, score) => sum + score, 0);
    return Math.round(totalEv / validScores.length);
  }, [filteredLeads]);

  // Calculate conversion rate
  const conversionRate = useMemo(() => {
    if (filteredLeads.length === 0) return 0;
    const validThreads = filteredLeads.filter(thread => {
      const evMsg = getLatestEvaluableMessage(thread.messages || []);
      let score = evMsg?.ev_score;
      if (typeof score === 'string') score = parseFloat(score);
      return Number.isFinite(score);
    });
    if (validThreads.length === 0) return 0;
    const flaggedLeads = validThreads.filter(thread => {
      const evMsg = getLatestEvaluableMessage(thread.messages || []);
      let score = evMsg?.ev_score;
      if (typeof score === 'string') score = parseFloat(score);
      if (!Number.isFinite(score) || typeof score === 'undefined') score = 0;
      return score >= 70;
    });
    return Math.round((flaggedLeads.length / validThreads.length) * 100);
  }, [filteredLeads]);

  // Calculate average time to convert
  const avgTimeToConvert = useMemo(() => {
    const conversionTimes = filteredLeads
      .map(thread => {
        const evMsg = getLatestEvaluableMessage(thread.messages || []);
        let score = evMsg?.ev_score;
        if (typeof score === 'string') score = parseFloat(score);
        if (!Number.isFinite(score) || typeof score === 'undefined') score = 0;
        if (score < 70) return null;
        const messages = thread.messages || [];
        const firstMsg = messages[messages.length - 1];
        const lastMsg = messages[0];
        const startTime = new Date(firstMsg?.timestamp);
        const endTime = new Date(lastMsg?.timestamp);
        const diff = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // hours
        if (!Number.isFinite(diff)) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Invalid time difference for thread:', thread, 'start:', firstMsg?.timestamp, 'end:', lastMsg?.timestamp);
          }
          return null;
        }
        return diff;
      })
      .filter((time): time is number => time !== null);

    if (conversionTimes.length === 0) return 'N/A';
    const avgHours = conversionTimes.reduce((sum, time) => sum + time, 0) / conversionTimes.length;
    return avgHours < 24 
      ? `${Math.round(avgHours)}h`
      : `${Math.round(avgHours / 24)}d`;
  }, [filteredLeads]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Header with navigation and title */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#0e6537]/20 px-4 bg-gradient-to-r from-[#e6f5ec] to-[#f0f9f4]">
            <div className="flex items-center gap-2">
              {/* Logo removed */}
            </div>
            <SidebarTrigger />
          </header>

          {/* Add DeleteConfirmationModal */}
          <DeleteConfirmationModal
            isOpen={deleteModalOpen}
            onClose={() => {
              setDeleteModalOpen(false);
              setThreadToDelete(null);
            }}
            onConfirm={() => threadToDelete && confirmDelete(threadToDelete)}
            conversationName={threadToDelete?.name || 'Unknown'}
            isDeleting={deletingThread !== null}
          />

          {/* Main dashboard content with gradient background */}
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6 bg-gradient-to-b from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1]">
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
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => toggleFilter('unread')}
                            className={`px-2 py-1 text-xs sm:text-sm rounded-lg transition-colors ${
                              filters.unread
                                ? 'bg-[#0e6537] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            Unread ({filterCounts.unread})
                          </button>
                          <button
                            onClick={() => toggleFilter('review')}
                            className={`px-2 py-1 text-xs sm:text-sm rounded-lg transition-colors ${
                              filters.review
                                ? 'bg-[#0e6537] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            Review ({filterCounts.review})
                          </button>
                          <button
                            onClick={() => toggleFilter('completion')}
                            className={`px-2 py-1 text-xs sm:text-sm rounded-lg transition-colors ${
                              filters.completion
                                ? 'bg-[#0e6537] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            Completion ({filterCounts.completion})
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm flex items-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base"
                          onClick={() => loadThreads()}
                          disabled={loadingConversations}
                        >
                          <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${loadingConversations ? 'animate-spin' : ''}`} />
                          Refresh
                        </button>
                      </div>
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

                        <div className="flex justify-center pt-4">
                          <button
                            className="px-4 py-2 bg-white border border-[#0e6537]/20 text-[#0e6537] rounded-lg hover:bg-[#0e6537]/5 transition-all duration-200 shadow-sm text-sm flex items-center gap-2"
                            onClick={() => (window.location.href = "/dashboard/conversations")}
                          >
                            <MessageSquare className="w-4 h-4" />
                            View All Conversations
                          </button>
                        </div>
                      </>

                      filteredConversations.slice(0, 5).map((conv: Thread) => {
                        // Find the original thread data from the conversations array
                        const rawThread = conversations.find((t: Thread) => t.conversation_id === conv.conversation_id);
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
                        className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 hover:text-gray-900"
                      >
                        {getTimeRangeText(timeRange)}
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {showTimeRangeDropdown && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          {timeRangeOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setTimeRange(option.value);
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
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 md:mb-8">Your conversion metrics for {getTimeRangeText(timeRange).toLowerCase()}</p>

                {/* Conditionally render Funnel or Report */}
                {showFunnel ? (
                  <LeadFunnel 
                    userId={session?.user?.id} 
                    leadData={filteredConversations.map(thread => ({ thread, messages: thread.messages }))} 
                    loading={loadingLeadPerformance} 
                    timeRange={timeRange}
                    onRefresh={refreshLeadPerformance}
                  />
                ) : showProgression ? (
                  <ConversationProgression 
                    leadData={filteredConversations.map(thread => ({ thread, messages: thread.messages }))} 
                    loading={loadingLeadPerformance} 
                    timeRange={timeRange}
                    onRefresh={refreshLeadPerformance}
                  />
                ) : (
                  <LeadReport 
                    userId={session?.user?.id} 
                    leadData={filteredConversations.map(thread => ({ thread, messages: thread.messages }))} 
                    loading={loadingLeadPerformance} 
                    timeRange={timeRange}
                    onRefresh={refreshLeadPerformance}
                  />
                )}

                {/* Quick actions section */}
                <div className="mt-3 sm:mt-4 md:mt-6">
                  <h4 className="font-semibold mb-2 sm:mb-3">Quick Actions</h4>
                  <div className="flex gap-2">
                    {[
                      {
                        id: 'track-lead-journey',
                        label: 'Track Lead Journey',
                        onClick: () => {
                          setShowFunnel(true);
                          setShowProgression(false);
                        },
                        className: "px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm text-xs sm:text-sm md:text-base"
                      },
                      {
                        id: 'generate-report',
                        label: 'Generate Report',
                        onClick: () => {
                          setShowFunnel(false);
                          setShowProgression(false);
                        },
                        className: "px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm text-xs sm:text-sm md:text-base"
                      }
                    ].map(action => (
                      <button
                        key={action.id}
                        className={action.className}
                        onClick={action.onClick}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom section with lead sources and activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {/* Legend section */}
              <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-[#0e6537]/20 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 md:mb-6">Understanding Your Dashboard</h3>

                {/* Legend items */}
                <div className="space-y-4">
                  {/* EV Score */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0e6537]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#0e6537] font-semibold">EV</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">EV Score</h4>
                      <p className="text-sm text-gray-600">Engagement Value score (0-100) indicating the quality and potential of the lead interaction.</p>
                    </div>
                  </div>

                  {/* Review Flag */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0">
                      <Flag className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Review Flag</h4>
                      <p className="text-sm text-gray-600">Indicates a conversation that needs human review due to potential issues or high EV score.</p>
                    </div>
                  </div>

                  {/* Review Check Toggle */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0e6537]/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-[#0e6537]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Review Check</h4>
                      <p className="text-sm text-gray-600">When enabled (shield icon), AI will flag conversations for review. When disabled (shield-off icon), AI review checks are bypassed.</p>
                    </div>
                  </div>

                  {/* Completion Status */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0e6537]/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-[#0e6537]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Completion Status</h4>
                      <p className="text-sm text-gray-600">Shows whether a conversation has been completed or is still in progress.</p>
                    </div>
                  </div>
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
                      <span className="text-xs text-gray-500">{getTimeRangeText(timeRange)}</span>
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
                      <span className="text-xs text-gray-500">{getTimeRangeText(timeRange)}</span>
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
                      <span className="text-xs text-gray-500">{getTimeRangeText(timeRange)}</span>
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
    </div>
  )
}

/**
 * Change Log:
 * 06/11/25 - Version 1.1.1
 * - Enhanced mobile responsiveness
 * - Improved filter functionality
 * - Updated documentation format
 * - Added detailed feature descriptions
 * 
 * 5/26/25 - Version 1.1.0
 * - Extracted components: DeleteConfirmationModal, DashboardStyles, ConversationCard
 * - Extracted hooks: useConversations, useDashboardMetrics
 * - Simplified Page component to act as a container
 * - Centralized type definitions
 * 
 * 5/25/25 - Version 1.0.0
 * - Created main dashboard with lead conversion pipeline
 * - Implemented performance metrics and analytics
 * - Added lead sources and activity tracking
 * - Integrated responsive design and interactive components
 */