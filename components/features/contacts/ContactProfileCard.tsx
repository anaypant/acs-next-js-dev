"use client"

import { Edit, Trash2 } from "lucide-react"
import type { Contact } from "@/types/contact"

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
          {formatLastContact(contact.lastContact)}
        </p>
      </div>
    </div>
  )
} 