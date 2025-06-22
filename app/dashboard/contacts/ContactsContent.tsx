'use client';

import { Search, Calendar, Filter, Plus, Phone, Mail, User2, Building2, Home } from "lucide-react"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useContactsData } from '@/hooks/useCentralizedDashboardData';
import { LoadingSpinner } from '@/components/common/Feedback/LoadingSpinner';
import { ErrorBoundary } from '@/components/common/Feedback/ErrorBoundary';
import type { Conversation } from '@/types/conversation';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  type: 'buyer' | 'seller' | 'investor' | 'other';
  status: 'active' | 'inactive' | 'completed';
  lastContact: string;
  notes?: string;
  conversationCount: number;
  budgetRange?: string;
  propertyTypes?: string;
}

export default function ContactsContent() {
  const router = useRouter()
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Use contacts data hook to get real conversations
  const { 
    conversations, 
    loading, 
    error 
  } = useContactsData({
    autoRefresh: true,
    refreshInterval: 30000
  });

  // Process conversations into contacts
  const contacts = useMemo((): Contact[] => {
    if (!conversations) return [];

    // Group conversations by email to create unique contacts
    const contactMap = new Map<string, Contact>();

    conversations.forEach((conversation: Conversation) => {
      const { thread } = conversation;
      const email = thread.client_email;
      
      if (!email) return;

      const existingContact = contactMap.get(email);
      
      if (existingContact) {
        // Update existing contact with latest information
        existingContact.conversationCount++;
        if (new Date(thread.lastMessageAt) > new Date(existingContact.lastContact)) {
          existingContact.lastContact = thread.lastMessageAt;
          existingContact.name = thread.lead_name || existingContact.name;
          existingContact.phone = thread.phone || existingContact.phone;
          existingContact.location = thread.location || existingContact.location;
          existingContact.budgetRange = thread.budget_range || existingContact.budgetRange;
          existingContact.propertyTypes = thread.preferred_property_types || existingContact.propertyTypes;
        }
      } else {
        // Create new contact
        const contact: Contact = {
          id: thread.conversation_id,
          name: thread.lead_name || 'Unknown Contact',
          email: email,
          phone: thread.phone,
          location: thread.location,
          type: determineContactType(thread),
          status: determineContactStatus(thread),
          lastContact: thread.lastMessageAt,
          notes: thread.ai_summary,
          conversationCount: 1,
          budgetRange: thread.budget_range,
          propertyTypes: thread.preferred_property_types
        };
        contactMap.set(email, contact);
      }
    });

    return Array.from(contactMap.values());
  }, [conversations]);

  // Filter contacts based on search term and filters
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch = 
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.phone && contact.phone.includes(searchTerm)) ||
        (contact.location && contact.location.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = typeFilter === "all" || contact.type === typeFilter;
      const matchesStatus = statusFilter === "all" || contact.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [contacts, searchTerm, typeFilter, statusFilter]);

  // Helper functions
  function determineContactType(thread: any): 'buyer' | 'seller' | 'investor' | 'other' {
    const summary = (thread.ai_summary || '').toLowerCase();
    const propertyTypes = (thread.preferred_property_types || '').toLowerCase();
    
    if (summary.includes('buy') || summary.includes('purchase') || propertyTypes.includes('residential')) {
      return 'buyer';
    } else if (summary.includes('sell') || summary.includes('listing')) {
      return 'seller';
    } else if (summary.includes('invest') || propertyTypes.includes('investment')) {
      return 'investor';
    }
    return 'other';
  }

  function determineContactStatus(thread: any): 'active' | 'inactive' | 'completed' {
    if (thread.completed) return 'completed';
    if (thread.spam || thread.flag) return 'inactive';
    return 'active';
  }

  function formatLastContact(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  function getTypeIcon(type: string) {
    switch (type) {
      case 'buyer': return <Home className="h-4 w-4" />;
      case 'seller': return <Building2 className="h-4 w-4" />;
      case 'investor': return <User2 className="h-4 w-4" />;
      default: return <User2 className="h-4 w-4" />;
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading contacts..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading contacts</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Contacts</h1>
        <p className="text-gray-600">
          Manage and view client information extracted from conversations. 
          {contacts.length > 0 && ` Found ${contacts.length} unique contacts.`}
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        {/* Header section with navigation */}
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-[#0e6537]">Contacts Management</h2>
        </div>

        {/* Search and filter controls */}
        <div className="bg-white p-4 rounded-lg border border-white/20 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search input with icon */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts by name, email, phone, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#0e6537]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e6537]"
              />
            </div>
            
            {/* Filter controls */}
            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-[#0e6537]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e6537]"
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
                className="px-4 py-2 border border-[#0e6537]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e6537]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="completed">Completed</option>
              </select>
              
              <button className="px-4 py-2 bg-[#0e6537] text-white rounded-lg hover:bg-[#157a42] transition-all duration-200 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Contact
              </button>
            </div>
          </div>
        </div>

        {/* Contacts grid with responsive layout */}
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-2">
              {searchTerm || typeFilter !== "all" || statusFilter !== "all" 
                ? "No contacts match your filters" 
                : "No contacts found"}
            </p>
            <p className="text-gray-400 text-sm">
              {searchTerm || typeFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Contacts will appear here as you receive conversations"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white rounded-lg border border-white/20 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                onClick={() => router.push(`/dashboard/conversations/${contact.id}`)}
              >
                <div className="p-4">
                  {/* Contact header with name and status badges */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{contact.name}</h3>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                    </div>
                    <div className="flex gap-2">
                      {/* Status badge */}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          contact.status === "active"
                            ? "bg-[#0e6537]/20 text-[#0e6537]"
                            : contact.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {contact.status.toUpperCase()}
                      </span>
                      {/* Type badge */}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          contact.type === "buyer"
                            ? "bg-blue-100 text-blue-800"
                            : contact.type === "seller"
                            ? "bg-purple-100 text-purple-800"
                            : contact.type === "investor"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {getTypeIcon(contact.type)}
                        {contact.type.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Contact details with icons */}
                  <div className="mt-4 space-y-2">
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{contact.email}</span>
                    </div>
                    {contact.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{contact.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Last contact: {formatLastContact(contact.lastContact)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User2 className="h-4 w-4" />
                      <span>{contact.conversationCount} conversation{contact.conversationCount !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  {/* Additional information */}
                  {(contact.budgetRange || contact.propertyTypes) && (
                    <div className="mt-4 pt-4 border-t">
                      {contact.budgetRange && (
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Budget:</span> {contact.budgetRange}
                        </p>
                      )}
                      {contact.propertyTypes && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Interested in:</span> {contact.propertyTypes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Contact notes section */}
                  {contact.notes && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600 line-clamp-2">{contact.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 