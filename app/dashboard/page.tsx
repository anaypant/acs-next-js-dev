/**
 * File: app/dashboard/page.tsx
 * Purpose: Renders the main dashboard with lead conversion pipeline, performance metrics, and activity tracking.
 * Author: Alejo Cagliolo
 * Date: 5/25/25
 * Version: 1.0.0
 */

"use client"
import { Home, Mail, Users, MessageSquare, BarChart3, Settings, Phone, Calendar, PanelLeft } from "lucide-react"
import type React from "react"
import { SidebarProvider, AppSidebar, SidebarTrigger, SidebarInset } from "./Sidebar"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { goto404 } from "../utils/error"

// Extend the default session user type
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
  const { data: session, status } = useSession() 
  const router = useRouter()
  const [mounted, setMounted] = useState(false) 
  const [conversations, setConversations] = useState<any[]>([])
  const [loadingConversations, setLoadingConversations] = useState(true)

  // Handle mounting state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch threads when session is available
  useEffect(() => {
    const fetchThreads = async () => {
      if (!mounted || !session?.user?.id) return;

      try {
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

        // Log id
        console.log('Session user ID:', session?.user?.id);
      } catch (error) {
        console.error('Error fetching threads:', error);
      }
    };

    fetchThreads();
  }, [session, mounted]);

  // Check authentication status
  useEffect(() => {
    if (!mounted) return;
    if (status === "unauthenticated") {
      goto404("401", "No active session found", router)
    }
  }, [status, session, router, mounted])

  return (
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

        {/* Main dashboard content with gradient background */}
        <div className="flex flex-1 flex-col gap-6 p-6 bg-gradient-to-b from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1] min-h-screen">
          {/* Welcome section with personalized greeting */}
          <div className="bg-gradient-to-b from-[#0a5a2f] via-[#0e6537] to-[#157a42] p-8 rounded-lg">
            <h1 style={{ color: 'white' }} className="text-3xl font-bold mb-2">Welcome, {session?.user?.name || 'User'}</h1>
            <p style={{ color: 'white' }}>Ready to convert more leads today? You have 12 active conversations waiting.</p>
          </div>

          {/* Lead statistics widgets with mini charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* New leads widget */}
            <div className="bg-white p-6 rounded-lg border border-[#0e6537]/20 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-[#0e6537]">24</p>
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
                  <p className="text-3xl font-bold text-[#0e6537]">8</p>
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
                  <p className="text-3xl font-bold text-[#0e6537]">15</p>
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
                <button
                  className="px-4 py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm"
                  onClick={() => (window.location.href = "/dashboard/conversations")}
                >
                  Load All Conversations
                </button>
              </div>
              <div className="space-y-4">
                {loadingConversations ? (
                  <div>Loading conversations...</div>
                ) : conversations.length === 0 ? (
                  <div>No conversations found.</div>
                ) : (
                  conversations.map((conv, idx) => (
                    <div
                      key={conv.conversation_id || idx}
                      className="flex items-start gap-4 p-4 border border-[#0e6537]/20 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => (window.location.href = `/dashboard/conversations/${conv.conversation_id}`)}
                    >
                      {/* Avatar with initials */}
                      <div className="w-10 h-10 bg-[#0e6537]/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-[#0e6537]">
                          {(conv.sender || conv.receiver || 'C').split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                      {/* Conversation details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{conv.sender || conv.receiver || 'Unknown'}</p>
                          {/* AI score badge placeholder */}
                          {conv.ev_score && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#e6f5ec] text-[#002417]">
                              EV: {conv.ev_score}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{conv.subject || 'No subject'}</p>
                        <p className="text-xs text-gray-400">{conv.timestamp ? new Date(conv.timestamp).toLocaleString() : ''}</p>
                      </div>
                    </div>
                  ))
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
