/**
 * File: app/dashboard/page.tsx
 * Purpose: Renders the main dashboard with lead conversion pipeline, performance metrics, and activity tracking.
 * Author: Alejo Cagliolo
 * Date: 06/11/25
 * Version: 1.3.0
 */

"use client"
import { MessageSquare, RefreshCw, CheckCircle, Flag, Shield, ChevronDown, Menu, X } from "lucide-react"
import React, { useEffect, useMemo, Suspense } from "react"
import { SidebarProvider, AppSidebar, SidebarInset } from "./components/Sidebar"
import { useSidebar } from "./components/Sidebar"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import type { Thread, Message, TimeRange } from "@/app/types/lcp"
import LeadFunnel from './components/LeadFunnel'
import LeadReport from './components/LeadReport'
import ConversationProgression from './components/ConversationProgression'
import DeleteConfirmationModal from "./components/DeleteConfirmationModal"
import ConversationCard from "./components/ConversationCard"
import { useDashboard } from "./lib/dashboard-client"
import LoadingSpinner from './components/LoadingSpinner'
import { SidebarTrigger } from "./components/Sidebar"
import { isThreadCompleted } from "./lib/dashboard-utils"
import { Logo } from "@/app/utils/Logo"
import { motion, AnimatePresence } from "framer-motion"

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

// Additional type definitions that don't conflict with existing types
interface Metrics {
  newLeads: number;
  pendingReplies: number;
  unopenedLeads: number;
}

interface Filters {
  unread: boolean;
  review: boolean;
  completion: boolean;
}

