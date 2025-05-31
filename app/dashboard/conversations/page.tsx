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

// Add type for message
type Message = {
  timestamp: string;
  body: string;
  ev_score: number | string;
  type: string;
  sender?: string;
};

/**
 * Logo Component
 * Displays the ACS logo with customizable size and gradient text
 * 
 * @param {Object} props - Component props
 * @param {"sm" | "lg"} props.size - Size variant of the logo
 * @returns {JSX.Element} ACS logo with gradient background and text
 */
function Logo({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gradient-to-br from-[#0a5a2f] via-[#0e6537] to-[#157a42] rounded-lg flex items-center justify-center shadow-sm">
        <span className="text-white font-bold text-sm">ACS</span>
      </div>
      <span className="font-bold text-lg bg-gradient-to-r from-[#0a5a2f] to-[#157a42] bg-clip-text text-transparent">
        ACS
      </span>
    </div>
  )
}

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

/**
 * Helper function to get time ago string from timestamp
 * @param timestamp - The message timestamp
 * @returns Formatted time ago string
 */
function getTimeAgo(timestamp: string): string {
  const now = new Date()
  const messageDate = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  return messageDate.toLocaleDateString()
}

type SortField = "aiScore" | "date" | null;
type SortDirection = "asc" | "desc" | null;

type FilterState = {
  status: ("hot" | "warm" | "cold")[];
  aiScoreRange: [number, number];
};

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
  const { data: session, status } = useSession() as { data: Session | null, status: string }
  const [mounted, setMounted] = useState(false)
  const [conversations, setConversations] = useState<Thread[]>([])
  const [rawThreads, setRawThreads] = useState<any[]>([])
  const [loadingConversations, setLoadingConversations] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    status: ["hot", "warm", "cold"],
    aiScoreRange: [0, 100],
  })

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

  // Handle sort click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortField(null)
        setSortDirection(null)
      } else {
        setSortDirection("asc")
      }
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Get sort icon for a field
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ChevronsUpDown className="h-4 w-4" />
    if (sortDirection === "asc") return <ChevronUp className="h-4 w-4" />
    if (sortDirection === "desc") return <ChevronDown className="h-4 w-4" />
    return <ChevronsUpDown className="h-4 w-4" />
  }

  // Filter and sort conversations
  const filteredAndSortedConversations = rawThreads
    .filter((threadData) => {
      const thread = threadData.thread;
      const messages = threadData.messages || [];
      const latestMessage = messages[0];
      
      // Search term filter
      const searchMatch = 
        thread.source_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thread.ai_summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        latestMessage?.body?.toLowerCase().includes(searchTerm.toLowerCase());

      // Date filter
      let dateMatch = true;
      if (selectedDate && latestMessage?.timestamp) {
        const messageDate = new Date(latestMessage.timestamp);
        const filterDate = new Date(selectedDate);
        dateMatch = messageDate.toDateString() === filterDate.toDateString();
      }

      // Find the most recent message with a valid ev_score
      const evMessage = messages
        .filter((msg: Message) => {
          const score = typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score;
          return typeof score === 'number' && !isNaN(score) && score >= 0 && score <= 100;
        })
        .reduce((latest: Message | undefined, msg: Message) => {
          if (!latest) return msg;
          return new Date(msg.timestamp) > new Date(latest.timestamp) ? msg : latest;
        }, undefined as Message | undefined);

      const evScore = evMessage ? (typeof evMessage.ev_score === 'string' ? parseFloat(evMessage.ev_score) : evMessage.ev_score) : 0;
      const conversationStatus = calculateStatus(evScore);

      // Status filter
      const statusMatch = filters.status.includes(conversationStatus);
      
      // AI Score range filter
      const scoreMatch = evScore >= filters.aiScoreRange[0] && evScore <= filters.aiScoreRange[1];

      return searchMatch && dateMatch && statusMatch && scoreMatch;
    })
    .map((threadData) => {
      const thread = threadData.thread;
      const messages = threadData.messages || [];
      const latestMessage = messages[0];
      
      const evMessage = messages
        .filter((msg: Message) => {
          const score = typeof msg.ev_score === 'string' ? parseFloat(msg.ev_score) : msg.ev_score;
          return typeof score === 'number' && !isNaN(score) && score >= 0 && score <= 100;
        })
        .reduce((latest: Message | undefined, msg: Message) => {
          if (!latest) return msg;
          return new Date(msg.timestamp) > new Date(latest.timestamp) ? msg : latest;
        }, undefined as Message | undefined);

      const evScore = evMessage ? (typeof evMessage.ev_score === 'string' ? parseFloat(evMessage.ev_score) : evMessage.ev_score) : 0;
      const status = calculateStatus(evScore);

      return {
        id: thread.conversation_id,
        name: thread.source_name || thread.associated_account || "Unknown Client",
        aiScore: evScore,
        summary: thread.ai_summary || "No summary available",
        lastMessage: latestMessage?.body || "No messages",
        date: latestMessage?.timestamp || new Date().toISOString(),
        time: latestMessage?.timestamp ? getTimeAgo(latestMessage.timestamp) : "Unknown",
        status,
        propertyTypes: thread.preferred_property_types || "Not specified",
        budget: thread.budget_range || "Not specified",
      };
    })
    .sort((a, b) => {
      if (!sortField || !sortDirection) return 0;

      if (sortField === "aiScore") {
        return sortDirection === "asc" ? a.aiScore - b.aiScore : b.aiScore - a.aiScore;
      }

      if (sortField === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }

      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a5a2f] via-[#0e6537] to-[#157a42]">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header section with navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Logo />
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-white/10 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">All Conversations</h1>
          <div className="ml-auto flex items-center gap-2">
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
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
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
              onClick={fetchThreads}
              disabled={loadingConversations}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <RefreshCw className={`h-5 w-5 text-white ${loadingConversations ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search and filter controls */}
        <div className="bg-white p-4 rounded-lg border border-white/20 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search input with icon */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e6537]"
              />
            </div>
            {/* Date picker */}
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-4 pr-4 py-2 bg-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e6537]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Conversations table with responsive design */}
        <div className="bg-white rounded-lg border border-white/20 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {loadingConversations ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin text-[#0e6537]" />
                <span className="ml-2 text-gray-600">Loading conversations...</span>
              </div>
            ) : filteredAndSortedConversations.length === 0 ? (
              <div className="text-center py-8 text-gray-600">No conversations found.</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-white/20">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-600">Client</th>
                    <th className="text-left p-4 font-medium text-gray-600">
                      <button
                        onClick={() => handleSort("aiScore")}
                        className="flex items-center gap-1 hover:text-[#0e6537] transition-colors"
                      >
                        AI Score
                        {getSortIcon("aiScore")}
                      </button>
                    </th>
                    <th className="text-left p-4 font-medium text-gray-600">Summary</th>
                    <th className="text-left p-4 font-medium text-gray-600">Last Message</th>
                    <th className="text-left p-4 font-medium text-gray-600">
                      <button
                        onClick={() => handleSort("date")}
                        className="flex items-center gap-1 hover:text-[#0e6537] transition-colors"
                      >
                        Date
                        {getSortIcon("date")}
                      </button>
                    </th>
                    <th className="text-left p-4 font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedConversations.map((conversation) => (
                    <tr
                      key={conversation.id}
                      className="border-b hover:bg-[#0e6537]/5 cursor-pointer"
                      onClick={() => (window.location.href = `/dashboard/conversations/${conversation.id}`)}
                    >
                      {/* Client information cell */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#0e6537]/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-[#0e6537]">
                              {conversation.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{conversation.name}</p>
                            <p className="text-sm text-gray-500">{conversation.budget}</p>
                          </div>
                        </div>
                      </td>
                      {/* AI score cell with conditional styling */}
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            conversation.aiScore >= 80
                              ? "bg-[#0e6537]/20 text-[#002417]"
                              : conversation.aiScore >= 60
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {conversation.aiScore}
                        </span>
                      </td>
                      {/* Summary and last message cells */}
                      <td className="p-4">
                        <p className="text-sm text-gray-600 max-w-xs truncate">{conversation.summary}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-600 max-w-xs truncate">{conversation.lastMessage}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-600">{conversation.time}</p>
                      </td>
                      {/* Status cell with conditional styling */}
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            conversation.status === "hot"
                              ? "bg-red-100 text-red-800"
                              : conversation.status === "warm"
                                ? "bg-[#d8eee1] text-[#002417]"
                                : "bg-[#e6f5ec] text-[#002417]"
                          }`}
                        >
                          {conversation.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
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
