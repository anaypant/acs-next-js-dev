/**
 * File: app/dashboard/history/page.tsx
 * Purpose: Displays completed conversations/threads with filtering and search capabilities
 * Author: AI Assistant
 * Date: 12/19/25
 * Version: 1.0.0
 */

"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Search, Filter, Calendar, MessageSquare, User, Mail, Phone, MapPin, Clock, CheckCircle, ArrowRight, Download, FileText, ArrowLeft, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Star, MessageCircle } from "lucide-react"
import type { Session } from "next-auth"
import { useConversationsData } from '../lib/use-conversations'
import type { Thread } from "@/app/types/lcp"
import { formatLocalTime } from '@/app/utils/timezone'
import Link from "next/link"

interface CompletedThread extends Thread {
  completion_reason?: string
  completion_notes?: string
  completed_at?: string
}

interface ExpandedThread {
  [key: string]: boolean
}

interface ThreadStats {
  totalMessages: number
  userMessages: number
  assistantMessages: number
  duration: number
  avgResponseTime: number
  firstMessage: string
  lastMessage: string
  firstMessageType: 'inbound-email' | 'outbound-email'
  lastMessageType: 'inbound-email' | 'outbound-email'
}

export default function HistoryPage() {
  const { data: session } = useSession() as { data: (Session & { user?: { id: string } }) | null }
  const router = useRouter()
  const { conversations, isLoading, refreshConversations } = useConversationsData()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReason, setSelectedReason] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"completed_at" | "source_name" | "completion_reason">("completed_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [expandedThreads, setExpandedThreads] = useState<ExpandedThread>({})

  // Helper function to check if a thread is completed
  const isThreadCompleted = (completed: boolean | string | undefined): boolean => {
    if (typeof completed === 'boolean') return completed;
    if (typeof completed === 'string') return completed.toLowerCase() === 'true';
    return false;
  };

  // Filter conversations to only show completed ones
  const completedThreads: CompletedThread[] = conversations
    .map(conv => conv.thread)
    .filter(thread => {
      const isCompleted = isThreadCompleted(thread.completed);
      
      return isCompleted;
    }) as CompletedThread[]

  // Get completed threads with their messages
  const completedThreadsWithMessages = completedThreads.map(thread => {
    const conv = conversations.find(c => c.thread.conversation_id === thread.conversation_id)
    return {
      ...thread,
      messages: conv?.messages || []
    }
  })

  // Filter and sort completed threads
  const filteredThreads = completedThreads
    .filter(thread => {
      const matchesSearch = 
        thread.source_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thread.completion_reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thread.completion_notes?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesReason = selectedReason === "all" || thread.completion_reason === selectedReason
      
      return matchesSearch && matchesReason
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy]
      let bValue: any = b[sortBy]
      
      if (sortBy === "completed_at") {
        aValue = new Date(aValue || 0).getTime()
        bValue = new Date(bValue || 0).getTime()
      } else {
        aValue = (aValue || "").toLowerCase()
        bValue = (bValue || "").toLowerCase()
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  // Get unique completion reasons for filter
  const completionReasons = Array.from(
    new Set(completedThreads.map(thread => thread.completion_reason).filter(Boolean))
  )

  const formatDate = (dateString: string, messageType?: 'inbound-email' | 'outbound-email') => {
    if (!dateString) return 'N/A'
    try {
      const date = formatLocalTime(dateString, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }, messageType)
      return date.toLocaleString()
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid Date'
    }
  }

  const getReasonColor = (reason: string) => {
    const colors: Record<string, string> = {
      'sale_completed': 'bg-green-100 text-green-800 border-green-200',
      'lead_qualified': 'bg-blue-100 text-blue-800 border-blue-200',
      'lead_disqualified': 'bg-red-100 text-red-800 border-red-200',
      'no_response': 'bg-gray-100 text-gray-800 border-gray-200',
      'wrong_contact': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'other': 'bg-purple-100 text-purple-800 border-purple-200'
    }
    return colors[reason] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const handleThreadClick = (conversationId: string) => {
    router.push(`/dashboard/conversations/${conversationId}`)
  }

  const toggleThreadExpansion = (conversationId: string) => {
    setExpandedThreads(prev => ({
      ...prev,
      [conversationId]: !prev[conversationId]
    }))
  }

  const getThreadStats = (thread: CompletedThread): ThreadStats | null => {
    const conv = conversations.find(c => c.thread.conversation_id === thread.conversation_id)
    const messages = conv?.messages || []
    
    if (messages.length === 0) return null

    const sortedMessages = messages
      .slice()
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    
    const firstMessage = sortedMessages[0]
    const lastMessage = sortedMessages[sortedMessages.length - 1]
    
    // Use formatLocalTime for consistent timezone handling
    const firstMessageDate = formatLocalTime(firstMessage.timestamp, undefined, firstMessage.type)
    const lastMessageDate = formatLocalTime(lastMessage.timestamp, undefined, lastMessage.type)
    const duration = lastMessageDate.getTime() - firstMessageDate.getTime()
    
    const userMessages = messages.filter(m => m.type === 'inbound-email').length
    const assistantMessages = messages.filter(m => m.type === 'outbound-email').length
    
    // Calculate average response time between consecutive messages using formatLocalTime
    let avgResponseTime = 0
    if (sortedMessages.length >= 2) {
      let totalTimeDiff = 0
      let validPairs = 0
      
      for (let i = 1; i < sortedMessages.length; i++) {
        const currentMsg = sortedMessages[i]
        const previousMsg = sortedMessages[i - 1]
        
        // Use formatLocalTime for consistent timezone handling
        const currentDate = formatLocalTime(currentMsg.timestamp, undefined, currentMsg.type)
        const previousDate = formatLocalTime(previousMsg.timestamp, undefined, previousMsg.type)
        const timeDiff = currentDate.getTime() - previousDate.getTime()
        
        totalTimeDiff += timeDiff
        validPairs++
      }
      
      avgResponseTime = validPairs > 0 ? totalTimeDiff / validPairs : 0
    }

    return {
      totalMessages: messages.length,
      userMessages,
      assistantMessages,
      duration,
      avgResponseTime,
      firstMessage: firstMessage.timestamp,
      lastMessage: lastMessage.timestamp,
      firstMessageType: firstMessage.type,
      lastMessageType: lastMessage.type
    }
  }

  const formatDuration = (milliseconds: number) => {
    const totalMinutes = Math.floor(milliseconds / (1000 * 60))
    const days = Math.floor(totalMinutes / (60 * 24))
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
    const minutes = totalMinutes % 60
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const exportToCSV = () => {
    // Enhanced headers with comprehensive information
    const headers = [
      // Basic Information
      'Conversation ID',
      'Source',
      'Source Name',
      'Completion Reason',
      'Completion Notes',
      'Completed At',
      
      // Client Information
      'Client Email',
      'Client Phone',
      'Client Location',
      'Budget Range',
      'Preferred Property Types',
      'Timeline',
      
      // Conversation Summary
      'AI Summary',
      'Total Messages',
      'User Messages',
      'AI Messages',
      'Engagement Ratio (%)',
      
      // Timeline Information
      'Created At',
      'Last Updated',
      'Conversation Duration (minutes)',
      'Average Response Time (minutes)',
      
      // Performance Metrics
      'First Message Date',
      'Last Message Date',
      'Response Rate (%)',
      'Completion Status'
    ]

    const csvContent = [
      headers.join(','),
      ...filteredThreads.map(thread => {
        const threadStats = getThreadStats(thread)
        const conv = conversations.find(c => c.thread.conversation_id === thread.conversation_id)
        const messages = conv?.messages || []
        
        // Extract client email from messages
        const clientEmail = messages.length > 0 ? 
          messages.find(m => m.type === 'inbound-email')?.sender || 
          messages.find(m => m.type === 'inbound-sms')?.sender || 
          'N/A' : 'N/A'
        
        // Calculate engagement ratio
        const engagementRatio = threadStats && threadStats.totalMessages > 0 ? 
          Math.round((threadStats.userMessages / threadStats.totalMessages) * 100) : 0
        
        // Calculate response rate (percentage of user messages that got AI responses)
        const responseRate = threadStats && threadStats.userMessages > 0 ? 
          Math.round((threadStats.assistantMessages / threadStats.userMessages) * 100) : 0
        
        // Format duration in minutes
        const durationMinutes = threadStats ? Math.round(threadStats.duration / (1000 * 60)) : 0
        const avgResponseMinutes = threadStats && threadStats.avgResponseTime > 0 ? 
          Math.round(threadStats.avgResponseTime / (1000 * 60)) : 0

        return [
          // Basic Information
          thread.conversation_id || '',
          thread.source || '',
          `"${(thread.source_name || '').replace(/"/g, '""')}"`,
          thread.completion_reason || '',
          `"${(thread.completion_notes || '').replace(/"/g, '""')}"`,
          thread.completed_at || '',
          
          // Client Information
          clientEmail,
          thread.phone || '',
          `"${(thread.location || '').replace(/"/g, '""')}"`,
          `"${(thread.budget_range || '').replace(/"/g, '""')}"`,
          `"${(thread.preferred_property_types || '').replace(/"/g, '""')}"`,
          `"${(thread.timeline || '').replace(/"/g, '""')}"`,
          
          // Conversation Summary
          `"${(thread.ai_summary || '').replace(/"/g, '""')}"`,
          threadStats?.totalMessages || 0,
          threadStats?.userMessages || 0,
          threadStats?.assistantMessages || 0,
          engagementRatio,
          
          // Timeline Information
          thread.created_at || '',
          thread.last_updated || '',
          durationMinutes,
          avgResponseMinutes,
          
          // Performance Metrics
          threadStats?.firstMessage ? formatDate(threadStats.firstMessage, threadStats.firstMessageType) : '',
          threadStats?.lastMessage ? formatDate(threadStats.lastMessage, threadStats.lastMessageType) : '',
          responseRate,
          thread.completed ? 'Completed' : 'In Progress'
        ].join(',')
      })
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `completed-conversations-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg w-48 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="h-12 bg-gray-200 rounded-lg"></div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e6537] via-[#0a5a2f] to-[#0e6537] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Completed Conversations</h1>
          <p className="text-white/80 text-lg">
            View and manage your completed lead conversations
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-[#0e6537]/20 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Completed</p>
                <p className="text-2xl font-bold text-[#0e6537]">{completedThreads.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-[#0e6537]/20 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-[#0e6537]">
                  {completedThreads.filter(thread => {
                    const completedDate = new Date(thread.completed_at || '')
                    const now = new Date()
                    return completedDate.getMonth() === now.getMonth() && 
                           completedDate.getFullYear() === now.getFullYear()
                  }).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#0e6537]/20 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Sales Completed</p>
                <p className="text-2xl font-bold text-[#0e6537]">
                  {completedThreads.filter(thread => thread.completion_reason === 'sale_completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#0e6537]/20 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg. Completion Time</p>
                <p className="text-2xl font-bold text-[#0e6537]">
                  {(() => {
                    // Only consider threads with at least 2 messages
                    const completedWithMessages = completedThreadsWithMessages.filter(thread =>
                      Array.isArray(thread.messages) && thread.messages.length >= 2
                    )
                    if (completedWithMessages.length === 0) return 'N/A'

                    // Calculate average time difference between first and last message
                    const avgTime = completedWithMessages.reduce((acc, thread) => {
                      const messages = thread.messages
                        .slice() // copy
                        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                      const first = messages[0]
                      const last = messages[messages.length - 1]
                      
                      // Use formatLocalTime for consistent timezone handling
                      const firstDate = formatLocalTime(first.timestamp, undefined, first.type)
                      const lastDate = formatLocalTime(last.timestamp, undefined, last.type)
                      const diff = lastDate.getTime() - firstDate.getTime()
                      
                      return acc + diff
                    }, 0) / completedWithMessages.length

                    // Format as Xd Yh Zm
                    const totalMinutes = Math.floor(avgTime / (1000 * 60))
                    const days = Math.floor(totalMinutes / (60 * 24))
                    const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
                    const minutes = totalMinutes % 60
                    let result = ''
                    if (days > 0) result += `${days}d `
                    if (hours > 0 || days > 0) result += `${hours}h `
                    result += `${minutes}m`
                    return result.trim()
                  })()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-[#0e6537]/20 rounded-lg p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by source, reason, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537] text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Completion Reason Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537] appearance-none text-gray-900"
              >
                <option value="all" className="bg-white text-gray-900">All Reasons</option>
                {completionReasons.map(reason => (
                  <option key={reason} value={reason} className="bg-white text-gray-900">{reason?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0e6537]/50 focus:border-[#0e6537] text-gray-900"
              >
                <option value="completed_at" className="bg-white text-gray-900">Completion Date</option>
                <option value="source_name" className="bg-white text-gray-900">Source</option>
                <option value="completion_reason" className="bg-white text-gray-900">Reason</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-[#0e6537] text-white border border-[#0e6537] rounded-lg hover:bg-[#0a5a2f] transition-colors"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {filteredThreads.length === 0 ? (
            <div className="bg-white border border-[#0e6537]/20 rounded-lg p-12 text-center shadow-sm">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No completed conversations found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedReason !== 'all' 
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Completed conversations will appear here once you mark them as complete.'
                }
              </p>
            </div>
          ) : (
            filteredThreads.map((thread) => {
              const threadStats = getThreadStats(thread)
              const isExpanded = expandedThreads[thread.conversation_id]
              
              return (
                <div
                  key={thread.conversation_id}
                  className="bg-white border border-[#0e6537]/20 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => toggleThreadExpansion(thread.conversation_id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{thread.source_name}</h3>
                          {thread.completion_reason && (
                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getReasonColor(thread.completion_reason)}`}>
                              {thread.completion_reason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span>Completed: {thread.completed_at ? formatDate(thread.completed_at) : 'N/A'}</span>
                          </div>
                          
                          {thread.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4 text-green-500" />
                              <span>{thread.phone}</span>
                            </div>
                          )}
                          
                          {thread.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-red-500" />
                              <span>{thread.location}</span>
                            </div>
                          )}
                        </div>
                        
                        {thread.completion_notes && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                            <p className="text-sm text-gray-700">{thread.completion_notes}</p>
                          </div>
                        )}

                        {/* Quick Stats Preview */}
                        {threadStats && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MessageCircle className="w-4 h-4 text-blue-500" />
                              <span>{threadStats.totalMessages} messages</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4 text-orange-500" />
                              <span>{formatDuration(threadStats.duration)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="w-4 h-4 text-purple-500" />
                              <span>{threadStats.userMessages} user</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MessageSquare className="w-4 h-4 text-green-500" />
                              <span>{threadStats.assistantMessages} AI</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleThreadClick(thread.conversation_id)
                          }}
                          className="px-3 py-1 text-sm bg-[#0e6537] text-white border border-[#0e6537] rounded-lg hover:bg-[#0a5a2f] transition-colors"
                        >
                          View Full
                        </button>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && threadStats && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Conversation Timeline */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            Conversation Timeline
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Started:</span>
                              <span className="font-medium text-gray-900">{formatDate(threadStats.firstMessage, threadStats.firstMessageType)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Ended:</span>
                              <span className="font-medium text-gray-900">{formatDate(threadStats.lastMessage, threadStats.lastMessageType)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Total Duration:</span>
                              <span className="font-medium text-gray-900">{formatDuration(threadStats.duration)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Avg Response Time:</span>
                              <span className="font-medium text-gray-900">
                                {threadStats.avgResponseTime > 0 ? 
                                  formatDuration(threadStats.avgResponseTime) : 'N/A'
                                }
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Message Breakdown */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-green-500" />
                            Message Breakdown
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Total Messages:</span>
                              <span className="font-medium text-lg text-[#0e6537]">{threadStats.totalMessages}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">User Messages:</span>
                              <span className="font-medium text-blue-600">{threadStats.userMessages}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">AI Responses:</span>
                              <span className="font-medium text-[#0e6537]">{threadStats.assistantMessages}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Engagement Ratio:</span>
                              <span className="font-medium text-[#0e6537]">
                                {threadStats.totalMessages > 0 ? 
                                  Math.round((threadStats.userMessages / threadStats.totalMessages) * 100) : 0
                                }%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleThreadClick(thread.conversation_id)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#0e6537] text-white border border-[#0e6537] rounded-lg hover:bg-[#0a5a2f] transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          View Full Conversation
                        </button>
                        <button
                          onClick={() => {
                            // Copy conversation ID to clipboard
                            navigator.clipboard.writeText(thread.conversation_id)
                          }}
                          className="px-4 py-2 bg-white border border-[#0e6537] text-[#0e6537] rounded-lg hover:bg-[#0e6537]/10 transition-colors"
                        >
                          Copy ID
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
} 