"use client"

import { X, Phone, Mail, User2, Building2, Home, Calendar, MapPin, BadgeCheck, Target } from "lucide-react"
import type { Contact } from "@/types/contact"

interface ContactDetailProfileCardProps {
  contact: Contact
  onClose: () => void
  onEdit: (contact: Contact) => void
}

export function ContactDetailProfileCard({ 
  contact, 
  onClose, 
  onEdit 
}: ContactDetailProfileCardProps) {
  
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{contact.name}</h2>
                <p className="text-sm text-muted-foreground">{contact.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Status and Type Row */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-1">Status</p>
              <div className="flex items-center gap-2">
                {contact.status === 'client' ? (
                  <>
                    <BadgeCheck className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">Client</span>
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 text-status-error" />
                    <span className="text-sm font-medium text-muted-foreground">Lead</span>
                  </>
                )}
              </div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-1">Type</p>
              <p className="text-sm font-medium text-foreground capitalize">{contact.type}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Contact Information</h3>
            
            {contact.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Phone</p>
                  <p className="text-sm text-foreground">{contact.phone}</p>
                </div>
              </div>
            )}

            {contact.location && (
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Location</p>
                  <p className="text-sm text-foreground">{contact.location}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Last Contact</p>
                <p className="text-sm text-foreground">{formatLastContact(contact.lastContact)}</p>
              </div>
            </div>
          </div>

          {/* Property Details */}
          {(contact.budgetRange || contact.propertyTypes) && (
            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Property Details</h3>
              
              {contact.budgetRange && (
                <div className="flex items-center gap-3">
                  <Home className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Budget Range</p>
                    <p className="text-sm text-foreground">{contact.budgetRange}</p>
                  </div>
                </div>
              )}

              {contact.propertyTypes && (
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Property Types</p>
                    <p className="text-sm text-foreground">{contact.propertyTypes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {contact.notes && (
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-semibold text-foreground border-b border-border pb-2">Notes</h3>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-foreground leading-relaxed">{contact.notes}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose()
                onEdit(contact)
              }}
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Edit Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 