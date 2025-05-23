"use client"

import { useState, useEffect } from "react"
import {
  Phone,
  Briefcase,
  Package,
  User,
} from "lucide-react"
import Sidebar from "./Sidebar"
import EditDashboard from "./EditDashboard"
import WelcomeSection from "./WelcomeSection"
import TotalSalesWidget from "./TotalSalesWidget"
import EarningsWidget from "./EarningsWidget"
import AveragePriceWidget from "./AveragePriceWidget"
import TotalProductsWidget from "./TotalProductsWidget"
import CampaignDistributionWidget from "./CampaignDistributionWidget"
import NavigationWidget from "./NavigationWidget"

// Constants
const PAGE_TITLE = "Dashboard"
const DASHBOARD_SECTIONS = {
  keyWidgets: "Key Widgets",
  dataVisualization: "Data Visualization",
  navigation: "Navigation",
  functionalities: "Functionalities",
} as const

// Types
type SectionKey = keyof typeof DASHBOARD_SECTIONS

interface SectionState {
  keyWidgets: boolean
  dataVisualization: boolean
  navigation: boolean
  functionalities: boolean
}

interface Widget {
  id: string
  name: string
  component: React.ComponentType<any>
  enabled: boolean
  order: number
  gridPosition: {
    row: number
    col: number
    span: number
  }
}

const DEFAULT_GRID_LAYOUT: Widget[] = [
  {
    id: "welcome",
    name: "Welcome Section",
    component: WelcomeSection,
    enabled: true,
    order: 1,
    gridPosition: {
      row: 0,
      col: 0,
      span: 8
    }
  },
  {
    id: "totalSales",
    name: "Total Sales",
    component: TotalSalesWidget,
    enabled: true,
    order: 2,
    gridPosition: {
      row: 0,
      col: 8,
      span: 4
    }
  },
  {
    id: "earnings",
    name: "Earnings",
    component: EarningsWidget,
    enabled: true,
    order: 3,
    gridPosition: {
      row: 1,
      col: 0,
      span: 4
    }
  },
  {
    id: "averagePrice",
    name: "Average Price",
    component: AveragePriceWidget,
    enabled: true,
    order: 4,
    gridPosition: {
      row: 1,
      col: 4,
      span: 8
    }
  },
  {
    id: "totalProducts",
    name: "Total Products",
    component: TotalProductsWidget,
    enabled: true,
    order: 5,
    gridPosition: {
      row: 2,
      col: 0,
      span: 4
    }
  },
  {
    id: "campaignDistribution",
    name: "Campaign Distribution",
    component: CampaignDistributionWidget,
    enabled: true,
    order: 6,
    gridPosition: {
      row: 2,
      col: 4,
      span: 4
    }
  },
  {
    id: "navigation",
    name: "Navigation",
    component: NavigationWidget,
    enabled: true,
    order: 7,
    gridPosition: {
      row: 2,
      col: 8,
      span: 4
    }
  }
];

