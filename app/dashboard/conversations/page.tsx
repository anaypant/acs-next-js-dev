/**
 * File: app/dashboard/conversations/page.tsx
 * Purpose: Renders the main conversations dashboard with search, filtering, and conversation list.
 * Author: Alejo Cagliolo
 * Date: 5/25/25
 * Version: 1.0.0
 */

"use client"
import { ArrowLeft, Search, Calendar, Filter } from "lucide-react"
import { useState } from "react"

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
  // State management for search and date filtering
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("")

  // Mock conversation data structure
  const conversations = [
    {
      id: 1,
      name: "Michael Rodriguez",
      aiScore: 85,
      summary: "Interested in 3BR homes in downtown area, budget $450K-500K",
      lastMessage: "Thanks for the listings! Can we schedule a viewing for the downtown condo?",
      date: "2024-01-15",
      time: "2 hours ago",
      status: "hot",
      propertyTypes: ["Condo", "Townhouse"],
      budget: "$450K-500K",
    },
    {
      id: 2,
      name: "Jennifer Chen",
      aiScore: 72,
      summary: "First-time buyer, looking for condos under $300K",
      lastMessage: "I'm still looking at the options you sent. Need more time to decide.",
      date: "2024-01-15",
      time: "4 hours ago",
      status: "warm",
      propertyTypes: ["Condo"],
      budget: "Under $300K",
    },
    {
      id: 3,
      name: "David Thompson",
      aiScore: 91,
      summary: "Ready to buy, pre-approved for $600K, wants modern homes",
      lastMessage: "I love the modern house on Oak Street! When can we make an offer?",
      date: "2024-01-15",
      time: "6 hours ago",
      status: "hot",
      propertyTypes: ["Single Family", "Modern"],
      budget: "$600K",
    },
    {
      id: 4,
      name: "Lisa Park",
      aiScore: 58,
      summary: "Exploring options, interested in suburban family homes",
      lastMessage: "Still thinking about it. Will get back to you next week.",
      date: "2024-01-14",
      time: "1 day ago",
      status: "cold",
      propertyTypes: ["Single Family"],
      budget: "$400K-500K",
    },
    {
      id: 5,
      name: "Robert Wilson",
      aiScore: 79,
      summary: "Investment property seeker, looking for rental potential",
      lastMessage: "What's the rental yield on the properties you showed me?",
      date: "2024-01-14",
      time: "1 day ago",
      status: "warm",
      propertyTypes: ["Investment", "Multi-family"],
      budget: "$300K-400K",
    },
    {
      id: 6,
      name: "Amanda Foster",
      aiScore: 67,
      summary: "Young professional looking for studio or 1BR near downtown",
      lastMessage: "The studio apartment looks great! Is parking included?",
      date: "2024-01-13",
      time: "2 days ago",
      status: "warm",
      propertyTypes: ["Studio", "1BR"],
      budget: "$200K-250K",
    },
  ]

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.summary.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
          <h1 className="text-2xl font-bold" style={{ color: 'white' }}>All Conversations</h1>
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
            {/* Date picker and filter buttons */}
            <div className="flex gap-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e6537]"
                />
              </div>
              <button className="px-4 py-2 bg-white border border-white/20 rounded-lg hover:bg-white/90 transition-all duration-200 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Conversations table with responsive design */}
        <div className="bg-white rounded-lg border border-white/20 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-white/20">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-600">Client</th>
                  <th className="text-left p-4 font-medium text-gray-600">AI Score</th>
                  <th className="text-left p-4 font-medium text-gray-600">Summary</th>
                  <th className="text-left p-4 font-medium text-gray-600">Last Message</th>
                  <th className="text-left p-4 font-medium text-gray-600">Date</th>
                  <th className="text-left p-4 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredConversations.map((conversation) => (
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
                              .map((n) => n[0])
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
 */
