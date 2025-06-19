/**
 * File: app/dashboard/email/page.tsx
 * Purpose: Renders the email dashboard with inbox management, email templates, and performance metrics.
 * Author: Alejo Cagliolo
 * Date: 5/25/25
 * Version: 1.0.0
 */

"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, Search, Filter, Plus, Mail, Send, Archive, 
  Trash2, Star, Reply, Forward, Calendar, Users,
  MoreHorizontal, Edit, Eye, MessageSquare, Inbox, AlertCircle
} from "lucide-react"
import { Logo } from "@/app/utils/Logo"

/**
 * EmailPage Component
 * Main email management dashboard component
 * 
 * Features:
 * - Email inbox management
 * - Email composition and sending
 * - Email templates
 * - Email tracking and analytics
 * 
 * @returns {JSX.Element} Complete email management view
 */
export default function EmailPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  // Session check - redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0e6537] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated
  if (status === 'unauthenticated') {
    return null
  }

  // State for email management
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFolder, setSelectedFolder] = useState("inbox")
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])

  // State management for selected email and active tab
  const [activeTab, setActiveTab] = useState<'inbox' | 'junk'>('inbox')
  const [junkCount, setJunkCount] = useState(0)
  const [selectedEmail, setSelectedEmail] = useState<{
    id: number;
    from: string;
    email: string;
    subject: string;
    preview: string;
    time: string;
    read: boolean;
    starred: boolean;
    type: string;
    conversation_id?: string;
    message_id?: string;
    account_id?: string;
  } | null>(null)

  // Mock email data structure with junk emails
  const emails = [
    {
      id: 1,
      from: "Michael Rodriguez",
      email: "michael.rodriguez@email.com",
      subject: "Re: Downtown Condo Viewing",
      preview: "Thanks for showing me the property yesterday. I'm very interested and would like to...",
      time: "2 hours ago",
      read: false,
      starred: true,
      type: "lead",
    },
    {
      id: 2,
      from: "Jennifer Chen",
      email: "jennifer.chen@email.com",
      subject: "Follow-up on Property Search",
      preview: "Hi Sarah, I wanted to follow up on our conversation about finding a condo under...",
      time: "4 hours ago",
      read: true,
      starred: false,
      type: "client",
    },
    {
      id: 3,
      from: "David Thompson",
      email: "david.thompson@email.com",
      subject: "Ready to Make an Offer",
      preview: "I've reviewed all the properties you sent and I'm ready to make an offer on the...",
      time: "6 hours ago",
      read: false,
      starred: true,
      type: "hot-lead",
    },
    {
      id: 4,
      from: "Lisa Park",
      email: "lisa.park@email.com",
      subject: "Questions about Financing",
      preview: "I have some questions about the financing options for the suburban home we...",
      time: "1 day ago",
      read: true,
      starred: false,
      type: "client",
    },
    {
      id: 5,
      from: "Spam Sender",
      email: "spam@example.com",
      subject: "You've won a prize!",
      preview: "Congratulations! You've been selected to win a million dollars...",
      time: "1 day ago",
      read: true,
      starred: false,
      type: "junk",
      conversation_id: "conv_123",
      message_id: "msg_456",
      account_id: "acc_789"
    },
    {
      id: 6,
      from: "Another Spammer",
      email: "spammer@example.com",
      subject: "Urgent: Your account needs verification",
      preview: "Your account has been compromised. Click here to verify...",
      time: "2 days ago",
      read: false,
      starred: false,
      type: "junk",
      conversation_id: "conv_124",
      message_id: "msg_457",
      account_id: "acc_789"
    }
  ]

  // Filter emails based on active tab
  const filteredEmails = emails.filter(email => email.type !== 'junk')

  // Update junk count
  useEffect(() => {
    const count = emails.filter(email => email.type === 'junk').length
    setJunkCount(Math.min(count, 99))
  }, [emails])

  // Handle marking email as not spam
  const handleMarkAsNotSpam = async (email: typeof selectedEmail) => {
    if (!email?.conversation_id || !email?.message_id || !email?.account_id) return

    try {
      const response = await fetch('/api/lcp/mark_not_spam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: email.conversation_id,
          message_id: email.message_id,
          account_id: email.account_id
        }),
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to mark email as not spam')
      }

      // Update local state to reflect the change
      const updatedEmails = emails.map(e => 
        e.id === email.id ? { ...e, type: 'lead' } : e
      )
      // In a real app, you would update the emails state here
      // setEmails(updatedEmails)
    } catch (error) {
      console.error('Error marking email as not spam:', error)
      // Handle error (show toast notification, etc.)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1]">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Logo size="md" />
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-[#0e6537]/10 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5 text-[#0e6537]" />
            </button>
            <h1 className="text-2xl font-bold text-[#0e6537]">Email Management</h1>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Compose
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white bg-gradient-to-br from-[#e6f5ec] to-[#f0f9f4] p-4 rounded-lg border shadow-sm">
            <p className="text-2xl font-bold text-[#0e6537]">12</p>
            <p className="text-sm text-gray-600">Unread Emails</p>
          </div>
          <div className="bg-white bg-gradient-to-br from-[#e6f5ec] to-[#f0f9f4] p-4 rounded-lg border shadow-sm">
            <p className="text-2xl font-bold text-green-600">8</p>
            <p className="text-sm text-gray-600">Starred</p>
          </div>
          <div className="bg-white bg-gradient-to-br from-[#e6f5ec] to-[#f0f9f4] p-4 rounded-lg border shadow-sm">
            <p className="text-2xl font-bold text-orange-600">24</p>
            <p className="text-sm text-gray-600">Sent Today</p>
          </div>
          <div className="bg-white bg-gradient-to-br from-[#e6f5ec] to-[#f0f9f4] p-4 rounded-lg border shadow-sm">
            <p className="text-2xl font-bold text-purple-600">156</p>
            <p className="text-sm text-gray-600">Total Emails</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email List */}
          <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm">
            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search emails..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e6537]"
                />
              </div>
            </div>

            {/* Email List */}
            <div className="divide-y">
              {filteredEmails.map((email) => (
                <div
                  key={email.id}
                  className={`p-4 hover:bg-[#0e6537]/5 cursor-pointer ${!email.read ? "bg-[#e6f5ec]" : ""}`}
                  onClick={() => setSelectedEmail(email)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <button className={`p-1 ${email.starred ? "text-yellow-500" : "text-gray-300"}`}>
                        <Star className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`font-medium truncate ${!email.read ? "font-bold" : ""}`}>{email.from}</p>
                        <span className="text-xs text-gray-500">{email.time}</span>
                      </div>
                      <p className={`text-sm truncate mb-1 ${!email.read ? "font-semibold" : ""}`}>{email.subject}</p>
                      <p className="text-xs text-gray-600 truncate">{email.preview}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {email.type === 'junk' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMarkAsNotSpam(email)
                            }}
                            className="flex items-center gap-1 px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100"
                          >
                            <AlertCircle className="h-3 w-3" />
                            Mark as Not Spam
                          </button>
                        ) : (
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              email.type === "hot-lead"
                                ? "bg-red-100 text-red-800"
                                : email.type === "lead"
                                  ? "bg-[#e6f5ec] text-[#002417]"
                                  : "bg-[#0e6537]/20 text-[#002417]"
                            }`}
                          >
                            {email.type.replace("-", " ").toUpperCase()}
                          </span>
                        )}
                        {!email.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email Actions & Quick Compose */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm bg-[#e6f5ec] text-[#002417] hover:bg-[#0e6537]/20 rounded-lg">
                  <Send className="h-4 w-4" />
                  Send Follow-up
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm bg-[#0e6537]/20 text-[#002417] hover:bg-[#0e6537]/30 rounded-lg">
                  <Archive className="h-4 w-4" />
                  Archive Selected
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
                  <Trash2 className="h-4 w-4" />
                  Delete Selected
                </button>
              </div>
            </div>

            {/* Email Templates */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Email Templates</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">
                  Welcome New Lead
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">
                  Property Recommendations
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">
                  Follow-up After Showing
                </button>
                <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">Market Update</button>
              </div>
            </div>

            {/* Email Stats */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Email Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Open Rate</span>
                  <span className="text-sm font-medium">68%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="text-sm font-medium">24%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Emails Sent Today</span>
                  <span className="text-sm font-medium">24</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
