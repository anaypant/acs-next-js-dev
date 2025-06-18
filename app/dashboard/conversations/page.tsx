/**
 * File: app/dashboard/conversations/page.tsx
 * Purpose: Renders the main conversations dashboard with search, filtering, and conversation list.
 * Author: Alejo Cagliolo
 * Date: 5/25/25
 * Version: 1.0.0
 */

"use client"
import { ArrowLeft, Search, Calendar, Filter, RefreshCw, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import type { Session } from "next-auth"
import type { Thread } from "@/app/types/lcp"
import Slider from '@mui/material/Slider';
import { useRouter } from "next/navigation"
import { useConversationsData } from '../lib/use-conversations';
import { getTimeAgo } from '@/app/utils/timezone';
import { Logo } from "@/app/utils/Logo"

// Add type for message
type Message = {
  timestamp: string;
  body: string;
  ev_score: number | string;
  type: string;
  sender?: string;
};

/**
 * Helper function to calculate conversation status based on EV score
 * @param score - The EV score (0-100)
 * @returns "hot" | "warm" | "cold" based on thresholds
 */
function calculateStatus(score: number): "hot" | "warm" | "cold" {
  if (score >= 80) return "hot"
  if (score >= 60) return "warm"
  return "cold"
}

// getTimeAgo function is now imported from @/app/utils/timezone

type SortField = "aiScore" | "date" | null;
type SortDirection = "asc" | "desc" | null;

type FilterState = {
  status: ("hot" | "warm" | "cold")[];
  aiScoreRange: [number, number];
};

/**
 * Helper function to safely parse boolean values from various formats
 * @param value - The value to parse (can be boolean, string, or any other type)
 * @returns boolean - The parsed boolean value
 */
function parseBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return false;
}

/**
 * ConversationsPage Component
 * Main conversations dashboard component displaying a list of client conversations
 * 
 * Features:
 * - Conversation search and filtering
 * - AI score indicators
 * - Status tracking
 * - Detailed conversation summaries
 * 
 * @returns {JSX.Element} Complete conversations dashboard view
 */
