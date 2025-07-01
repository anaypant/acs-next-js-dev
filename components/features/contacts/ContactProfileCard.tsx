"use client"

import { Edit, Trash2 } from "lucide-react"
import { useMemo } from "react"
import type { Contact } from "@/types/contact"
import { useContact } from "@/hooks/useContact"

interface ContactProfileCardProps {
  contact: Contact
  onEdit: (contact: Contact) => void
  onDelete: (contactId: string) => void
  onClick: (contact: Contact) => void
}

export function ContactProfileCard({ 
  contact, 
  onEdit, 
  onDelete, 
  onClick 
}: ContactProfileCardProps) {
  
  // Get unified contact data for this contact
  const { unifiedContacts } = useContact()
  
  // Find the unified contact data for this contact
  const unifiedContact = useMemo(() => {
    return unifiedContacts.find(uc => uc.contact.id === contact.id || uc.contact.email === contact.email)
  }, [unifiedContacts, contact])
  
  function formatLastContact(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24)
      return `${days} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // Get the most accurate last contact time
  const lastContactTime = useMemo(() => {
    if (unifiedContact && unifiedContact.conversations.length > 0) {
      // Use the most recent conversation's last message time
      const mostRecentConversation = unifiedContact.conversations.reduce((latest, current) => {
        const latestTime = new Date(latest.thread.lastMessageAt).getTime()
        const currentTime = new Date(current.thread.lastMessageAt).getTime()
        return currentTime > latestTime ? current : latest
      })
      return formatLastContact(mostRecentConversation.thread.lastMessageAt)
    }
    // Fall back to contact's lastContact
    return formatLastContact(contact.lastContact)
  }, [unifiedContact, contact.lastContact])

  return (
    <div
      className="bg-card border border-border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(contact)}
    >
      {/* Name and action buttons on one line */}
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-semibold text-foreground truncate flex-1 text-sm">{contact.name}</h3>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Action buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(contact)
            }}
            className="p-1 bg-background/80 backdrop-blur-sm rounded hover:bg-background transition-colors"
            title="Edit contact"
          >
            <Edit className="w-3 h-3 text-muted-foreground" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(contact.id)
            }}
            className="p-1 bg-background/80 backdrop-blur-sm rounded hover:bg-background transition-colors"
            title="Delete contact"
          >
            <Trash2 className="w-3 h-3 text-status-error" />
          </button>
        </div>
      </div>

      {/* Simplified contact info */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground truncate">{contact.email}</p>
        {contact.phone && (
          <p className="text-xs text-muted-foreground truncate">{contact.phone}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {lastContactTime}
        </p>
      </div>
    </div>
  )
} 