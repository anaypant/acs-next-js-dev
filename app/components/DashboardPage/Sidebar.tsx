"use client"

import React from "react"
import { Search, Zap, BarChart, LineChart, Settings, User, ChevronDown, Sun, Moon, Bell, RefreshCw, Edit } from "lucide-react"

type SectionKey = "keyWidgets" | "dataVisualization" | "navigation" | "functionalities"

interface SidebarProps {
  darkMode: boolean
  onDarkModeToggle: () => void
  onNotificationsToggle: () => void
  onRefreshToggle: () => void
  onEditDashboard: () => void
  sectionsOpen: {
    keyWidgets: boolean
    dataVisualization: boolean
    navigation: boolean
    functionalities: boolean
  }
  toggleSection: (section: SectionKey) => void
}

const Sidebar = ({
  darkMode,
  onDarkModeToggle,
  onNotificationsToggle,
  onRefreshToggle,
  onEditDashboard,
  sectionsOpen,
  toggleSection,
}: SidebarProps) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#1e4d36] dark:bg-[#0e2a1c] transition-all duration-300 overflow-y-auto w-[280px]`}
    >
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center gap-2 font-semibold text-white">
          <span className="text-xl">ACS</span>
          <span className="text-xl">DASHBOARD</span>
        </div>
      </div>
      <div className="flex flex-col px-2 py-2 h-[calc(100vh-3.5rem-4rem)]">
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
          <input
            type="search"
            placeholder="Search"
            className="w-full bg-[#2a5a42]/50 pl-8 text-white placeholder:text-white/50 border-[#2a5a42] rounded-md h-9 focus:outline-none"
          />
        </div>
        <div className="space-y-1 overflow-y-auto flex-grow">
          <SidebarSection
            title="Key Widgets"
            icon={<Zap className="h-5 w-5" />}
            isOpen={sectionsOpen.keyWidgets}
            onToggle={() => toggleSection("keyWidgets")}
            items={["Sales Dashboard", "Analytics Overview"]}
          />
          <SidebarSection
            title="Data Visualization"
            icon={<BarChart className="h-5 w-5" />}
            isOpen={sectionsOpen.dataVisualization}
            onToggle={() => toggleSection("dataVisualization")}
            items={["Sales Analytics", "Revenue Analytics"]}
          />
          <SidebarSection
            title="Navigation"
            icon={<LineChart className="h-5 w-5" />}
            isOpen={sectionsOpen.navigation}
            onToggle={() => toggleSection("navigation")}
            items={["Expert Value Analysis", "Lead Conversion Product", "Lead Generation Workflow"]}
          />
          <SidebarSection
            title="Functionalities"
            icon={<Settings className="h-5 w-5" />}
            isOpen={sectionsOpen.functionalities}
            onToggle={() => toggleSection("functionalities")}
            items={["Google Ads Integration", "Customizable Settings"]}
          />
        </div>
        <div className="space-y-1 mt-auto">
          <div className="flex items-center justify-between py-2 text-white">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <span className="text-sm font-medium">Settings</span>
            </div>
          </div>
          <div className="pl-7 space-y-2">
            <ToggleOption label="Dark Mode" enabled={darkMode} onToggle={onDarkModeToggle} />
            <ToggleOption
              label="Notifications"
              enabled={false}
              onToggle={onNotificationsToggle}
            />
            <ToggleOption label="Refresh Data" enabled={false} onToggle={onRefreshToggle} />
          </div>
        </div>
      </div>
      <div className="mt-auto p-4 border-t border-[#2a5a42]">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full overflow-hidden bg-[#2a5a42]">
            <User className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">Mr. Avinash</div>
            <div className="text-xs text-white/70">Last active 3h ago</div>
          </div>
        </div>
      </div>
      <button
        onClick={onEditDashboard}
        className="mt-2 p-4 border-t border-[#2a5a42] w-full hover:bg-[#2a5a42] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full overflow-hidden bg-[#2a5a42]">
            <Edit className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">Edit Dashboard</div>
            <div className="text-xs text-white/70">Customize your widgets</div>
          </div>
        </div>
      </button>
    </div>
  )
}

interface SidebarSectionProps {
  title: string
  icon: React.ReactNode
  isOpen: boolean
  onToggle: () => void
  items: string[]
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title, icon, isOpen, onToggle, items }) => {
  return (
    <>
      <div
        className="flex items-center justify-between py-2 text-white cursor-pointer hover:bg-[#2a5a42]/50 rounded-md px-2 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{title}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </div>
      {isOpen && (
        <div className="pl-7 space-y-1 animate-in slide-in-from-top-5 duration-300">
          {items.map((item, index) => (
            <div key={index} className="flex items-center py-1 text-white/70 hover:text-white cursor-pointer">
              <span className="text-xs">• {item}</span>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

interface ToggleOptionProps {
  label: string
  enabled: boolean
  onToggle: () => void
}

const ToggleOption: React.FC<ToggleOptionProps> = ({ label, enabled, onToggle }) => {
  return (
    <div className="flex items-center justify-between py-1 text-white/70">
      <span className="text-xs">{label}</span>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-4 w-8 items-center rounded-full ${enabled ? "bg-white/70" : "bg-white/30"}`}
      >
        <span
          className={`absolute h-3 w-3 rounded-full bg-white transform transition-transform ${
            enabled ? "translate-x-4" : "translate-x-1"
          }`}
        ></span>
      </button>
    </div>
  )
}

export default Sidebar 