const Dashboard = () => {
  // State management
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState("March 2022")
  const [activeTab, setActiveTab] = useState("App")
  const [darkMode, setDarkMode] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [refreshDataEnabled, setRefreshDataEnabled] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const currentYear = new Date().getFullYear()

  // State for collapsible sections
  const [sectionsOpen, setSectionsOpen] = useState({
    keyWidgets: true,
    dataVisualization: true,
    navigation: true,
    functionalities: true,
  })

  // Constants
  const months = [
    "January 2022",
    "February 2022",
    "March 2022",
    "April 2022",
    "May 2022",
    "June 2022",
    "July 2022",
    "August 2022",
    "September 2022",
    "October 2022",
    "November 2022",
    "December 2022",
  ]

  const tabs = ["App", "Messages", "Settings"]

  const keyMetrics = [
    {
      title: "Total Sales",
      value: "$2,456",
      change: "+14%",
      icon: Package,
      trend: "up",
    },
    {
      title: "Visitors",
      value: "5,325",
      change: "+2.5%",
      icon: User,
      trend: "up",
    },
    {
      title: "Total Earnings",
      value: "$8,234",
      change: "+18%",
      icon: Briefcase,
      trend: "up",
    },
    {
      title: "Pending Orders",
      value: "89",
      change: "-5%",
      icon: Phone,
      trend: "down",
    },
  ]

  const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_GRID_LAYOUT)

  useEffect(() => {
    // Only run on client side
    const savedWidgets = localStorage.getItem('dashboardWidgets')
    if (savedWidgets) {
      try {
        const parsed = JSON.parse(savedWidgets)
        if (Array.isArray(parsed)) {
          setWidgets(parsed)
        }
      } catch (error) {
        console.error('Error loading widgets from localStorage:', error)
      }
    }
  }, [])

  useEffect(() => {
    // Only save to localStorage when widgets change
    try {
      localStorage.setItem('dashboardWidgets', JSON.stringify(widgets))
    } catch (error) {
      console.error('Error saving widgets to localStorage:', error)
    }
  }, [widgets])

  // Event handlers
  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
  }

  const toggleNotificationsEnabled = () => {
    setNotificationsEnabled((prev) => !prev)
  }

  const toggleRefreshDataEnabled = () => {
    setRefreshDataEnabled((prev) => !prev)
  }

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const handleWidgetsChange = (newWidgets: Widget[]) => {
    setWidgets(newWidgets)
  }

  // Effects
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && sidebarOpen) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize() // Check on initial load

    return () => window.removeEventListener("resize", handleResize)
  }, [sidebarOpen])

  // Animation for charts
  useEffect(() => {
    const animateCharts = () => {
      // Line chart animation
      const lineChartPaths = document.querySelectorAll(".line-chart-path")
      lineChartPaths.forEach((path) => {
        const pathElement = path as SVGPathElement
        const length = pathElement.getTotalLength()
        pathElement.style.strokeDasharray = `${length}`
        pathElement.style.strokeDashoffset = `${length}`
        pathElement.style.animation = "dash 1.5s ease-in-out forwards"
      })

      // Pie chart animation
      const pieChartPaths = document.querySelectorAll(".pie-chart-path")
      pieChartPaths.forEach((path, i) => {
        const pathElement = path as SVGPathElement
        pathElement.style.opacity = "0"
        pathElement.style.animation = `fadeIn 0.5s ease-in-out ${i * 0.2}s forwards`
      })

      // Bar chart animation
      const barElements = document.querySelectorAll(".bar-chart-bar")
      barElements.forEach((bar, i) => {
        const barElement = bar as HTMLElement
        barElement.style.animation = `growBar 1s ease-out ${i * 0.1}s forwards`
      })
    }

    // Run animation after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      animateCharts()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const renderWidget = (widget: Widget) => {
    if (!widget.enabled || !widget.component) return null;
    
    const WidgetComponent = widget.component;
    return (
      <div
        key={widget.id}
        className={`p-4 rounded-lg ${
          darkMode ? 'bg-[#2a5a42]' : 'bg-gray-50'
        }`}
        style={{
          gridColumn: `${widget.gridPosition.col + 1} / span ${widget.gridPosition.span}`,
          gridRow: widget.gridPosition.row + 1
        }}
      >
        <WidgetComponent
          darkMode={darkMode ? true : false}
          selectedMonth={selectedMonth ? selectedMonth : "March 2022"}
          userName="Avinash"
        />
      </div>
    )
  }

  return (
    <div className={`flex min-h-screen ${darkMode ? "dark" : ""}`}>
      <Sidebar
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
        onNotificationsToggle={() => setNotificationsEnabled(!notificationsEnabled)}
        onRefreshToggle={() => setRefreshDataEnabled(!refreshDataEnabled)}
        onEditDashboard={() => setIsEditing(true)}
        sectionsOpen={sectionsOpen}
        toggleSection={toggleSection}
      />

      <main className={`flex-1 ${darkMode ? "bg-[#0e2a1c]" : "bg-[#f5f9f7]"} p-6 transition-all duration-300 ml-[280px]`}>
        <div 
          className="grid gap-4 auto-rows-min h-full" 
          style={{ 
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            minHeight: 'calc(100vh - 3rem)'
          }}
        >
          {widgets
            .filter(widget => widget.enabled && widget.component)
            .sort((a, b) => a.order - b.order)
            .map(renderWidget)}
        </div>

        {isEditing && (
          <EditDashboard
            darkMode={darkMode}
            widgets={widgets}
            onWidgetsChange={handleWidgetsChange}
            onClose={() => setIsEditing(false)}
          />
        )}
      </main>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes growBar {
          from {
            height: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default Dashboard 