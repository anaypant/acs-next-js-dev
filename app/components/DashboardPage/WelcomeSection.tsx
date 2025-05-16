"use client"

import React from "react"
import { Bell, ArrowUp } from "lucide-react"

interface WelcomeSectionProps {
  darkMode: boolean
  userName: string
  selectedMonth?: string
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ darkMode, userName, selectedMonth }) => {
  const currentYear = new Date().getFullYear()

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Welcome Section */}
      <div className="col-span-1 md:col-span-8">
        <h1
          className={`text-4xl font-bold ${darkMode ? "text-white" : "text-[#1e4d36]"} border-b ${
            darkMode ? "border-white/20" : "border-[#1e4d36]/20"
          } pb-2`}
        >
          Welcome back {userName}!
        </h1>
        <h2 className={`text-3xl font-medium ${darkMode ? "text-white" : "text-[#1e4d36]"} mt-2`}>Check Dashboard</h2>
        <p className={`text-lg ${darkMode ? "text-white/80" : "text-[#1e4d36]"} mt-1`}>
          You have earned 54% more than last month which is a great thing
        </p>

        <div className="flex flex-wrap gap-4 mt-4">
          <div className="bg-[#1e4d36] text-white px-4 py-2 rounded-md text-xl font-semibold">$63,489.50</div>
          <div className="bg-[#1e4d36] text-white px-4 py-2 rounded-md">Year {currentYear}</div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeSection 