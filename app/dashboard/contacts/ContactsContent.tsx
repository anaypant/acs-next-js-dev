'use client';

import { Search, Calendar, Filter, Plus, Phone, Mail } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ContactsContent() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedDate, setSelectedDate] = useState("")

    // Sample contact data structure
    const contacts = [
    {
      id: 1,
      name: "Michael Rodriguez",
      email: "michael.rodriguez@email.com",
      phone: "(555) 123-4567",
      type: "buyer",
      status: "active",
      lastContact: "2024-01-15",
      notes: "Interested in downtown condos",
    },
    {
      id: 2,
      name: "Jennifer Chen",
      email: "jennifer.chen@email.com",
      phone: "(555) 234-5678",
      type: "seller",
      status: "active",
      lastContact: "2024-01-14",
      notes: "Selling suburban home",
    },
    {
      id: 3,
      name: "David Thompson",
      email: "david.thompson@email.com",
      phone: "(555) 345-6789",
      type: "buyer",
      status: "inactive",
      lastContact: "2024-01-10",
      notes: "Looking for investment properties",
    },
    {
      id: 4,
      name: "Lisa Park",
      email: "lisa.park@email.com",
      phone: "(555) 456-7890",
      type: "seller",
      status: "active",
      lastContact: "2024-01-13",
      notes: "Selling luxury apartment",
    },
    {
      id: 5,
      name: "Robert Wilson",
      email: "robert.wilson@email.com",
      phone: "(555) 567-8901",
      type: "buyer",
      status: "active",
      lastContact: "2024-01-12",
      notes: "Interested in waterfront properties",
    },
    {
      id: 6,
      name: "Amanda Foster",
      email: "amanda.foster@email.com",
      phone: "(555) 678-9012",
      type: "seller",
      status: "inactive",
      lastContact: "2024-01-08",
      notes: "Selling family home",
    },
  ]

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm),
  )

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Contacts</h1>
        <p className="text-gray-600">Manage and view client information with search and filtering capabilities.</p>
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
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#0e6537]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e6537]"
              />
            </div>
            {/* Date picker and action buttons */}
            <div className="flex gap-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-[#0e6537]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e6537]"
                />
              </div>
              <button className="px-4 py-2 border border-[#0e6537]/20 rounded-lg hover:bg-gradient-to-r hover:from-[#0e6537]/10 hover:to-[#157a42]/10 transition-all duration-200 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </button>
              <button className="px-4 py-2 bg-[#0e6537] text-white rounded-lg hover:bg-[#157a42] transition-all duration-200 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Contact
              </button>
            </div>
          </div>
        </div>

        {/* Contacts grid with responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white rounded-lg border border-white/20 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => router.push(`/dashboard/contacts/${contact.id}`)}
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
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {contact.status.toUpperCase()}
                    </span>
                    {/* Type badge */}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        contact.type === "buyer"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {contact.type.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Contact details with icons */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Last contact: {contact.lastContact}</span>
                  </div>
                </div>

                {/* Contact notes section */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">{contact.notes}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 