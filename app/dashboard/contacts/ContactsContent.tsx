"use client"

import { Search, Calendar, Plus, Phone, Mail, User2, Building2, Home, X, Edit, Trash2, AlertTriangle, Save } from "lucide-react"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useContactsData } from "@/hooks/useCentralizedDashboardData"
import { useContact, useContactForm, type Contact } from "@/hooks/useContact"
import { LoadingSpinner } from "@/components/common/Feedback/LoadingSpinner"
import { cn } from "@/lib/utils"
import type { Conversation } from "@/types/conversation"
import { toast } from 'react-hot-toast'

export default function ContactsContent() {
  const router = useRouter()
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showNewContactModal, setShowNewContactModal] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null)
  const [showSaveSuccessModal, setShowSaveSuccessModal] = useState(false)
  const [savedContactName, setSavedContactName] = useState('')

  // Use contacts data hook to get real conversations
  const { conversations, loading: conversationsLoading, error: conversationsError } = useContactsData({
    autoRefresh: true,
    refreshInterval: 30000,
  })

  // Use contact management hook
  const { 
    contacts: manualContacts, 
    loading: contactsLoading, 
    error: contactsError,
    createContact,
    updateContact,
    deleteContact,
    fetchContacts,
  } = useContact()

  // Use contact form hook
  const { formData, errors, updateField, validateForm, resetForm } = useContactForm()

  // Process conversations into contacts
  const conversationContacts = useMemo((): Contact[] => {
    if (!conversations) return []

    // Group conversations by email to create unique contacts
    const contactMap = new Map<string, Contact>()

    conversations.forEach((conversation: Conversation) => {
      const { thread } = conversation
      const email = thread.client_email

      if (!email) return

      const existingContact = contactMap.get(email)

      if (existingContact) {
        // Update existing contact with latest information
        existingContact.conversationCount++
        if (new Date(thread.lastMessageAt) > new Date(existingContact.lastContact)) {
          existingContact.lastContact = thread.lastMessageAt
          existingContact.name = thread.lead_name || existingContact.name
          existingContact.phone = thread.phone || existingContact.phone
          existingContact.location = thread.location || existingContact.location
          existingContact.budgetRange = thread.budget_range || existingContact.budgetRange
          existingContact.propertyTypes = thread.preferred_property_types || existingContact.propertyTypes
        }
      } else {
        // Create new contact
        const contact: Contact = {
          id: thread.conversation_id,
          name: thread.lead_name || "Unknown Contact",
          email: email,
          phone: thread.phone,
          location: thread.location,
          type: determineContactType(thread),
          status: determineContactStatus(thread),
          lastContact: thread.lastMessageAt,
          notes: thread.ai_summary,
          conversationCount: 1,
          budgetRange: thread.budget_range,
          propertyTypes: thread.preferred_property_types,
          createdAt: thread.createdAt,
          updatedAt: thread.updatedAt,
          userId: session?.user?.email || '',
          isManual: false, // Mark as conversation-derived contact
        }
        contactMap.set(email, contact)
      }
    })

    return Array.from(contactMap.values())
  }, [conversations, session?.user?.email])

  // Combine conversation contacts with manual contacts
  const allContacts = useMemo(() => {
    const manualContactEmails = new Set(manualContacts.map(c => c.email))
    const filteredConversationContacts = conversationContacts.filter(c => !manualContactEmails.has(c.email))
    return [...manualContacts, ...filteredConversationContacts]
  }, [manualContacts, conversationContacts])

  // Filter contacts based on search term and filters
  const filteredContacts = useMemo(() => {
    return allContacts.filter((contact) => {
      const matchesSearch =
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.phone && contact.phone.includes(searchTerm)) ||
        (contact.location && contact.location.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = typeFilter === 'all' || contact.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [allContacts, searchTerm, typeFilter, statusFilter]);

  // Helper functions
  function determineContactType(thread: any): "buyer" | "seller" | "investor" | "other" {
    const summary = (thread.ai_summary || "").toLowerCase()
    const propertyTypes = (thread.preferred_property_types || "").toLowerCase()

    if (summary.includes("buy") || summary.includes("purchase") || propertyTypes.includes("residential")) {
      return "buyer"
    } else if (summary.includes("sell") || summary.includes("listing")) {
      return "seller"
    } else if (summary.includes("invest") || propertyTypes.includes("investment")) {
      return "investor"
    }
    return "other"
  }

  function determineContactStatus(thread: any): "active" | "inactive" | "completed" {
    if (thread.completed) return "completed"
    if (thread.spam || thread.flag) return "inactive"
    return "active"
  }

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

  function getTypeIcon(type: string) {
    switch (type) {
      case "buyer":
        return <Home className="h-4 w-4" />
      case "seller":
        return <Building2 className="h-4 w-4" />
      case "investor":
        return <User2 className="h-4 w-4" />
      default:
        return <User2 className="h-4 w-4" />
    }
  }

  // Handle new contact submission
  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const result = await createContact(formData)
    
    if (result.success) {
      console.log('✅ Contact created successfully!')
      setShowNewContactModal(false)
      resetForm()
    } else {
      console.error('❌ Failed to create contact:', result.error)
      // In a real app, you'd show a toast notification here
      alert(`Failed to create contact: ${result.error}`)
    }
  }

  // Handle edit contact
  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact)
    // Pre-fill form with contact data
    Object.entries(contact).forEach(([key, value]) => {
      if (key in formData) {
        updateField(key as keyof typeof formData, value || '')
      }
    })
    setShowNewContactModal(true)
  }

  // Handle update contact
  const handleUpdateContact = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingContact || !validateForm()) {
      return
    }

    const result = await updateContact({
      id: editingContact.id,
      ...formData
    })
    
    if (result.success) {
      console.log('✅ Contact updated successfully!')
      setShowNewContactModal(false)
      setEditingContact(null)
      resetForm()
    } else {
      console.error('❌ Failed to update contact:', result.error)
      // In a real app, you'd show a toast notification here
      alert(`Failed to update contact: ${result.error}`)
    }
  }

  // Handle delete contact
  const handleDeleteContact = (contactId: string) => {
    const contact = allContacts.find(c => c.id === contactId)
    if (contact) {
      setContactToDelete(contact)
      setShowDeleteModal(true)
    }
  }

  // Confirm delete
  const confirmDelete = async () => {
    if (contactToDelete) {
      const result = await deleteContact(contactToDelete.id)
      if (result.success) {
        console.log('✅ Contact deleted successfully!')
        setShowDeleteModal(false)
        setContactToDelete(null)
      } else {
        console.error('❌ Failed to delete contact:', result.error)
        // In a real app, you'd show a toast notification here
        alert(`Failed to delete contact: ${result.error}`)
      }
    }
  }

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false)
    setContactToDelete(null)
  }

  // Update the handleSaveAsContact function to refresh contacts after saving
  const handleSaveAsContact = async (contact: Contact) => {
    try {
      // Pre-fill the form with all available contact data, setting status to active
      const contactData = {
        name: contact.name,
        email: contact.email,
        phone: contact.phone || '',
        location: contact.location || '',
        type: contact.type,
        status: 'active' as const, // Always set to active when saving as contact
        notes: contact.notes || '',
        budgetRange: contact.budgetRange || '',
        propertyTypes: contact.propertyTypes || '',
      }

      // Create the contact
      const result = await createContact(contactData)
      
      if (result.success) {
        console.log('✅ Contact saved successfully!')
        
        // Refresh the contacts to get the updated list
        await fetchContacts()
        
        // Show success popup
        setSavedContactName(contact.name)
        setShowSaveSuccessModal(true)
        
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
          setShowSaveSuccessModal(false)
          setSavedContactName('')
        }, 3000)
      } else {
        console.error('❌ Failed to save contact:', result.error)
        toast.error(`Failed to save contact: ${result.error}`, {
          duration: 4000, // 4 seconds for errors
          position: 'top-right',
        })
      }
    } catch (error) {
      console.error('❌ Error saving contact:', error)
      toast.error('An error occurred while saving the contact', {
        duration: 4000,
        position: 'top-right',
      })
    }
  }

  const loading = conversationsLoading || contactsLoading
  const error = conversationsError || contactsError

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-background-muted">
        <LoadingSpinner size="lg" text="Loading contacts..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-background-muted">
        <div className="text-center p-6 bg-card rounded-lg shadow-md">
          <p className="text-status-error font-semibold mb-2">Error loading contacts</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background-muted">
      <div className="flex-shrink-0 p-6 pb-4">
        <h1 className="text-4xl font-extrabold text-card-foreground mb-2 tracking-tight">Contacts</h1>
        <p className="text-lg text-muted-foreground">
          Manage and view client information extracted from conversations.
          {allContacts.length > 0 && ` Found ${allContacts.length} unique contacts.`}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6">
        {/* Search and filter controls */}
        <div className="bg-card p-5 rounded-xl border border-border shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
          {/* Search input with icon */}
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-light" />
            <input
              type="text"
              placeholder="Search contacts by name, email, phone, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-midnight-700 focus:border-midnight-700 text-card-foreground bg-background placeholder-text-muted-light"
            />
          </div>

          {/* Filter controls */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-midnight-700 focus:border-midnight-700 text-card-foreground bg-background"
            >
              <option value="all">All Types</option>
              <option value="buyer">Buyers</option>
              <option value="seller">Sellers</option>
              <option value="investor">Investors</option>
              <option value="other">Other</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-midnight-700 focus:border-midnight-700 text-card-foreground bg-background"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="completed">Completed</option>
            </select>

            <button 
              onClick={() => {
                setEditingContact(null)
                resetForm()
                setShowNewContactModal(true)
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-midnight-700 to-midnight-600 text-white rounded-lg shadow-md hover:from-midnight-600 hover:to-midnight-700 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap font-medium"
            >
              <Plus className="h-5 w-5" />
              New Contact
            </button>
          </div>
        </div>

        {/* Contacts grid with responsive layout */}
        {filteredContacts.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border shadow-sm">
            <p className="text-muted-foreground text-xl font-medium mb-2">
              {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                ? "No contacts match your filters"
                : "No contacts found"}
            </p>
            <p className="text-muted-light text-base">
              {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Contacts will appear here as you receive conversations"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-card rounded-xl border border-border shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col relative group"
              >
                {/* Action buttons overlay */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                  {/* Show "Save as Contact" button only for conversation-derived contacts that aren't already saved */}
                  {!contact.isManual && !manualContacts.some(manualContact => manualContact.email === contact.email) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSaveAsContact(contact)
                      }}
                      className="p-1.5 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors"
                      title="Save as contact"
                    >
                      <Save className="h-3 w-3 text-status-success" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditContact(contact)
                    }}
                    className="p-1.5 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors"
                    title="Edit contact"
                  >
                    <Edit className="h-3 w-3 text-muted-foreground" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteContact(contact.id)
                    }}
                    className="p-1.5 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors"
                    title="Delete contact"
                  >
                    <Trash2 className="h-3 w-3 text-status-error" />
                  </button>
                </div>

                <div 
                  className="p-5 flex-grow cursor-pointer"
                  onClick={() => router.push(`/dashboard/conversations/${contact.id}`)}
                >
                  {/* Contact header with name and status badges */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-card-foreground text-xl leading-tight">{contact.name}</h3>
                      <p className="text-sm text-muted-foreground">{contact.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {/* Verified badge for manual contacts */}
                      {contact.isManual && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-midnight-50 text-midnight-700 border border-midnight-200 flex items-center gap-1">
                          <User2 className="h-3 w-3" />
                          VERIFIED*
                        </span>
                      )}
                      {/* Status badge */}
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-semibold",
                          contact.status === "active"
                            ? "bg-status-success-light text-status-success-text"
                            : contact.status === "completed"
                              ? "bg-status-info-light text-status-info-text"
                              : "bg-muted text-muted-foreground"
                        )}
                      >
                        {contact.status.toUpperCase()}
                      </span>
                      {/* Type badge */}
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1",
                          contact.type === "buyer"
                            ? "bg-contact-buyer-light text-contact-buyer-text"
                            : contact.type === "seller"
                              ? "bg-contact-seller-light text-contact-seller-text"
                              : contact.type === "investor"
                                ? "bg-contact-investor-light text-contact-investor-text"
                                : "bg-muted text-muted-foreground"
                        )}
                      >
                        {getTypeIcon(contact.type)}
                        {contact.type.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Contact details with icons */}
                  <div className="mt-4 space-y-2 text-muted-foreground">
                    {contact.phone && (
                      <div className="flex items-center gap-3 text-base">
                        <Phone className="h-4 w-4 text-muted-light flex-shrink-0" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-base">
                      <Mail className="h-4 w-4 text-muted-light flex-shrink-0" />
                      <span>{contact.email}</span>
                    </div>
                    {contact.location && (
                      <div className="flex items-center gap-3 text-base">
                        <Home className="h-4 w-4 text-muted-light flex-shrink-0" />
                        <span>{contact.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-base">
                      <Calendar className="h-4 w-4 text-muted-light flex-shrink-0" />
                      <span>Last contact: {formatLastContact(contact.lastContact)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-base">
                      <User2 className="h-4 w-4 text-muted-light flex-shrink-0" />
                      <span>
                        {contact.conversationCount} conversation{contact.conversationCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Additional information */}
                  {(contact.budgetRange || contact.propertyTypes) && (
                    <div className="mt-5 pt-4 border-t border-border">
                      {contact.budgetRange && (
                        <p className="text-sm text-muted-foreground mb-1">
                          <span className="font-semibold text-card-foreground">Budget:</span> {contact.budgetRange}
                        </p>
                      )}
                      {contact.propertyTypes && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold text-card-foreground">Interested in:</span> {contact.propertyTypes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Contact notes section */}
                  {contact.notes && (
                    <div className="mt-5 pt-4 border-t border-border">
                      <p className="text-sm text-muted-light line-clamp-2">{contact.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New/Edit Contact Modal */}
      {showNewContactModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl border border-border shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-card-foreground">
                  {editingContact ? 'Edit Contact' : 'New Contact'}
                </h2>
                <button
                  onClick={() => {
                    setShowNewContactModal(false)
                    setEditingContact(null)
                    resetForm()
                  }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={editingContact ? handleUpdateContact : handleSubmitContact} className="space-y-4">
                {/* Name and Email in a row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className={cn(
                        "w-full px-4 py-3 rounded-lg border transition-all duration-200",
                        "focus:ring-2 focus:ring-primary focus:border-primary",
                        "text-card-foreground bg-background",
                        errors.name ? "border-status-error focus:border-status-error focus:ring-status-error" : "border-border"
                      )}
                      placeholder="Enter contact name"
                    />
                    {errors.name && <p className="text-sm text-status-error mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className={cn(
                        "w-full px-4 py-3 rounded-lg border transition-all duration-200",
                        "focus:ring-2 focus:ring-primary focus:border-primary",
                        "text-card-foreground bg-background",
                        errors.email ? "border-status-error focus:border-status-error focus:ring-status-error" : "border-border"
                      )}
                      placeholder="Enter email address"
                    />
                    {errors.email && <p className="text-sm text-status-error mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Phone and Location in a row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-card-foreground mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className={cn(
                        "w-full px-4 py-3 rounded-lg border transition-all duration-200",
                        "focus:ring-2 focus:ring-primary focus:border-primary",
                        "text-card-foreground bg-background",
                        errors.phone ? "border-status-error focus:border-status-error focus:ring-status-error" : "border-border"
                      )}
                      placeholder="Enter phone number"
                    />
                    {errors.phone && <p className="text-sm text-status-error mt-1">{errors.phone}</p>}
                  </div>

                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-card-foreground mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      value={formData.location}
                      onChange={(e) => updateField('location', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary text-card-foreground bg-background"
                      placeholder="Enter location"
                    />
                  </div>
                </div>

                {/* Type and Status in a row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Type */}
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-card-foreground mb-2">
                      Type
                    </label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => updateField('type', e.target.value as any)}
                      className="w-full px-4 py-3 rounded-lg border border-border transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary text-card-foreground bg-background"
                    >
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                      <option value="investor">Investor</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-card-foreground mb-2">
                      Status
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => updateField('status', e.target.value as any)}
                      className="w-full px-4 py-3 rounded-lg border border-border transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary text-card-foreground bg-background"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Budget Range and Property Types in a row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Budget Range */}
                  <div>
                    <label htmlFor="budgetRange" className="block text-sm font-medium text-card-foreground mb-2">
                      Budget Range
                    </label>
                    <input
                      type="text"
                      id="budgetRange"
                      value={formData.budgetRange}
                      onChange={(e) => updateField('budgetRange', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary text-card-foreground bg-background"
                      placeholder="e.g., $300K-500K"
                    />
                  </div>

                  {/* Property Types */}
                  <div>
                    <label htmlFor="propertyTypes" className="block text-sm font-medium text-card-foreground mb-2">
                      Property Types
                    </label>
                    <input
                      type="text"
                      id="propertyTypes"
                      value={formData.propertyTypes}
                      onChange={(e) => updateField('propertyTypes', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary text-card-foreground bg-background"
                      placeholder="e.g., Single Family, Condo"
                    />
                  </div>
                </div>

                {/* Notes - full width */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-card-foreground mb-2">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-border transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary text-card-foreground bg-background resize-none"
                    placeholder="Add notes about this contact..."
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewContactModal(false)
                      setEditingContact(null)
                      resetForm()
                    }}
                    className="flex-1 px-4 py-3 border border-border rounded-lg text-card-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-midnight-700 to-midnight-600 text-white rounded-lg hover:from-midnight-600 hover:to-midnight-700 transition-all duration-200 font-medium"
                  >
                    {editingContact ? 'Update Contact' : 'Create Contact'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && contactToDelete && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl border border-border shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-status-error/10 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-status-error" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground">Delete Contact</h3>
                  <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
                </div>
              </div>
              
              <div className="mb-6 p-4 bg-background-muted rounded-lg">
                <p className="text-card-foreground font-medium">{contactToDelete.name}</p>
                <p className="text-sm text-muted-foreground">{contactToDelete.email}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2.5 border border-border rounded-lg text-card-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-status-error text-white rounded-lg hover:bg-status-error/90 transition-colors font-medium"
                >
                  Delete Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Success Modal */}
      {showSaveSuccessModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl border border-border shadow-lg max-w-md w-full">
            <div className="p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-status-success/10 rounded-full">
                  <Save className="h-8 w-8 text-status-success" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                Contact Saved!
              </h3>
              
              <p className="text-muted-foreground mb-3">
                "{savedContactName}" has been added to your contacts.
              </p>
              
              {/* Verified Contacts indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-midnight-50 border border-midnight-200 rounded-full text-sm font-medium text-midnight-700">
                <User2 className="h-4 w-4" />
                Verified Contacts*
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => {
                    setShowSaveSuccessModal(false)
                    setSavedContactName('')
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-midnight-700 to-midnight-600 text-white rounded-lg hover:from-midnight-600 hover:to-midnight-700 transition-all duration-200 font-medium"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
