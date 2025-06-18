/**
 * File: app/dashboard/analytics/page.tsx
 * Purpose: Renders the analytics dashboard with key metrics, charts, and data visualization.
 * Author: Alejo Cagliolo
 * Date: 5/25/25
 * Version: 1.0.0
 */

"use client"
import { ArrowLeft, Search, Calendar, Filter, BarChart3, TrendingUp, TrendingDown, Users, DollarSign, Target, Activity } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

/**
 * Logo Component
 * Displays the ACS logo with customizable size and gradient text
 * 
 * @param {Object} props - Component props
 * @param {"sm" | "lg"} props.size - Size variant of the logo
 * @returns {JSX.Element} ACS logo with gradient background and text
 */
function Logo({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gradient-to-br from-[#0a5a2f] via-[#0e6537] to-[#157a42] rounded-lg flex items-center justify-center shadow-sm">
        <span className="text-white font-bold text-sm">ACS</span>
      </div>
      <span className="font-bold text-lg bg-gradient-to-r from-[#0a5a2f] to-[#157a42] bg-clip-text text-transparent">
        ACS
      </span>
    </div>
  )
}

/**
 * AnalyticsPage Component
 * Main analytics dashboard component for viewing business metrics and performance data
 * 
 * Features:
 * - Performance metrics overview
 * - Lead conversion analytics
 * - Revenue tracking
 * - User activity monitoring
 * 
 * @returns {JSX.Element} Complete analytics dashboard view
 */
export default function AnalyticsPage() {
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

  // State for date range selection and search functionality
  const [dateRange, setDateRange] = useState("30d")
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header section with logo and navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Logo />
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-[#0e6537]/10 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-[#0e6537]" />
          </button>
          <h1 className="text-2xl font-bold text-[#0e6537]">Analytics Dashboard</h1>
        </div>

        {/* Date range selector with custom styling */}
        <div className="bg-[#0e6537] p-4 rounded-lg border border-white/20 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {/* Date range buttons with dynamic styling based on selection */}
              <button
                onClick={() => setDateRange("7d")}
                className={`px-4 py-2 rounded-lg ${
                  dateRange === "7d"
                    ? "bg-white text-[#0e6537]"
                    : "border border-white/20 text-white hover:bg-white/10"
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setDateRange("30d")}
                className={`px-4 py-2 rounded-lg ${
                  dateRange === "30d"
                    ? "bg-white text-[#0e6537]"
                    : "border border-white/20 text-white hover:bg-white/10"
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setDateRange("90d")}
                className={`px-4 py-2 rounded-lg ${
                  dateRange === "90d"
                    ? "bg-white text-[#0e6537]"
                    : "border border-white/20 text-white hover:bg-white/10"
                }`}
              >
                90 Days
              </button>
            </div>
            {/* Custom date picker with calendar icon */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white" />
              <input
                type="date"
                className="pl-10 pr-4 py-2 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-white/10 text-white placeholder-white/60"
              />
            </div>
          </div>
        </div>

        {/* Key metrics cards with dynamic data */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Total Leads metric */}
          <div className="bg-[#0e6537] p-6 rounded-lg border border-white/20 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/80">Total Leads</p>
                <p className="text-2xl font-bold text-white">1,234</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-white/80">
              <TrendingUp className="h-4 w-4" />
              <span>+12.5% from last period</span>
            </div>
          </div>

          {/* Conversion Rate metric */}
          <div className="bg-[#0e6537] p-6 rounded-lg border border-white/20 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/80">Conversion Rate</p>
                <p className="text-2xl font-bold text-white">23.5%</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-white/80">
              <TrendingUp className="h-4 w-4" />
              <span>+2.1% from last period</span>
            </div>
          </div>

          {/* Response Time metric */}
          <div className="bg-[#0e6537] p-6 rounded-lg border border-white/20 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/80">Avg. Response Time</p>
                <p className="text-2xl font-bold text-white">12m</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-white/80">
              <TrendingUp className="h-4 w-4" />
              <span>-3m from last period</span>
            </div>
          </div>

          {/* Active Leads metric */}
          <div className="bg-[#0e6537] p-6 rounded-lg border border-white/20 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/80">Active Leads</p>
                <p className="text-2xl font-bold text-white">47</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-white/80">
              <TrendingUp className="h-4 w-4" />
              <span>+12 this week</span>
            </div>
          </div>
        </div>

        {/* Charts section with lead sources and conversion trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lead Sources visualization */}
          <div className="bg-[#0e6537] p-6 rounded-lg border border-white/20 shadow-sm">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'white' }}>Lead Sources</h3>
            <div className="space-y-4">
              {/* Lead source bars with percentage indicators */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white">Website Forms</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-white/20 rounded-full">
                    <div className="w-3/4 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-white">45%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white">Social Media</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-white/20 rounded-full">
                    <div className="w-1/2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-white">28%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white">Referrals</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-white/20 rounded-full">
                    <div className="w-1/3 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-white">18%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white">Open Houses</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-white/20 rounded-full">
                    <div className="w-1/4 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-white">12%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conversion Trends chart */}
          <div className="bg-[#0e6537] p-6 rounded-lg border border-white/20 shadow-sm">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'white' }}>Conversion Trends</h3>
            <div className="h-64 flex items-end justify-between gap-2 bg-white/10 rounded-lg p-4">
              {/* Monthly conversion data visualization */}
              {[
                { month: "Jan", conversion: 18, leads: 32 },
                { month: "Feb", conversion: 20, leads: 38 },
                { month: "Mar", conversion: 22, leads: 41 },
                { month: "Apr", conversion: 23.5, leads: 47 },
              ].map((data, index) => (
                <div key={index} className="flex flex-col items-center gap-1 flex-1">
                  <div className="flex gap-1">
                    <div
                      className="w-2 bg-white rounded-sm"
                      style={{ height: `${data.conversion * 2}px` }}
                    ></div>
                    <div
                      className="w-2 bg-white/40 rounded-sm"
                      style={{ height: `${data.leads}px` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-white">{data.month}</span>
                </div>
              ))}
            </div>
            {/* Chart legend */}
            <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded"></div>
                <span className="text-xs font-medium text-white">Conversion %</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-white/40 rounded"></div>
                <span className="text-xs font-medium text-white">Active Leads</span>
              </div>
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
 * - Created analytics dashboard with key metrics
 * - Implemented date range selection
 * - Added lead sources visualization
 * - Created conversion trends chart
 * - Integrated responsive design for all screen sizes
 */
