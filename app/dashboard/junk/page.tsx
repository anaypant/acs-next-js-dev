"use client"
import { useState, useEffect } from "react"
import { AlertCircle, ArrowLeft } from "lucide-react"
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

export default function JunkPage() {
  const [emails, setEmails] = useState<ThreadDisplay[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingId, setLoadingId] = useState<string | null>(null)
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
    } catch (err) {
      console.error(err)
      // TODO: Show error notification
    } finally {
      setLoadingId(null)
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

        <div className="bg-white rounded-lg border shadow-sm divide-y">
          {emails.length === 0 && (
            <div className="p-8 text-center text-gray-500">No junk emails! 🎉</div>
          )}
          {emails.map(email => (
            <div key={email.id} className={`p-4 hover:bg-[#0e6537]/5 ${!email.read ? 'bg-[#e6f5ec]' : ''}`}>
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
                  disabled={loadingId === email.id}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 disabled:opacity-50"
                >
                  <AlertCircle className="h-4 w-4" />
                  {loadingId === email.id ? 'Marking...' : 'Mark as Not Spam'}
                </button>
                {!email.read && (
                  <div className="w-2 h-2 bg-[#0e6537] rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 