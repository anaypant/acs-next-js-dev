/**
 * File: app/dashboard/conversations/[id]/page.tsx
 * Purpose: Renders a detailed conversation view with message history, client information, and AI-powered insights.
 * Author: Alejo Cagliolo
 * Date: 5/25/25
 * Version: 1.0.0
 */

"use client"
import { ArrowLeft, Phone, Mail, Calendar, MapPin, Flag } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import type { Thread } from "@/app/types/lcp"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

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

// Utility to get a color for the EV score (red-yellow-green gradient)
function getEvColor(score: number) {
  if (score <= 39) return '#ef4444'; // red-500
  if (score <= 69) return '#facc15'; // yellow-400
  return '#22c55e'; // green-500
}

/**
 * LoadingSkeleton Component
 * Displays an animated loading state for the conversation detail page
 */
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1]">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <Logo />
          <div className="h-8 w-8 bg-white/50 rounded-lg animate-pulse" />
          <div className="h-8 w-64 bg-white/50 rounded-lg animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages section skeleton */}
          <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm flex flex-col relative h-[50rem]">
            <div className="p-4 border-b">
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-start">
                  <div className="flex items-center gap-2">
                    <div className="h-16 w-64 bg-gray-100 rounded-lg animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="space-y-6">
            {/* Client info skeleton */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* AI Summary skeleton */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* EV Score Threshold skeleton */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
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
  const params = useParams()
  const conversationId = params.id as string
  const [thread, setThread] = useState<Thread | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [threshold, setThreshold] = useState<number | null>(null)
  const [updatingThreshold, setUpdatingThreshold] = useState(false)

  useEffect(() => {
    const fetchThread = async () => {
      setLoading(true)
      const res = await fetch("/api/lcp/getThreadById", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: conversationId }),
      })
      const data = await res.json()
      if (data.success) {
        setThread(data.data.thread)
        setMessages(data.data.messages)
        setThreshold(typeof data.data.thread.lcp_flag_threshold === 'number' ? data.data.thread.lcp_flag_threshold : Number(data.data.thread.lcp_flag_threshold) || 0)
        console.log('thread', data.data.thread)
        console.log('messages', data.data.messages)
      }
      setLoading(false)
    }
    fetchThread()
  }, [conversationId])

  // Find client email from the first inbound message or thread
  const clientEmail =
    messages.find((msg) => msg.type === "inbound-email")?.sender ||
    thread?.associated_account ||
    "Client"

  const leadName = thread?.source_name || clientEmail;

  // Sort messages by timestamp ascending
  const sortedMessages = [...messages].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  if (loading) {
    return <LoadingSkeleton />
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
          <h1 className="text-2xl font-bold">Conversation with {leadName}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages section with chat interface */}
          <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm flex flex-col relative h-[50rem]">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 p-4 pb-20">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-start">
                      <div className="flex items-center gap-2">
                        <div className="h-16 w-64 bg-gray-100 rounded-lg animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : sortedMessages.length === 0 ? (
                <div>No messages found.</div>
              ) : (
                sortedMessages.map((msg) => (
                  <div
                    key={msg.response_id}
                    className={`flex ${
                      msg.type === "outbound-email"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.type === "outbound-email"
                            ? "bg-gradient-to-br from-[#0e6537] to-[#157a42] text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {/* Only show subject if you want, otherwise just body */}
                        {/* {msg.subject && <div className="text-xs font-bold mb-1">{msg.subject}</div>} */}
                        <p className="text-sm whitespace-pre-line">{msg.body}</p>
                        <p
                          className={`text-xs ${
                            msg.type === "outbound-email"
                              ? "mt-4 text-green-50"
                              : "mt-1 text-gray-500"
                          }`}
                        >
                          {msg.type === "inbound-email"
                            ? clientEmail
                            : "You"}
                          <span className="ml-2 text-gray-400">
                            {msg.timestamp
                              ? new Date(msg.timestamp).toLocaleString()
                              : ""}
                          </span>
                        </p>
                      </div>
                      {/* EV Score Circular Progress for inbound-email */}
                      {msg.type === "inbound-email" && typeof msg.ev_score === 'string' && Number(msg.ev_score) >= 0 && Number(msg.ev_score) <= 100 && (
                        <div className="ml-2 flex items-center" style={{ width: 32, height: 32 }} title={`EV Score: ${msg.ev_score}`}>
                          <CircularProgressbar
                            value={Number(msg.ev_score)}
                            maxValue={100}
                            text={`${msg.ev_score}`}
                            strokeWidth={10}
                            styles={buildStyles({
                              pathColor: getEvColor(Number(msg.ev_score)),
                              trailColor: '#e5e7eb',
                              textColor: getEvColor(Number(msg.ev_score)),
                              textSize: '28px',
                              pathTransitionDuration: 0.5,
                            })}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Floating Message input section, now only under left column */}
            <div className="absolute left-0 right-0 bottom-0 z-20 bg-white border-t border-gray-200 p-4 flex gap-2 " style={{boxShadow: '0 -2px 8px rgba(0,0,0,0.03)'}}>
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
                      {leadName[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{leadName}</p>
                  </div>
                </div>

                {/* Contact details */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  {clientEmail}
                </div>

                {thread?.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    {thread.phone}
                  </div>
                )}

                {thread?.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {thread.location}
                  </div>
                )}
              </div>
            </div>

            {/* Thread AI Summary from thread attributes */}
            {thread && (
              (() => {
                const aiSummary = thread.ai_summary?.trim();
                const budgetRange = thread.budget_range?.trim();
                const propertyTypes = thread.preferred_property_types?.trim();
                const timeline = thread.timeline?.trim();
                const isEmpty = [aiSummary, budgetRange, propertyTypes, timeline].every(
                  (val) => !val || val === 'UNKNOWN'
                );
                if (isEmpty) return null;
                return (
                  <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">Thread AI Summary</h3>
                    {aiSummary && aiSummary !== 'UNKNOWN' && (
                      <div className="mb-2 text-gray-700"><span className="font-medium">AI Summary:</span> {aiSummary}</div>
                    )}
                    {budgetRange && budgetRange !== 'UNKNOWN' && (
                      <div className="mb-2 text-gray-700"><span className="font-medium">Budget Range:</span> {budgetRange}</div>
                    )}
                    {propertyTypes && propertyTypes !== 'UNKNOWN' && (
                      <div className="mb-2 text-gray-700"><span className="font-medium">Preferred Property Types:</span> {propertyTypes}</div>
                    )}
                    {timeline && timeline !== 'UNKNOWN' && (
                      <div className="mb-2 text-gray-700"><span className="font-medium">Timeline:</span> {timeline}</div>
                    )}
                  </div>
                );
              })()
            )}

            {/* EV Score Threshold Widget */}
            <div className="bg-white p-6 rounded-lg border shadow-sm mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Flag className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-gray-700">EV Score Threshold</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                This number is the threshold to <span className="font-semibold text-red-600">flag</span> a thread as ready for review. If a conversation's EV score exceeds this value, it will be flagged for your attention.
              </p>
              <div className="flex items-center gap-4 mb-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={threshold ?? 0}
                  onChange={e => setThreshold(Number(e.target.value))}
                  className="w-40 accent-red-600"
                  disabled={updatingThreshold}
                />
                <span className="font-mono text-lg text-red-700">{threshold}</span>
              </div>
              <button
                className="px-4 py-2 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white rounded-lg hover:from-[#157a42] hover:to-[#1a8a4a] transition-all duration-200 shadow-sm disabled:opacity-50"
                disabled={updatingThreshold || threshold === thread?.lcp_flag_threshold}
                onClick={async () => {
                  if (!thread) return;
                  setUpdatingThreshold(true);
                  try {
                    const res = await fetch('/api/db/update', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        table_name: 'Threads',
                        key_name: 'conversation_id',
                        key_value: thread.conversation_id,
                        update_data: { lcp_flag_threshold: String(threshold) }
                      })
                    });
                    if (res.ok) {
                      // Update thread in state
                      setThread((prev: any) => ({ ...prev, lcp_flag_threshold: threshold }));
                    }
                  } finally {
                    setUpdatingThreshold(false);
                  }
                }}
              >
                {updatingThreshold ? 'Applying...' : 'Apply'}
              </button>
            </div>

            {/* Quick Actions panel
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
            </div> */}
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
