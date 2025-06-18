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

interface CompletedThread extends Thread {
  completion_reason?: string
  completion_notes?: string
  completed_at?: string
}

interface ExpandedThread {
  [key: string]: boolean
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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

  const getThreadStats = (thread: CompletedThread) => {
    const conv = conversations.find(c => c.thread.conversation_id === thread.conversation_id)
    const messages = conv?.messages || []
    
    if (messages.length === 0) return null

    const sortedMessages = messages
      .slice()
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    
    const firstMessage = sortedMessages[0]
    const lastMessage = sortedMessages[sortedMessages.length - 1]
    const duration = new Date(lastMessage.timestamp).getTime() - new Date(firstMessage.timestamp).getTime()
    
    const userMessages = messages.filter(m => m.type === 'inbound-email').length
    const assistantMessages = messages.filter(m => m.type === 'outbound-email').length
    
    // Calculate average response time between consecutive messages
    let avgResponseTime = 0
    if (sortedMessages.length >= 2) {
      let totalTimeDiff = 0
      let validPairs = 0
      
      for (let i = 1; i < sortedMessages.length; i++) {
        const currentMsg = sortedMessages[i]
        const previousMsg = sortedMessages[i - 1]
        const timeDiff = new Date(currentMsg.timestamp).getTime() - new Date(previousMsg.timestamp).getTime()
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
      lastMessage: lastMessage.timestamp
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
          threadStats?.firstMessage || '',
          threadStats?.lastMessage || '',
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
      <div className="min-h-screen bg-gradient-to-br from-[#0a5a2f] via-[#0e6537] to-[#157a42]">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded-lg w-48 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="h-12 bg-white/10 rounded-lg"></div>
              <div className="h-12 bg-white/10 rounded-lg"></div>
              <div className="h-12 bg-white/10 rounded-lg"></div>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-white/10 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a5a2f] via-[#0e6537] to-[#157a42]">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Completed Conversations</h1>
            <p className="text-white/80">View and manage your completed lead conversations</p>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-white/70">Total Completed</p>
                <p className="text-2xl font-bold text-white">{completedThreads.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-white/70">This Month</p>
                <p className="text-2xl font-bold text-white">
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

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <User className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-white/70">Sales Completed</p>
                <p className="text-2xl font-bold text-white">
                  {completedThreads.filter(thread => thread.completion_reason === 'sale_completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-white/70">Avg. Completion Time</p>
                <p className="text-2xl font-bold text-white">
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
                      const diff = new Date(last.timestamp).getTime() - new Date(first.timestamp).getTime()
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
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by source, reason, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/50"
              />
            </div>

            {/* Completion Reason Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent appearance-none text-white"
              >
                <option value="all" className="bg-[#0a5a2f] text-white">All Reasons</option>
                {completionReasons.map(reason => (
                  <option key={reason} value={reason} className="bg-[#0a5a2f] text-white">{reason?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-transparent text-white"
              >
                <option value="completed_at" className="bg-[#0a5a2f] text-white">Completion Date</option>
                <option value="source_name" className="bg-[#0a5a2f] text-white">Source</option>
                <option value="completion_reason" className="bg-[#0a5a2f] text-white">Reason</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors text-white"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {filteredThreads.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-12 text-center border border-white/20 shadow-sm">
              <MessageSquare className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No completed conversations found</h3>
              <p className="text-white/70">
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
                  className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => toggleThreadExpansion(thread.conversation_id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-white">{thread.source_name}</h3>
                          {thread.completion_reason && (
                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getReasonColor(thread.completion_reason)}`}>
                              {thread.completion_reason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-white/70">
                            <Calendar className="w-4 h-4" />
                            <span>Completed: {thread.completed_at ? formatDate(thread.completed_at) : 'N/A'}</span>
                          </div>
                          
                          {thread.phone && (
                            <div className="flex items-center gap-2 text-sm text-white/70">
                              <Phone className="w-4 h-4" />
                              <span>{thread.phone}</span>
                            </div>
                          )}
                          
                          {thread.location && (
                            <div className="flex items-center gap-2 text-sm text-white/70">
                              <MapPin className="w-4 h-4" />
                              <span>{thread.location}</span>
                            </div>
                          )}
                        </div>
                        
                        {thread.completion_notes && (
                          <div className="bg-white/5 rounded-lg p-3 mb-4 border border-white/10">
                            <p className="text-sm text-white/80">{thread.completion_notes}</p>
                          </div>
                        )}

                        {/* Quick Stats Preview */}
                        {threadStats && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-sm text-white/70">
                              <MessageCircle className="w-4 h-4" />
                              <span>{threadStats.totalMessages} messages</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/70">
                              <Clock className="w-4 h-4" />
                              <span>{formatDuration(threadStats.duration)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/70">
                              <User className="w-4 h-4" />
                              <span>{threadStats.userMessages} user</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/70">
                              <MessageSquare className="w-4 h-4" />
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
                          className="px-3 py-1 text-sm bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
                        >
                          View Full
                        </button>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-white/50" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-white/50" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && threadStats && (
                    <div className="border-t border-white/10 p-6 bg-white/5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Conversation Timeline */}
                        <div>
                          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Conversation Timeline
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Started:</span>
                              <span className="font-medium text-white">{formatDate(threadStats.firstMessage)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Ended:</span>
                              <span className="font-medium text-white">{formatDate(threadStats.lastMessage)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Total Duration:</span>
                              <span className="font-medium text-white">{formatDuration(threadStats.duration)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Avg Response Time:</span>
                              <span className="font-medium text-white">
                                {threadStats.avgResponseTime > 0 ? 
                                  formatDuration(threadStats.avgResponseTime) : 'N/A'
                                }
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Message Breakdown */}
                        <div>
                          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Message Breakdown
                          </h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-white/70">Total Messages:</span>
                              <span className="font-medium text-lg text-white">{threadStats.totalMessages}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-white/70">User Messages:</span>
                              <span className="font-medium text-blue-400">{threadStats.userMessages}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-white/70">AI Responses:</span>
                              <span className="font-medium text-green-400">{threadStats.assistantMessages}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-white/70">Engagement Ratio:</span>
                              <span className="font-medium text-white">
                                {threadStats.totalMessages > 0 ? 
                                  Math.round((threadStats.userMessages / threadStats.totalMessages) * 100) : 0
                                }%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
                        <button
                          onClick={() => handleThreadClick(thread.conversation_id)}
                          className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          View Full Conversation
                        </button>
                        <button
                          onClick={() => {
                            // Copy conversation ID to clipboard
                            navigator.clipboard.writeText(thread.conversation_id)
                          }}
                          className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
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