// Simple error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-red-800 font-semibold mb-2">Something went wrong:</h2>
          <pre className="text-red-600 text-sm mb-4">{this.state.error?.message}</pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="relative flex flex-col items-center">
        <span className="sr-only">Loading...</span>
        
        {/* Animated logo/icon */}
        <div className="relative mb-8">
          {/* Outer glow */}
          <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-r from-[#0e6537] via-[#157a42] to-[#0a5a2f] opacity-30 animate-ping" />
          
          {/* Main icon container */}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#0e6537] via-[#157a42] to-[#0a5a2f] flex items-center justify-center shadow-xl">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
          
          {/* Floating accent dots */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#0e6537] rounded-full opacity-60 animate-pulse" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#157a42] rounded-full opacity-40 animate-pulse" style={{ animationDelay: '500ms' }} />
        </div>
        
        {/* Loading text */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#0e6537] via-[#157a42] to-[#0a5a2f] bg-clip-text text-transparent mb-2">
            Loading Dashboard
          </h2>
          <p className="text-gray-600 font-medium">
            Gathering your analytics and insights...
          </p>
        </div>
        
        {/* Animated progress indicator */}
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-[#0e6537] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-[#157a42] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-[#0a5a2f] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-br from-[#0e6537]/10 to-transparent rounded-full blur-xl" />
          <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-gradient-to-tl from-[#157a42]/10 to-transparent rounded-full blur-xl" />
        </div>
      </div>
    </div>
  );
}

// Main dashboard component
function DashboardContent() {
  const {
    session,
    status,
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

  const router = useRouter();
  const [isMobile, setIsMobile] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { isOpen, toggle } = useSidebar ? useSidebar() : { isOpen: true, toggle: () => {} };
  const mtd = React.useRef(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id || mtd.current) return;

    // Call once after mount
    loadThreads();
    mtd.current = true;

    // Set up 5-minute interval
    const interval = setInterval(() => {
      loadThreads();
    }, 5 * 60 * 1000);

    // Clean up on unmount
    return () => clearInterval(interval);
  }, [status, session?.user?.id, loadThreads]);

  // Optimize useEffect for visibility change
  useEffect(() => {
    let idleTimeoutId: NodeJS.Timeout;
    let isIdle = false;
    let lastVisibilityChange = Date.now();

    const handleVisibility = () => {
      const now = Date.now();
      lastVisibilityChange = now;

      if (document.visibilityState === "visible") {
        // Only refresh if we were in idle state
        if (isIdle) {
          loadThreads();
          isIdle = false;
        }
      } else {
        // When visibility changes to hidden, start idle timer
        clearTimeout(idleTimeoutId);
        idleTimeoutId = setTimeout(() => {
          isIdle = true;
        }, 15 * 60 * 1000); // 15 minutes
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      clearTimeout(idleTimeoutId);
    };
  }, [loadThreads]);

  // Add CSS for animations and effects
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Mobile-specific styles */
      @media (max-width: 767px) {
        /* Prevent horizontal scrolling */
        body, html {
          overflow-x: hidden;
          width: 100%;
        }
        
        /* Ensure proper touch targets */
        button, a {
          min-height: 44px;
          min-width: 44px;
        }
        
        /* Improve scrolling on mobile */
        .mobile-scroll {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
        
        /* Better tap highlights */
        * {
          -webkit-tap-highlight-color: rgba(14, 101, 55, 0.1);
        }
        
        /* Prevent zoom on input focus */
        input, select, textarea {
          font-size: 16px;
        }
        
        /* Ensure buttons stack properly on mobile */
        .flex-col > * {
          width: 100%;
        }
        
        /* Better spacing for mobile buttons */
        .gap-2 > * {
          margin-bottom: 0.5rem;
        }
        
        .gap-2 > *:last-child {
          margin-bottom: 0;
        }
        
        /* Mobile menu dropdown max width */
        .mobile-menu-dropdown {
          max-width: 100vw;
          width: 100%;
        }
        
        /* Ensure mobile header is always visible */
        .mobile-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
      }

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

  // Optimize filter counts calculation
  const filterCounts = useMemo(() => {
    const counts = {
      unread: 0,
      review: 0,
      completion: 0
    };

    for (const thread of conversations) {
      if (thread.spam) continue;
      
      if (!thread.read) counts.unread++;
      if (thread.flag_for_review) counts.review++;
      
      const evMessage = getLatestEvaluableMessage(thread.messages);
      const ev_score = typeof evMessage?.ev_score === 'string' 
        ? parseFloat(evMessage.ev_score) 
        : evMessage?.ev_score ?? 0;
      
      if (ev_score > (thread.lcp_flag_threshold ?? 70) && !thread.flag_for_review) {
        counts.completion++;
      }
    }

    return counts;
  }, [conversations]);

  // Memoize filtered leads based on time range and exclude completed threads
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
      if (isThreadCompleted(thread.completed)) return false;
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

  // Add event listeners for LeadReport quick actions
  React.useEffect(() => {
    function handleTrackJourney() {
      setShowFunnel(true);
      setShowProgression(false);
      // Scroll to lead performance section
      const section = document.querySelector(".lg\\:col-span-2");
      if (section) section.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    function handleGenerateReport() {
      setShowFunnel(false);
      setShowProgression(false);
      // Scroll to lead performance section
      const section = document.querySelector(".lg\\:col-span-2");
      if (section) section.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    window.addEventListener("leadreport:track-journey", handleTrackJourney);
    window.addEventListener("leadreport:generate-report", handleGenerateReport);
    return () => {
      window.removeEventListener("leadreport:track-journey", handleTrackJourney);
      window.removeEventListener("leadreport:generate-report", handleGenerateReport);
    };
  }, [setShowFunnel, setShowProgression]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        {/* Desktop Sidebar - only show on desktop */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        
        <SidebarInset>
          {/* Add DeleteConfirmationModal */}
          <DeleteConfirmationModal
            isOpen={deleteModalOpen}
            onClose={() => {
              setDeleteModalOpen(false);
              setThreadToDelete(null);
            }}
            onConfirm={() => threadToDelete && confirmDelete()}
            conversationName={threadToDelete ? conversations.find(c => c.conversation_id === threadToDelete)?.source_name || 'Unknown' : 'Unknown'}
            isDeleting={deletingThread !== null}
          />

          {/* Mobile Header with ACS Logo and Hamburger Menu */}
          <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#0a5a2f] via-[#0e6537] to-[#157a42] border-b border-white/10">
            <div className="flex items-center justify-between px-4 py-3">
              {/* ACS Logo */}
              <div className="flex-shrink-0">
                <Logo href="/dashboard" size="md" whiteText />
              </div>

              {/* Mobile menu button */}
              <button
                className="p-2 rounded-md hover:bg-white/10 focus:outline-none transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-white" />
                ) : (
                  <Menu className="h-6 w-6 text-white" />
                )}
              </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="md:hidden bg-gradient-to-b from-[#0a5a2f] via-[#0e6537] to-[#157a42] border-t border-white/10 mobile-menu-dropdown"
                >
                  <div className="px-4 py-3 space-y-1">
                    {/* Navigation Items */}
                    <div className="space-y-1">
                      <a
                        href="/dashboard"
                        className="block px-3 py-3 rounded-md text-base font-medium text-white hover:bg-white/10 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </a>
                      <a
                        href="/dashboard/conversations"
                        className="block px-3 py-3 rounded-md text-base font-medium text-white hover:bg-white/10 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Conversations
                      </a>
                      <a
                        href="/dashboard/history"
                        className="block px-3 py-3 rounded-md text-base font-medium text-white hover:bg-white/10 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        History
                      </a>
                      <a
                        href="/dashboard/resources"
                        className="block px-3 py-3 rounded-md text-base font-medium text-white hover:bg-white/10 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Resources
                      </a>
                      <a
                        href="/dashboard/junk"
                        className="block px-3 py-3 rounded-md text-base font-medium text-white hover:bg-white/10 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Junk
                      </a>
                    </div>

                    {/* User Section */}
                    {session?.user && (
                      <div className="pt-4 border-t border-white/20">
                        <div className="px-3 py-3 bg-white/10 rounded-lg border border-white/20">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-lg flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {session.user.name?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-white font-medium text-sm">{session.user.name || 'User'}</span>
                              <span className="text-white/60 text-xs">{session.user.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Settings and Logout */}
                    <div className="pt-4 border-t border-white/20 space-y-1">
                      <a
                        href="/settings"
                        className="block px-3 py-3 rounded-md text-base font-medium text-white hover:bg-white/10 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Settings
                      </a>
                      <button
                        onClick={async () => {
                          setIsMobileMenuOpen(false);
                          // Clear session_id cookie before signing out
                          if (typeof window !== 'undefined') {
                            document.cookie = 'session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                          }
                          await signOut({ callbackUrl: '/' });
                        }}
                        className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-white hover:bg-white/10 transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Main dashboard content with gradient background */}
          <div className={`flex flex-col gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6 bg-gradient-to-b from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1] mobile-scroll pt-16 md:pt-0`}>
            {/* Welcome section with personalized greeting */}
            <div className="bg-gradient-to-b from-[#0a5a2f] via-[#0e6537] to-[#157a42] p-4 sm:p-6 md:p-8 rounded-lg">
              <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-2">Welcome, {session?.user?.name || 'User'}</h1>
              <p className="text-white text-sm sm:text-base">Ready to convert more leads today?</p>
            </div>

            {/* Lead statistics widgets with mini charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
                  <div className="flex flex-col gap-3">
                    <h3 className="text-base sm:text-lg font-semibold">Recent Conversations</h3>
                    
                    {/* Action buttons and filters */}
                    <div className="flex flex-col gap-3">
                      {/* Mobile filter toggle - always show on mobile, hide on desktop */}
                      <div className="block md:hidden">
                        <button
                          onClick={() => setShowFilters(!showFilters)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          <span>Filters</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                      
                      {/* Desktop filter bar - hide on mobile, show on desktop */}
                      <div className="hidden md:block">
                        <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-sm font-medium text-gray-700">Filters:</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => toggleFilter('unread')}
                              className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                                filters.unread
                                  ? 'bg-[#0e6537] text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              Unread ({filterCounts.unread})
                            </button>
                            <button
                              onClick={() => toggleFilter('review')}
                              className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                                filters.review
                                  ? 'bg-[#0e6537] text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              Review ({filterCounts.review})
                            </button>
                            <button
                              onClick={() => toggleFilter('completion')}
                              className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                                filters.completion
                                  ? 'bg-[#0e6537] text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              Completion ({filterCounts.completion})
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action buttons - responsive layout */}
                      <div className="flex flex-col md:flex-row gap-2">
                        <button
                          className="w-full md:w-auto px-4 py-3 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 text-sm"
                          onClick={() => loadThreads()}
                          disabled={loadingConversations}
                        >
                          <RefreshCw className={`w-4 h-4 ${loadingConversations ? 'animate-spin' : ''}`} />
                          Refresh
                        </button>
                        <button
                          className="w-full md:w-auto px-4 py-3 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm text-sm"
                          onClick={() => (window.location.href = "/dashboard/conversations")}
                        >
                          Load All
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile filter dropdown - always show on mobile when open */}
                  <div className="block md:hidden">
                    {showFilters && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => toggleFilter('unread')}
                            className={`w-full px-4 py-3 text-sm rounded-lg transition-colors text-left ${
                              filters.unread
                                ? 'bg-[#0e6537] text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            Unread ({filterCounts.unread})
                          </button>
                          <button
                            onClick={() => toggleFilter('review')}
                            className={`w-full px-4 py-3 text-sm rounded-lg transition-colors text-left ${
                              filters.review
                                ? 'bg-[#0e6537] text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            Review ({filterCounts.review})
                          </button>
                          <button
                            onClick={() => toggleFilter('completion')}
                            className={`w-full px-4 py-3 text-sm rounded-lg transition-colors text-left ${
                              filters.completion
                                ? 'bg-[#0e6537] text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            Completion ({filterCounts.completion})
                          </button>
                        </div>
                      </div>
                    )}
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
                    ) : !loadingConversations && (
                      <>
                        <div className="flex justify-center pt-4">
                          <button
                            className="w-full md:w-auto px-4 py-3 bg-white border border-[#0e6537]/20 text-[#0e6537] rounded-lg hover:bg-[#0e6537]/5 transition-all duration-200 shadow-sm text-sm flex items-center justify-center gap-2"
                            onClick={() => (window.location.href = "/dashboard/conversations")}
                          >
                            <MessageSquare className="w-4 h-4" />
                            View All Conversations
                          </button>
                        </div>
                        {filteredConversations.slice(0, 5).map((conv: Thread) => (
                          <ConversationCard
                            key={conv.conversation_id}
                            conv={conv}
                            updatingRead={updatingRead}
                            updatingLcp={updatingLcp}
                            deletingThread={deletingThread}
                            handleMarkAsRead={handleMarkAsRead}
                            handleLcpToggle={handleLcpToggle}
                            handleDeleteThread={handleDeleteThread}
                          />
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Lead performance metrics section */}
              <div className="lg:col-span-2">
                <div className="flex flex-col gap-3 mb-3">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold">Lead Performance</h3>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                    <div className="relative w-full md:w-auto">
                      <button
                        onClick={() => setShowTimeRangeDropdown(!showTimeRangeDropdown)}
                        className="w-full md:w-auto flex items-center justify-center gap-1 text-xs sm:text-sm text-gray-600 hover:text-gray-900 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
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
                      className="w-full md:w-auto px-3 py-2 text-sm bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
                      onClick={refreshLeadPerformance}
                      disabled={refreshingLeadPerformance}
                    >
                      <RefreshCw className={`w-4 h-4 ${refreshingLeadPerformance ? 'animate-spin' : ''}`} />
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
              </div>
            </div>

            {/* Bottom section with lead sources and activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {/* Legend section */}
              <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border border-[#0e6537]/20 shadow-sm">
                <div>
                  {/* Header with title and Learn More button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-4 md:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold">Understanding Your Dashboard</h3>
                    <a href="/dashboard/resources" className="px-3 py-1.5 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm text-xs font-medium self-start sm:self-center">Learn More</a>
                  </div>

                  {/* Legend items */}
                  <div className="space-y-4">
                    {/* EV Score */}
                    <div className="flex items-start gap-3 relative">
                      <div className="w-8 h-8 rounded-full bg-[#0e6537]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#0e6537] font-semibold">EV</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 flex items-center">EV Score
                          <span className="ml-2 relative group cursor-pointer">
                            <span className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600">?</span>
                            <span className="absolute z-10 left-1/2 -translate-x-1/2 -top-8 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">Engagement Value score (0-100) indicating the quality and potential of the lead interaction.</span>
                          </span>
                        </h4>
                        <p className="text-sm text-gray-600">Engagement Value score (0-100) indicating the quality and potential of the lead interaction.</p>
                      </div>
                    </div>

                    {/* Review Flag */}
                    <div className="flex items-start gap-3 relative">
                      <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0">
                        <Flag className="w-4 h-4 text-yellow-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 flex items-center">Review Flag
                          <span className="ml-2 relative group cursor-pointer">
                            <span className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600">?</span>
                            <span className="absolute z-10 left-1/2 -translate-x-1/2 -top-8 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">Indicates a conversation that needs human review due to potential issues or high EV score.</span>
                          </span>
                        </h4>
                        <p className="text-sm text-gray-600">Indicates a conversation that needs human review due to potential issues or high EV score.</p>
                      </div>
                    </div>

                    {/* Review Check Toggle */}
                    <div className="flex items-start gap-3 relative">
                      <div className="w-8 h-8 rounded-full bg-[#0e6537]/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-[#0e6537]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 flex items-center">Review Check
                          <span className="ml-2 relative group cursor-pointer">
                            <span className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600">?</span>
                            <span className="absolute z-10 left-1/2 -translate-x-1/2 -top-8 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">When enabled (shield icon), AI will flag conversations for review. When disabled (shield-off icon), AI review checks are bypassed.</span>
                          </span>
                        </h4>
                        <p className="text-sm text-gray-600">When enabled (shield icon), AI will flag conversations for review. When disabled (shield-off icon), AI review checks are bypassed.</p>
                      </div>
                    </div>

                    {/* Completion Status */}
                    <div className="flex items-start gap-3 relative">
                      <div className="w-8 h-8 rounded-full bg-[#0e6537]/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-[#0e6537]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 flex items-center">Completion Status
                          <span className="ml-2 relative group cursor-pointer">
                            <span className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600">?</span>
                            <span className="absolute z-10 left-1/2 -translate-x-1/2 -top-8 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">Shows whether a conversation has been completed or is still in progress.</span>
                          </span>
                        </h4>
                        <p className="text-sm text-gray-600">Shows whether a conversation has been completed or is still in progress.</p>
                      </div>
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
  );
}

// Export the wrapped dashboard component
export default function Dashboard() {
  return (
    <ErrorBoundary fallback={
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-red-800 font-semibold mb-2">Something went wrong</h2>
        <p className="text-red-600 text-sm mb-4">Please try refreshing the page</p>
      </div>
    }>
      <Suspense fallback={<LoadingFallback />}>
        <DashboardContent />
      </Suspense>
    </ErrorBoundary>
  );
}

// Add error handling for API calls
async function safeApiCall<T>(apiCall: () => Promise<T>): Promise<{ data?: T; error?: string }> {
  try {
    const data = await apiCall();
    return { data };
  } catch (error) {
    console.error('API call failed:', error);
    return { 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}

/**
 * Change Log:
 * 06/11/25 - Version 1.3.0
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