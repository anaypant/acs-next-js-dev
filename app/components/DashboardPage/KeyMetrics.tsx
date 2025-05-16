"use client"

import React from "react"
import { TrendingUp, Users, DollarSign, ShoppingCart } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  darkMode: boolean
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, darkMode }) => {
  const isPositive = change >= 0
  
  return (
    <div 
      className={`${
        darkMode ? "bg-[#1e4d36]/80" : "bg-white"
      } rounded-lg p-4 transition-all hover:scale-[1.02]`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-sm font-medium ${darkMode ? "text-white/80" : "text-gray-600"}`}>{title}</p>
          <h3 className={`text-2xl font-bold mt-1 ${darkMode ? "text-white" : "text-[#1e4d36]"}`}>{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${darkMode ? "bg-[#1e4d36]" : "bg-[#1e4d36]/10"}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center mt-4">
        <span className={`text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? "+" : ""}{change}%
        </span>
        <span className={`ml-2 text-xs ${darkMode ? "text-white/60" : "text-gray-500"}`}>vs last month</span>
      </div>
    </div>
  )
}

interface KeyMetricsProps {
  darkMode: boolean
}

const KeyMetrics: React.FC<KeyMetricsProps> = ({ darkMode }) => {
  const metrics = [
    {
      title: "Total Revenue",
      value: "$678,298",
      change: 12.5,
      icon: <DollarSign className={`h-6 w-6 ${darkMode ? "text-white" : "text-[#1e4d36]"}`} />
    },
    {
      title: "Active Users",
      value: "8,392",
      change: 9.1,
      icon: <Users className={`h-6 w-6 ${darkMode ? "text-white" : "text-[#1e4d36]"}`} />
    },
    {
      title: "Sales Growth",
      value: "23.8%",
      change: -2.4,
      icon: <TrendingUp className={`h-6 w-6 ${darkMode ? "text-white" : "text-[#1e4d36]"}`} />
    },
    {
      title: "Total Orders",
      value: "1,482",
      change: 15.3,
      icon: <ShoppingCart className={`h-6 w-6 ${darkMode ? "text-white" : "text-[#1e4d36]"}`} />
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          icon={metric.icon}
          darkMode={darkMode}
        />
      ))}
    </div>
  )
}

export default KeyMetrics 