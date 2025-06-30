"use client"

import { Search, Calendar, Plus, Phone, Mail, User2, Building2, Home, X, Edit, Trash2, AlertTriangle, Save, CheckCircle, Info, MapPin, Loader2, Sparkles, BadgeCheck, Target } from "lucide-react"
import { useState, useMemo, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useContactsData } from "@/hooks/useCentralizedDashboardData"
import { useContact, useContactForm } from "@/hooks/useContact"
import { useLocation } from "@/hooks/useLocation"
import type { Contact, CreateContactData } from "@/types/contact"
import type { LocationSuggestion } from "@/types/location"
import { LoadingSpinner } from "@/components/common/Feedback/LoadingSpinner"
import { ErrorBoundary } from "@/components/common/Feedback/ErrorBoundary"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Conversation } from "@/types/conversation"
import { toast } from 'react-hot-toast'
import { ContactProfileCard } from "@/components/features/contacts/ContactProfileCard"
import { ContactDetailProfileCard } from "@/components/features/contacts/ContactDetailProfileCard"
import { ContactEditProfileCard } from "@/components/features/contacts/ContactEditProfileCard"

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
  const [showVerifiedTooltip, setShowVerifiedTooltip] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

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

  // Use location autocomplete hook
  const {
    isDropdownOpen: isLocationDropdownOpen,
    suggestions: locationSuggestions,
    isLoading: isLocationLoading,
    handleLocationChange,
    selectLocation,
    closeDropdown: closeLocationDropdown
  } = useLocation()

  // Use enhanced contact form hook
  const { 
    formData, 
    errors, 
    isSubmitting,
    updateField, 
    validateForm, 
    validateField,
    resetForm, 
    setSubmitting,
  } = useContactForm()

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

  function determineContactStatus(thread: any): "client" | "lead" {
    if (thread.completed || thread.status === 'completed') {
      return "client"
    }
    return "lead"
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

  // Handle edit contact
  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact)
    setShowNewContactModal(true)
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
        toast.success(`Contact "${contactToDelete.name}" deleted successfully!`, {
          duration: 3000,
          position: 'top-right',
        });
        setShowDeleteModal(false)
        setContactToDelete(null)
      } else {
        console.error('❌ Failed to delete contact:', result.error)
        toast.error(`Failed to delete contact: ${result.error}`, {
          duration: 4000,
          position: 'top-right',
        });
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
      // Pre-fill the form with all available contact data, setting status to lead
      const contactData = {
        name: contact.name,
        email: contact.email,
        phone: contact.phone || '',
        location: contact.location || '',
        type: contact.type,
        status: 'lead' as const, // Changed from 'active' to 'lead'
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

  // Update the location selection to validate and show errors
  const selectLocationSuggestion = (suggestion: LocationSuggestion) => {
    selectLocation(suggestion, (locationData) => {
      // Only set location if it has city, state, and country
      if (suggestion.city && suggestion.state && suggestion.country) {
        updateField('location', suggestion.fullAddress);
        setLocationError(null); // Clear error
      } else {
        // Show error if incomplete
        setLocationError('Please select a complete location with city, state, and country');
      }
    });
  };

  // Update location input change to validate
  const handleLocationInputChange = (value: string) => {
    handleLocationChange(value, (locationValue) => {
      updateField('location', locationValue);
      
      // Validate location on input change
      if (locationValue) {
        const parts = locationValue.split(',').map(part => part.trim());
        if (parts.length < 3) {
          setLocationError('Please select a complete location (city, state, country)');
        } else {
          setLocationError(null);
        }
      } else {
        setLocationError(null);
      }
    });
  };

  // Add location validation to the form
  const validateLocation = (location: string | undefined) => {
    if (!location || location.length < 3) return 'Please select a complete location (city, state, country)';
    return null;
  };

  // Update the handleSubmit to include location validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add location validation
    const locationError = validateLocation(formData.location);
    if (locationError) {
      toast.error(locationError, {
        duration: 3000,
        position: 'top-right',
      });
      return;
    }
    
    if (!validateForm()) return;

    try {
      const contactData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone?.trim() || '',
        location: formData.location?.trim() || '',
        type: formData.type,
        status: formData.status,
        budgetRange: formData.budgetRange?.trim() || '',
        propertyTypes: formData.propertyTypes?.trim() || '',
        notes: formData.notes?.trim() || '',
        lastContact: new Date().toISOString(),
        conversationCount: editingContact?.conversationCount || 0,
        createdAt: editingContact?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingContact) {
        await updateContact({ id: editingContact.id, ...contactData });
      } else {
        await createContact(contactData);
      }

      setShowNewContactModal(false);
      setEditingContact(null);
      resetForm();
      closeLocationDropdown();
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const loading = conversationsLoading || contactsLoading || isSubmitting
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
    <ErrorBoundary>
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
                <option value="client">Clients</option>
                <option value="lead">Leads</option>
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredContacts.map((contact) => (
                <ContactProfileCard
                  key={contact.id}
                  contact={contact}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                  onClick={(c) => {
                    setSelectedContact(c);
                    setShowInfoModal(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Enhanced New/Edit Contact Modal */}
        <ContactEditProfileCard
          contact={editingContact}
          isOpen={showNewContactModal}
          onClose={() => {
            setShowNewContactModal(false)
            setEditingContact(null)
            resetForm()
            closeLocationDropdown()
          }}
          onSubmit={async (contactData) => {
            if (editingContact) {
              await updateContact({ id: editingContact.id, ...contactData });
            } else {
              await createContact(contactData);
            }
            await fetchContacts();
          }}
          onDelete={async (contactId) => {
            const result = await deleteContact(contactId);
            if (result.success) {
              toast.success('Contact deleted successfully!', {
                duration: 3000,
                position: 'top-right',
              });
              await fetchContacts();
            } else {
              throw new Error(result.error);
            }
          }}
        />

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

        {/* Click outside to close tooltip */}
        {showVerifiedTooltip && (
          <div 
            className="fixed inset-0 z-5" 
            onClick={() => setShowVerifiedTooltip(false)}
          />
        )}

        {/* Contact Info Modal */}
        {selectedContact && (
          <ContactDetailProfileCard
            contact={selectedContact ?? undefined}
            onClose={() => {
              setShowInfoModal(false);
              setSelectedContact(null);
            }}
            onEdit={(contact) => {
              setShowInfoModal(false);
              setSelectedContact(null);
              handleEditContact(contact);
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}
