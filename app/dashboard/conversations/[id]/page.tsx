/**
 * File: app/dashboard/conversations/[id]/page.tsx
 * Purpose: Renders a detailed conversation view with message history, client information, and AI-powered insights.
 * Author: Alejo Cagliolo
 * Date: 5/25/25
 * Version: 1.0.0
 */

"use client"
import { ArrowLeft, Phone, Mail, Calendar, MapPin } from "lucide-react"
import { useParams } from "next/navigation"

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
 * ConversationDetailPage Component
 * Main conversation detail component displaying message history and client information
 * 
 * Features:
 * - Real-time message display
 * - Client information panel
 * - AI-powered conversation summary
 * - Quick action buttons
 * 
 * @returns {JSX.Element} Complete conversation detail view
 */
export default function ConversationDetailPage() {
  // Get conversation ID from URL parameters
  const params = useParams()
  const conversationId = params.id

  // Mock conversation data structure
  const conversation = {
    id: conversationId,
    name: "Michael Rodriguez",
    email: "michael.rodriguez@email.com",
    phone: "(555) 123-4567",
    aiScore: 85,
    summary: "Interested in 3BR homes in downtown area, budget $450K-500K",
    preferredTypes: ["Condo", "Townhouse"],
    budget: "$450K-500K",
    location: "Downtown Area",
    timeline: "Ready to buy within 3 months",
    messages: [
      {
        id: 1,
        sender: "client",
        message: "Hi! I'm looking for a 3-bedroom home in the downtown area. My budget is around $450K to $500K.",
        timestamp: "2024-01-15 09:00 AM",
        date: "Today",
      },
      {
        id: 2,
        sender: "agent",
        message:
          "Hello Michael! I'd be happy to help you find the perfect home. Based on your criteria, I have several great options in the downtown area. Are you interested in condos, townhouses, or single-family homes?",
        timestamp: "2024-01-15 09:15 AM",
        date: "Today",
      },
      {
        id: 3,
        sender: "client",
        message: "I'm open to both condos and townhouses. Modern finishes would be a plus!",
        timestamp: "2024-01-15 09:30 AM",
        date: "Today",
      },
      {
        id: 4,
        sender: "agent",
        message:
          "Perfect! I have 3 properties that match your criteria perfectly. I'll send you the listings shortly. Would you be available for viewings this weekend?",
        timestamp: "2024-01-15 10:00 AM",
        date: "Today",
      },
      {
        id: 5,
        sender: "client",
        message: "Thanks for the listings! Can we schedule a viewing for the downtown condo?",
        timestamp: "2024-01-15 02:00 PM",
        date: "Today",
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1]">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header section with navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Logo />
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gradient-to-r hover:from-[#0e6537]/10 hover:to-[#157a42]/10 transition-all duration-200 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">Conversation with {conversation.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages section with chat interface */}
          <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Messages</h2>
            </div>
            {/* Message history display */}
            <div className="p-4 h-96 overflow-y-auto space-y-4">
              {conversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "agent" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === "agent"
                        ? "bg-gradient-to-br from-[#0e6537] to-[#157a42] text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${message.sender === "agent" ? "text-green-50" : "text-gray-500"}`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Message input section */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e6537]"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm">
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar with client info and actions */}
          <div className="space-y-6">
            {/* Client Information panel */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Client Information</h3>

              <div className="space-y-3">
                {/* Client avatar and AI score */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0e6537]/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-[#0e6537]">
                      {conversation.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{conversation.name}</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        conversation.aiScore >= 80
                          ? "bg-[#0e6537]/20 text-[#002417]"
                          : conversation.aiScore >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      AI Score: {conversation.aiScore}
                    </span>
                  </div>
                </div>

                {/* Contact details */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  {conversation.email}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  {conversation.phone}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {conversation.location}
                </div>
              </div>
            </div>

            {/* AI Summary panel */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">AI Summary</h3>
              <p className="text-sm text-gray-600 mb-4">{conversation.summary}</p>

              <div className="space-y-3">
                {/* Budget information */}
                <div>
                  <p className="text-sm font-medium text-gray-700">Budget Range</p>
                  <p className="text-sm text-gray-600">{conversation.budget}</p>
                </div>

                {/* Property preferences */}
                <div>
                  <p className="text-sm font-medium text-gray-700">Preferred Property Types</p>
                  <div className="flex gap-1 mt-1">
                    {conversation.preferredTypes.map((type, index) => (
                      <span key={index} className="px-2 py-1 bg-[#e6f5ec] text-[#002417] text-xs rounded">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Timeline information */}
                <div>
                  <p className="text-sm font-medium text-gray-700">Timeline</p>
                  <p className="text-sm text-gray-600">{conversation.timeline}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions panel */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-[#e6f5ec] text-[#002417] hover:bg-[#0e6537]/20 rounded-lg">
                  <Calendar className="h-4 w-4" />
                  Schedule Showing
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-[#0e6537]/20 text-[#002417] hover:bg-[#0e6537]/30 rounded-lg">
                  <Mail className="h-4 w-4" />
                  Send Listings
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-[#d8eee1] text-[#002417] hover:bg-[#0e6537]/20 rounded-lg">
                  <Phone className="h-4 w-4" />
                  Call Client
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Change Log:
 * 5/25/25 - Initial version
 * - Created conversation detail page with message history
 * - Implemented client information panel
 * - Added AI-powered conversation summary
 * - Integrated quick action buttons
 * - Added responsive design for all screen sizes
 */
