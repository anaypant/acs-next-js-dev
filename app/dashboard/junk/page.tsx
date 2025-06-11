"use client"
import { useState, useEffect } from "react"
import { AlertCircle, ArrowLeft, Trash2, Check, AlertTriangle } from "lucide-react"
import { useSession } from "next-auth/react"
import type { Thread as LCPThread } from "@/app/types/lcp"
import type { Session } from "next-auth"

// Add helper function for time formatting
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

interface ThreadDisplay {
  id: string
  from: string
  email: string
  subject: string
  preview: string
  time: string
  read: boolean
  conversation_id: string
  response_id: string
  account_id: string
}

// Add DeleteConfirmationModal component
function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  conversationName,
  isDeleting
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  conversationName: string
  isDeleting: boolean
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">Delete Conversation</h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete the conversation with {conversationName}? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function JunkPage() {
  const [emails, setEmails] = useState<ThreadDisplay[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [threadToDelete, setThreadToDelete] = useState<{ id: string; name: string } | null>(null)
  const [deletingThread, setDeletingThread] = useState<string | null>(null)
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set())
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false)
  const { data: session } = useSession() as { data: Session | null }

  useEffect(() => {
    const fetchSpamThreads = async () => {
      if (!session?.user?.id) return

      try {
        const response = await fetch('/api/lcp/get_all_threads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: session.user.id })
        })
        
        if (!response.ok) throw new Error('Failed to fetch threads')
        
        const { data } = await response.json()
        const spamThreads = data
          .filter((item: any) => item.thread.spam === 'true')
          .map((item: any) => {
            const sortedMessages = [...(item.messages || [])].sort((a, b) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            const latestMessage = sortedMessages[0];

            return {
              id: item.thread.conversation_id,
              from: item.thread.source_name || 'Unknown Sender',
              email: item.thread.source || 'unknown@email.com',
              subject: latestMessage?.subject || 'No Subject',
              preview: latestMessage?.body?.slice(0, 100) || 'No preview available',
              time: latestMessage?.timestamp ? getTimeAgo(latestMessage.timestamp) : 'Unknown',
              read: item.thread.read === 'true',
              conversation_id: item.thread.conversation_id,
              response_id: latestMessage?.response_id || '',
              account_id: item.thread.associated_account
            }
          })
        
        setEmails(spamThreads)
      } catch (error) {
        console.error('Error fetching spam threads:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSpamThreads()
  }, [session?.user?.id])

  const handleMarkAsNotSpam = async (email: ThreadDisplay) => {
    setLoadingId(email.id)
    try {
      const response = await fetch('/api/lcp/mark_not_spam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: email.conversation_id,
          message_id: email.response_id,
          account_id: email.account_id
        })
      })
      if (!response.ok) throw new Error('Failed to mark as not spam')
      setEmails(emails.filter(e => e.id !== email.id))
      setSelectedEmails(prev => {
        const next = new Set(prev)
        next.delete(email.id)
        return next
      })
    } catch (err) {
      console.error(err)
      // TODO: Show error notification
    } finally {
      setLoadingId(null)
    }
  }

  const handleDeleteThread = (email: ThreadDisplay) => {
    setThreadToDelete({ id: email.id, name: email.from })
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!threadToDelete) return
    setDeletingThread(threadToDelete.id)
    try {
      const response = await fetch('/api/lcp/delete_thread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: threadToDelete.id
        })
      })

      if (!response.ok) {
        throw new Error('Failed to delete thread')
      }

      setEmails(emails.filter(e => e.id !== threadToDelete.id))
      setSelectedEmails(prev => {
        const next = new Set(prev)
        next.delete(threadToDelete.id)
        return next
      })
    } catch (error) {
      console.error('Error deleting thread:', error)
      alert('Failed to delete conversation. Please try again.')
    } finally {
      setDeletingThread(null)
      setDeleteModalOpen(false)
      setThreadToDelete(null)
    }
  }

  // New functions for bulk actions
  const toggleSelectAll = () => {
    if (selectedEmails.size === emails.length) {
      setSelectedEmails(new Set())
    } else {
      setSelectedEmails(new Set(emails.map(e => e.id)))
    }
  }

  const toggleSelectEmail = (emailId: string) => {
    setSelectedEmails(prev => {
      const next = new Set(prev)
      if (next.has(emailId)) {
        next.delete(emailId)
      } else {
        next.add(emailId)
      }
      return next
    })
  }

  const handleBulkMarkAsNotSpam = async () => {
    if (selectedEmails.size === 0) return
    setBulkActionLoading(true)
    try {
      const selectedThreads = emails.filter(e => selectedEmails.has(e.id))
      const results = await Promise.allSettled(
        selectedThreads.map(email =>
          fetch('/api/lcp/mark_not_spam', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              conversation_id: email.conversation_id,
              message_id: email.response_id,
              account_id: email.account_id
            })
          })
        )
      )

      const successfulDeletes = results
        .map((result, index) => result.status === 'fulfilled' ? selectedThreads[index].id : null)
        .filter((id): id is string => id !== null)

      setEmails(emails.filter(e => !successfulDeletes.includes(e.id)))
      setSelectedEmails(new Set())
    } catch (error) {
      console.error('Error in bulk mark as not spam:', error)
      alert('Some operations failed. Please try again.')
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedEmails.size === 0) return
    setBulkActionLoading(true)
    try {
      const selectedThreads = emails.filter(e => selectedEmails.has(e.id))
      const results = await Promise.allSettled(
        selectedThreads.map(email =>
          fetch('/api/lcp/delete_thread', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              conversation_id: email.id
            })
          })
        )
      )

      const successfulDeletes = results
        .map((result, index) => result.status === 'fulfilled' ? selectedThreads[index].id : null)
        .filter((id): id is string => id !== null)

      setEmails(emails.filter(e => !successfulDeletes.includes(e.id)))
      setSelectedEmails(new Set())
    } catch (error) {
      console.error('Error in bulk delete:', error)
      alert('Some operations failed. Please try again.')
    } finally {
      setBulkActionLoading(false)
      setBulkDeleteModalOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1] flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1]">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gradient-to-r hover:from-[#0e6537]/10 hover:to-[#157a42]/10 transition-all duration-200 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold">Junk Emails</h1>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedEmails.size > 0 && (
          <div className="mb-4 bg-white rounded-lg border shadow-sm p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedEmails.size} {selectedEmails.size === 1 ? 'email' : 'emails'} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkMarkAsNotSpam}
                disabled={bulkActionLoading}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 disabled:opacity-50"
              >
                <AlertCircle className="h-4 w-4" />
                {bulkActionLoading ? 'Processing...' : 'Mark Selected as Not Spam'}
              </button>
              <button
                onClick={() => setBulkDeleteModalOpen(true)}
                disabled={bulkActionLoading}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                {bulkActionLoading ? 'Processing...' : 'Delete Selected'}
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg border shadow-sm divide-y">
          {emails.length === 0 && (
            <div className="p-8 text-center text-gray-500">No junk emails! 🎉</div>
          )}
          {emails.length > 0 && (
            <div className="p-4 border-b flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedEmails.size === emails.length}
                onChange={toggleSelectAll}
                className="h-4 w-4 rounded border-gray-300 text-[#0e6537] focus:ring-[#0e6537]"
              />
              <span className="text-sm text-gray-600">Select All</span>
            </div>
          )}
          {emails.map(email => (
            <div key={email.id} className={`p-4 hover:bg-[#0e6537]/5 ${!email.read ? 'bg-[#e6f5ec]' : ''}`}>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedEmails.has(email.id)}
                  onChange={() => toggleSelectEmail(email.id)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0e6537] focus:ring-[#0e6537]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{email.from}</span>
                      <span className="text-xs text-gray-500">{email.email}</span>
                    </div>
                    <span className="text-xs text-gray-400">{email.time}</span>
                  </div>
                  <div className="mb-1">
                    <p className={`text-sm ${!email.read ? 'font-semibold' : ''}`}>{email.subject}</p>
                  </div>
                  <div className="mb-2">
                    <p className="text-xs text-gray-600">{email.preview}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMarkAsNotSpam(email)}
                      disabled={loadingId === email.id || bulkActionLoading}
                      className="flex items-center gap-1 px-3 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 disabled:opacity-50"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {loadingId === email.id ? 'Marking...' : 'Mark as Not Spam'}
                    </button>
                    <button
                      onClick={() => handleDeleteThread(email)}
                      disabled={deletingThread === email.id || bulkActionLoading}
                      className="flex items-center gap-1 px-3 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingThread === email.id ? 'Deleting...' : 'Delete'}
                    </button>
                    {!email.read && (
                      <div className="w-2 h-2 bg-[#0e6537] rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Single Delete Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setThreadToDelete(null)
        }}
        onConfirm={confirmDelete}
        conversationName={threadToDelete?.name || 'Unknown'}
        isDeleting={deletingThread !== null}
      />

      {/* Bulk Delete Modal */}
      <DeleteConfirmationModal
        isOpen={bulkDeleteModalOpen}
        onClose={() => setBulkDeleteModalOpen(false)}
        onConfirm={handleBulkDelete}
        conversationName={`${selectedEmails.size} selected emails`}
        isDeleting={bulkActionLoading}
      />
    </div>
  )
} 