export default function ConversationsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  // Session check - redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0e6537] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: ["hot", "warm", "cold"],
    aiScoreRange: [0, 100],
  });

  const {
    conversations: cachedConversations,
    isLoading: loadingConversations,
    error: conversationsError,
    refreshConversations,
    isStale
  } = useConversationsData();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Refresh conversations if stale
  useEffect(() => {
    if (mounted && status === 'authenticated' && isStale) {
      refreshConversations();
    }
  }, [mounted, status, isStale, refreshConversations]);

  // Helper function to check if a thread is completed
  const isThreadCompleted = (completed: boolean | string | undefined): boolean => {
    if (typeof completed === 'boolean') return completed;
    if (typeof completed === 'string') return completed.toLowerCase() === 'true';
    return false;
  };

  // Filter and sort conversations
  const filteredAndSortedConversations = cachedConversations
    .filter(conv => {
      const thread = conv.thread;
      const messages = conv.messages;
      
      // Filter out completed threads
      if (isThreadCompleted(thread.completed)) return false;
      
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          thread.conversation_id.toLowerCase().includes(searchLower) ||
          messages.some(msg => 
            msg.subject?.toLowerCase().includes(searchLower) ||
            msg.body?.toLowerCase().includes(searchLower)
          );
        if (!matchesSearch) return false;
      }

      // Status filter
      const evMessage = messages.find(msg => {
        const score = typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score;
        return score !== undefined && score !== null && !isNaN(score);
      });
      const evScore = evMessage ? (typeof evMessage.ev_score === 'string' ? parseFloat(evMessage.ev_score) : evMessage.ev_score) : -1;
      const status = calculateStatus(evScore);
      if (!filters.status.includes(status)) return false;

      // AI Score range filter
      if (evScore < filters.aiScoreRange[0] || evScore > filters.aiScoreRange[1]) return false;

      return true;
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      const aMessages = a.messages;
      const bMessages = b.messages;

      if (sortField === 'date') {
        // Use the latest message timestamp for sorting
        const dateA = aMessages.length > 0 ? Math.max(...aMessages.map(m => new Date(m.timestamp).getTime())) : 0;
        const dateB = bMessages.length > 0 ? Math.max(...bMessages.map(m => new Date(m.timestamp).getTime())) : 0;
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }

      if (sortField === 'aiScore') {
        const getScore = (messages: any[]) => {
          const evMessage = messages.find(msg => {
            const score = typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score;
            return score !== undefined && score !== null && !isNaN(score);
          });
          return evMessage ? (typeof evMessage.ev_score === 'string' ? parseFloat(evMessage.ev_score) : evMessage.ev_score) : -1;
        };

        const scoreA = getScore(aMessages);
        const scoreB = getScore(bMessages);
        return sortDirection === 'asc' ? scoreA - scoreB : scoreB - scoreA;
      }

      return 0;
    });

  // Add CSS for pulsating glow effect
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulsate {
        0% { box-shadow: 0 0 0 0 rgba(14, 101, 55, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(14, 101, 55, 0); }
        100% { box-shadow: 0 0 0 0 rgba(14, 101, 55, 0); }
      }
      .thread-busy-row {
        animation: pulsate 2s infinite;
        border-left: 2px solid #0e6537;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Add CSS for mobile responsiveness
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 767px) {
        body, html {
          overflow-x: hidden;
          width: 100%;
        }
        .mobile-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: linear-gradient(90deg, #0a5a2f, #0e6537, #157a42);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .mobile-scroll {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .responsive-table {
          font-size: 13px;
        }
        .responsive-table th, .responsive-table td {
          padding: 0.5rem 0.5rem;
        }
        .responsive-table th {
          font-size: 12px;
        }
        .responsive-table td {
          font-size: 13px;
        }
        .responsive-table .max-w-xs {
          max-width: 120px;
        }
        .responsive-table .p-4 {
          padding: 0.5rem !important;
        }
        .responsive-table .w-8, .responsive-table .h-8 {
          width: 2rem !important;
          height: 2rem !important;
        }
        .responsive-table .w-5, .responsive-table .h-5 {
          width: 1.25rem !important;
          height: 1.25rem !important;
        }
        .responsive-table .w-6, .responsive-table .h-6 {
          width: 1.5rem !important;
          height: 1.5rem !important;
        }
        .responsive-table .w-1.5, .responsive-table .h-1.5 {
          width: 0.375rem !important;
          height: 0.375rem !important;
        }
        .responsive-table .rounded-lg {
          border-radius: 0.5rem !important;
        }
        .responsive-table .rounded-full {
          border-radius: 9999px !important;
        }
        .responsive-table .px-2 {
          padding-left: 0.5rem !important;
          padding-right: 0.5rem !important;
        }
        .responsive-table .py-1 {
          padding-top: 0.25rem !important;
          padding-bottom: 0.25rem !important;
        }
        .responsive-table .text-xs {
          font-size: 12px !important;
        }
        .responsive-table .text-sm {
          font-size: 13px !important;
        }
        .responsive-table .text-base {
          font-size: 15px !important;
        }
        .responsive-table .text-lg {
          font-size: 16px !important;
        }
        .responsive-table .gap-3 {
          gap: 0.5rem !important;
        }
        .responsive-table .gap-2 {
          gap: 0.25rem !important;
        }
        .responsive-table .ml-auto {
          margin-left: auto !important;
        }
        .responsive-table .flex {
          flex-wrap: wrap !important;
        }
        .responsive-table .truncate {
          max-width: 100px !important;
        }
        .responsive-table .whitespace-nowrap {
          white-space: nowrap !important;
        }
        .responsive-table .overflow-x-auto {
          -webkit-overflow-scrolling: touch;
        }
        .responsive-table .cursor-pointer {
          min-height: 44px;
        }
        .responsive-table .p-2, .responsive-table .px-4, .responsive-table .py-2 {
          min-width: 44px;
          min-height: 44px;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a5a2f] via-[#0e6537] to-[#157a42] mobile-scroll">
      <div className="max-w-7xl mx-auto p-3 sm:p-6">
        {/* Header section with logo and navigation */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <Logo size="md" whiteText={true} />
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-[#0e6537]/10 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-2 sm:mt-0">All Conversations</h1>
          <div className="flex-1" />
          <div className="flex flex-row gap-2 mt-2 sm:mt-0">
            {/* Filter dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              {showFilters && (
                <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
                  <div className="space-y-4">
                    {/* Status filters */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                      <div className="space-y-2">
                        {(["hot", "warm", "cold"] as const).map((status) => (
                          <label key={status} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={filters.status.includes(status)}
                              onChange={(e) => {
                                setFilters(prev => ({
                                  ...prev,
                                  status: e.target.checked
                                    ? [...prev.status, status]
                                    : prev.status.filter(s => s !== status)
                                }))
                              }}
                              className="rounded border-gray-300 text-[#0e6537] focus:ring-[#0e6537]"
                            />
                            <span className="text-sm text-gray-600 capitalize">{status}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {/* AI Score range filter */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">AI Score Range</h3>
                      <div className="flex flex-col items-center gap-2 w-full">
                        <Slider
                          value={filters.aiScoreRange}
                          min={0}
                          max={100}
                          onChange={(_, value) => {
                            if (Array.isArray(value) && value.length === 2) {
                              setFilters(prev => ({ ...prev, aiScoreRange: value as [number, number] }))
                            }
                          }}
                          valueLabelDisplay="auto"
                          sx={{ color: '#0e6537' }}
                        />
                        <span className="text-sm text-gray-600 whitespace-nowrap">{filters.aiScoreRange[0]} - {filters.aiScoreRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={refreshConversations}
              disabled={loadingConversations}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <RefreshCw className={`h-5 w-5 text-white ${loadingConversations ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search and filter controls */}
        <div className="bg-white p-3 sm:p-4 rounded-lg border border-white/20 shadow-sm mb-4 sm:mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            {/* Search input with icon */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e6537]"
              />
            </div>
          </div>
        </div>

        {/* Conversations table with responsive design */}
        <div className="bg-white rounded-lg border border-white/20 shadow-sm overflow-hidden">
          {loadingConversations ? (
            <div className="flex items-center justify-center py-12">
              <div className="relative flex flex-col items-center">
                {/* Animated loading icon */}
                <div className="relative mb-4">
                  {/* Outer pulsing ring */}
                  <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-r from-[#0e6537] via-[#157a42] to-[#0a5a2f] opacity-20 animate-ping" />
                  
                  {/* Main spinning icon */}
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#0e6537] via-[#157a42] to-[#0a5a2f] flex items-center justify-center shadow-lg">
                    <RefreshCw className="w-6 h-6 text-white animate-spin" />
                  </div>
                  
                  {/* Floating accent dots */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#0e6537] rounded-full opacity-60 animate-pulse" />
                  <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-[#157a42] rounded-full opacity-40 animate-pulse" style={{ animationDelay: '500ms' }} />
                </div>
                
                {/* Loading text */}
                <div className="text-center">
                  <div className="text-lg font-semibold bg-gradient-to-r from-[#0e6537] via-[#157a42] to-[#0a5a2f] bg-clip-text text-transparent mb-1">
                    Loading Conversations
                  </div>
                  <div className="text-sm text-gray-500">
                    Fetching your latest messages...
                  </div>
                </div>
                
                {/* Animated dots */}
                <div className="flex space-x-1 mt-4">
                  <div className="w-1.5 h-1.5 bg-[#0e6537] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-[#157a42] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-[#0a5a2f] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          ) : conversationsError ? (
            <div className="text-center py-8 text-red-500">Error loading conversations: {conversationsError}</div>
          ) : filteredAndSortedConversations.length === 0 ? (
            <div className="text-center py-8 text-gray-600">No conversations found.</div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-white/20">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-600">Client</th>
                      <th className="text-left p-4 font-medium text-gray-600">
                        <button
                          onClick={() => setSortField("aiScore")}
                          className="flex items-center gap-1 hover:text-[#0e6537] transition-colors"
                        >
                          AI Score
                          {sortField === "aiScore" && (
                            <ChevronUp className="h-4 w-4" />
                          )}
                        </button>
                      </th>
                      <th className="text-left p-4 font-medium text-gray-600">Summary</th>
                      <th className="text-left p-4 font-medium text-gray-600">Last Message</th>
                      <th className="text-left p-4 font-medium text-gray-600">
                        <button
                          onClick={() => setSortField("date")}
                          className="flex items-center gap-1 hover:text-[#0e6537] transition-colors"
                        >
                          Date
                          {sortField === "date" && (
                            <ChevronUp className="h-4 w-4" />
                          )}
                        </button>
                      </th>
                      <th className="text-left p-4 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedConversations.map((conversation) => (
                      <tr
                        key={conversation.thread.conversation_id}
                        className={`border-b hover:bg-[#0e6537]/5 cursor-pointer transition-all duration-200 ${
                          conversation.thread.busy ? 'thread-busy-row bg-[#0e6537]/5' : ''
                        }`}
                        onClick={() => (window.location.href = `/dashboard/conversations/${conversation.thread.conversation_id}`)}
                      >
                        {/* Client information cell */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#0e6537]/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-[#0e6537]">
                                {(conversation.thread.source_name || conversation.thread.associated_account || "Unknown")
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{conversation.thread.source_name || conversation.thread.associated_account || "Unknown Client"}</span>
                                {conversation.thread.busy === 'true' && (
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#0e6537]/10 rounded-full">
                                    <div className="w-1.5 h-1.5 bg-[#0e6537] rounded-full animate-pulse" />
                                    <span className="text-xs text-[#0e6537] font-medium">Email in progress</span>
                                  </div>
                                )}
                              </div>
                              {conversation.thread.busy && (
                                <p className="text-xs text-[#0e6537] mt-1">Please wait while the email is being sent...</p>
                              )}
                            </div>
                          </div>
                        </td>
                        {/* AI score cell with conditional styling */}
                        <td className="p-4">
                          {(() => {
                            const evMessage = conversation.messages.find(msg => {
                              const score = typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score;
                              return score !== undefined && score !== null && !isNaN(score);
                            });
                            const aiScore = evMessage ? (typeof evMessage.ev_score === 'string' ? parseFloat(evMessage.ev_score) : evMessage.ev_score) : null;
                            
                            return (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  aiScore !== null && aiScore >= 80
                                    ? "bg-[#0e6537]/20 text-[#002417]"
                                    : aiScore !== null && aiScore >= 60
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {aiScore !== null && !isNaN(aiScore) ? aiScore : 'N/A'}
                              </span>
                            );
                          })()}
                        </td>
                        {/* Summary and last message cells */}
                        <td className="p-4">
                          <p className="text-sm text-gray-600 max-w-xs truncate">{conversation.thread.ai_summary || "No summary available"}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-600 max-w-xs truncate">{conversation.messages[0]?.body || "No messages"}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-600">{conversation.messages[0]?.timestamp ? getTimeAgo(conversation.messages[0].timestamp) : "Unknown"}</p>
                        </td>
                        {/* Status cell with conditional styling */}
                        <td className="p-4">
                          {(() => {
                            const evMessage = conversation.messages.find(msg => {
                              const score = typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score;
                              return score !== undefined && score !== null && !isNaN(score);
                            });
                            const evScore = evMessage ? (typeof evMessage.ev_score === 'string' ? parseFloat(evMessage.ev_score) : evMessage.ev_score) : -1;
                            const status = calculateStatus(evScore);
                            
                            return (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  status === "hot"
                                    ? "bg-red-100 text-red-800"
                                    : status === "warm"
                                      ? "bg-[#d8eee1] text-[#002417]"
                                      : "bg-[#e6f5ec] text-[#002417]"
                                }`}
                              >
                                {status.toUpperCase()}
                              </span>
                            );
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden">
                <div className="p-4 space-y-4">
                  {filteredAndSortedConversations.map((conversation) => {
                    const evMessage = conversation.messages.find(msg => {
                      const score = typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score;
                      return score !== undefined && score !== null && !isNaN(score);
                    });
                    const aiScore = evMessage ? (typeof evMessage.ev_score === 'string' ? parseFloat(evMessage.ev_score) : evMessage.ev_score) : null;
                    const status = calculateStatus(aiScore || -1);
                    
                    return (
                      <div
                        key={conversation.thread.conversation_id}
                        className={`bg-white border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                          conversation.thread.busy ? 'thread-busy-row border-[#0e6537] bg-[#0e6537]/5' : ''
                        }`}
                        onClick={() => (window.location.href = `/dashboard/conversations/${conversation.thread.conversation_id}`)}
                      >
                        {/* Header with client info and status */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#0e6537]/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-[#0e6537]">
                                {(conversation.thread.source_name || conversation.thread.associated_account || "Unknown")
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 text-sm">
                                {conversation.thread.source_name || conversation.thread.associated_account || "Unknown Client"}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {conversation.messages[0]?.timestamp ? getTimeAgo(conversation.messages[0].timestamp) : "Unknown"}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                status === "hot"
                                  ? "bg-red-100 text-red-800"
                                  : status === "warm"
                                    ? "bg-[#d8eee1] text-[#002417]"
                                    : "bg-[#e6f5ec] text-[#002417]"
                              }`}
                            >
                              {status.toUpperCase()}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                aiScore !== null && aiScore >= 80
                                  ? "bg-[#0e6537]/20 text-[#002417]"
                                  : aiScore !== null && aiScore >= 60
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              AI: {aiScore !== null && !isNaN(aiScore) ? aiScore : 'N/A'}
                            </span>
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {conversation.thread.ai_summary || "No summary available"}
                          </p>
                        </div>

                        {/* Last message preview */}
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Last Message:</p>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {conversation.messages[0]?.body || "No messages"}
                          </p>
                        </div>

                        {/* Busy indicator */}
                        {conversation.thread.busy && (
                          <div className="flex items-center gap-2 p-2 bg-[#0e6537]/10 rounded-lg">
                            <div className="w-2 h-2 bg-[#0e6537] rounded-full animate-pulse" />
                            <span className="text-xs text-[#0e6537] font-medium">Email in progress - Please wait...</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Change Log:
 * 5/25/25 - Initial version
 * - Created conversations dashboard with search and filtering
 * - Implemented conversation table with AI scores
 * - Added status indicators and client information
 * - Integrated responsive design for all screen sizes
 * 5/26/25 - Updated version
 * - Integrated real conversation data from API
 * - Implemented proper filtering based on search and date
 * - Added status calculation based on EV score thresholds
 * - Added loading states and refresh functionality
 * 5/27/25 - Updated version
 * - Added sorting functionality for AI Score and Date columns
 * - Added filter dropdown with status and AI Score range filters
 * - Improved filter UI with checkboxes and range sliders
 */
