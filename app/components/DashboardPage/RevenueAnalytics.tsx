// Last Modified: 2024-04-15 by Claude
import React from "react"
import { Grid, Phone, Briefcase, Package, MoreHorizontal, ChevronDown, LayoutGrid } from "lucide-react"

interface RevenueAnalyticsProps {
  selectedMonth: string
  activeTab: string
  setActiveTab: (tab: string) => void
  darkMode: boolean
}

const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({
  selectedMonth,
  activeTab,
  setActiveTab,
  darkMode,
}) => {
  const tabs = [
    { name: "App", icon: <Grid className="h-5 w-5" /> },
    { name: "Mobile", icon: <Phone className="h-5 w-5" /> },
    { name: "SaaS", icon: <Briefcase className="h-5 w-5" /> },
    { name: "Products", icon: <Package className="h-5 w-5" /> },
    { name: "Others", icon: <MoreHorizontal className="h-5 w-5" /> },
  ]

  const revenueData = [
    {
      period: "Daily",
      company: "COMPANY NAME",
      percentage: "73.2%",
      level: "Low",
      value: "$3.5k",
      chart: (
        <svg className="w-16 h-8" viewBox="0 0 100 30">
          <path
            d="M0,15 L10,10 L20,20 L30,5 L40,15 L50,10 L60,20 L70,15 L80,5 L90,10 L100,15"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      period: "Weekly",
      company: "COMPANY NAME",
      percentage: "56.8%",
      level: "Medium",
      value: "$3.5k",
      chart: (
        <svg className="w-16 h-8" viewBox="0 0 100 30">
          <path
            d="M0,20 L10,15 L20,10 L30,15 L40,5 L50,15 L60,10 L70,15 L80,20 L90,15 L100,10"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      period: "Monthly",
      company: "COMPANY NAME",
      percentage: "25%",
      level: "Very high",
      value: "$3.5k",
      chart: (
        <svg className="w-16 h-8" viewBox="0 0 100 30">
          <path
            d="M0,15 L10,20 L20,15 L30,10 L40,15 L50,5 L60,10 L70,15 L80,20 L90,15 L100,10"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
          />
        </svg>
      ),
    },
  ]

  return (
    <div className={`col-span-12 md:col-span-8 ${darkMode ? "bg-[#1e4d36]/80" : "bg-white"} rounded-lg p-4`}>
      <div className="flex flex-row items-center justify-between pb-2">
        <div>
          <h3 className={`text-lg font-medium ${darkMode ? "text-white" : "text-[#1e4d36]"}`}>
            Revenue Analytics
          </h3>
          <p className={`text-sm ${darkMode ? "text-white/70" : "text-[#1e4d36]/70"}`}>
            Revenue Trends Daily, Weekly and Monthly
          </p>
        </div>
        <div className="relative">
          <button
            className={`flex items-center gap-2 text-xs border ${
              darkMode ? "border-white/30 text-white" : "border-gray-300 text-[#1e4d36]"
            } rounded-md px-2 py-1`}
          >
            {selectedMonth}
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {tabs.map((item, i) => (
          <button
            key={i}
            className={`flex flex-col items-center justify-center p-2 h-auto gap-1 rounded-md ${
              activeTab === item.name
                ? "bg-[#1e4d36] text-white"
                : darkMode
                  ? "bg-[#2a5a42]/30 text-white border border-[#2a5a42]"
                  : "bg-green-50 text-[#1e4d36] border border-green-100"
            }`}
            onClick={() => setActiveTab(item.name)}
          >
            {item.icon}
            <span className="text-xs">{item.name}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between mb-6 border-b pb-2 gap-1">
        {["Revenue Trends", "Progress", "Priority", "Budget", "Chart"].map((item, i) => (
          <button
            key={i}
            className={`text-xs sm:text-sm font-medium p-1 h-auto ${darkMode ? "text-white" : "text-[#1e4d36]"}`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-1 md:col-span-7">
          <div className="space-y-6">
            {revenueData.map((item, i) => (
              <div
                key={i}
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 py-2 border-b ${
                  darkMode ? "border-[#2a5a42]" : "border-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-8 w-8 ${
                      darkMode ? "bg-[#2a5a42]" : "bg-gray-200"
                    } rounded-md overflow-hidden relative flex-shrink-0`}
                  >
                    <LayoutGrid
                      className={`h-5 w-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                        darkMode ? "text-white/70" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <div>
                    <div className={`text-sm font-medium truncate ${darkMode ? "text-white" : "text-[#1e4d36]"}`}>
                      {item.period}
                    </div>
                    <div className={`text-xs ${darkMode ? "text-white/70" : "text-[#1e4d36]/70"} truncate`}>
                      {item.company}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center w-full sm:w-auto gap-2">
                  <div className={`text-sm font-medium ${darkMode ? "text-white" : "text-[#1e4d36]"}`}>
                    {item.percentage}
                  </div>
                  <div className="text-sm font-medium">
                    <span
                      className={
                        item.level === "Low"
                          ? "text-green-500"
                          : item.level === "Medium"
                            ? "text-yellow-500"
                            : "text-red-500"
                      }
                    >
                      {item.level}
                    </span>
                  </div>
                  <div className={`text-sm font-medium ${darkMode ? "text-white" : "text-[#1e4d36]"}`}>
                    {item.value}
                  </div>
                  <div className="w-16">{item.chart}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1 md:col-span-5">
          <div className={`text-lg font-medium mb-2 ${darkMode ? "text-white" : "text-[#1e4d36]"}`}>
            Sales Analytics
          </div>
          <div className="relative h-[150px] w-[150px] mx-auto">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <circle cx="50" cy="50" r="40" fill="#1e4d36" className="pie-chart-path" />
              <path d="M50,50 L50,10 A40,40 0 0,1 85,65 Z" fill="#10b981" className="pie-chart-path" />
            </svg>
          </div>
          <div className="space-y-1 mt-2">
            {[
              { category: "Category 1", percentage: "48.2%" },
              { category: "Category 2", percentage: "31.8%" },
              { category: "Category 3", percentage: "12%" },
              { category: "Category 4", percentage: "6%" },
              { category: "Category 5", percentage: "2%" },
            ].map((item, i) => (
              <div key={i} className={`text-sm ${darkMode ? "text-white" : "text-[#1e4d36]"}`}>
                <span className="font-medium">{item.category}:</span> {item.percentage} in lorem ipsum
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RevenueAnalytics 