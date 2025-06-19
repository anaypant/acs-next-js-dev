/**
 * File: app/dashboard/calendar/page.tsx
 * Purpose: Renders the calendar dashboard with event management, scheduling, and upcoming events display.
 * Author: Alejo Cagliolo
 * Date: 5/25/25
 * Version: 1.0.0
 */

"use client"
import { ArrowLeft, Search, Calendar, Filter, Plus, Clock, MapPin, Users, Bell } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Logo } from "@/app/utils/Logo"

/**
 * CalendarPage Component
 * Main calendar dashboard component for managing and viewing events
 * 
 * Features:
 * - Event search and filtering
 * - Calendar grid view
 * - Upcoming events list
 * - Event status and type indicators
 * 
 * @returns {JSX.Element} Complete calendar dashboard
 */
export default function CalendarPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  // Session check - redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0e6537] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated
  if (status === 'unauthenticated') {
    return null
  }

  // State management for search and date selection
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("")

  // Sample event data structure
  const events = [
    {
      id: 1,
      title: "Property Viewing - Downtown Condo",
      client: "Michael Rodriguez",
      date: "2024-01-15",
      time: "10:00 AM",
      duration: "1 hour",
      type: "viewing",
      status: "confirmed",
    },
    {
      id: 2,
      title: "Initial Consultation",
      client: "Jennifer Chen",
      date: "2024-01-15",
      time: "2:00 PM",
      duration: "45 min",
      type: "consultation",
      status: "pending",
    },
    {
      id: 3,
      title: "Offer Presentation",
      client: "David Thompson",
      date: "2024-01-16",
      time: "11:00 AM",
      duration: "1 hour",
      type: "offer",
      status: "confirmed",
    },
    {
      id: 4,
      title: "Follow-up Meeting",
      client: "Lisa Park",
      date: "2024-01-16",
      time: "3:00 PM",
      duration: "30 min",
      type: "follow-up",
      status: "pending",
    },
    {
      id: 5,
      title: "Property Viewing - Suburban Home",
      client: "Robert Wilson",
      date: "2024-01-17",
      time: "1:00 PM",
      duration: "1 hour",
      type: "viewing",
      status: "confirmed",
    },
    {
      id: 6,
      title: "Contract Signing",
      client: "Amanda Foster",
      date: "2024-01-17",
      time: "4:00 PM",
      duration: "45 min",
      type: "contract",
      status: "pending",
    },
  ]

  // Filter events based on search term
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.client.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a5a2f] via-[#0e6537] to-[#157a42]">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header section with navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Logo size="md" />
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-[#0e6537]/10 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-[#0e6537]" />
          </button>
          <h1 className="text-2xl font-bold text-[#0e6537]">Calendar</h1>
        </div>

        {/* Search and filter controls */}
        <div className="bg-white p-4 rounded-lg border border-white/20 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search input with icon */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
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
                New Event
              </button>
            </div>
          </div>
        </div>

        {/* Calendar grid with day headers */}
        <div className="bg-white rounded-lg border border-white/20 shadow-sm overflow-hidden">
          {/* Day of week headers */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="bg-gray-50 p-4 text-center">
                <span className="text-sm font-medium text-gray-600">{day}</span>
              </div>
            ))}
          </div>
          {/* Calendar days grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {Array.from({ length: 35 }, (_, i) => {
              const date = new Date(2024, 0, i + 1)
              const isToday = date.toDateString() === new Date().toDateString()
              const hasEvents = events.some(
                (event) => event.date === date.toISOString().split("T")[0],
              )

              return (
                <div
                  key={i}
                  className={`min-h-[100px] p-2 ${
                    isToday ? "bg-[#0e6537]/10" : "bg-white"
                  }`}
                >
                  {/* Date and event indicator */}
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-sm ${
                        isToday ? "text-[#0e6537] font-bold" : "text-gray-600"
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    {hasEvents && (
                      <div className="w-2 h-2 rounded-full bg-[#0e6537]"></div>
                    )}
                  </div>
                  {/* Event list for the day */}
                  {hasEvents && (
                    <div className="mt-2 space-y-1">
                      {events
                        .filter(
                          (event) =>
                            event.date === date.toISOString().split("T")[0],
                        )
                        .map((event) => (
                          <div
                            key={event.id}
                            className="text-xs p-1 rounded bg-[#0e6537]/10 text-[#0e6537] truncate"
                          >
                            {event.time} - {event.title}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming events section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'white' }}>Upcoming Events</h2>
          <div className="bg-white rounded-lg border border-white/20 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => (window.location.href = `/dashboard/calendar/${event.id}`)}
                >
                  {/* Event details */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-500">{event.client}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {event.time}
                      </p>
                      <p className="text-sm text-gray-500">{event.duration}</p>
                    </div>
                  </div>
                  {/* Event status and type badges */}
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === "confirmed"
                          ? "bg-[#0e6537]/20 text-[#0e6537]"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {event.status.toUpperCase()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.type === "viewing"
                          ? "bg-blue-100 text-blue-800"
                          : event.type === "consultation"
                            ? "bg-purple-100 text-purple-800"
                            : event.type === "offer"
                              ? "bg-green-100 text-green-800"
                              : event.type === "follow-up"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {event.type.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Change Log:
 * 5/25/25 - Initial version
 * - Created calendar dashboard with grid view
 * - Implemented event search and filtering
 * - Added upcoming events list
 * - Integrated event status and type indicators
 * - Added responsive design for all screen sizes
 */
