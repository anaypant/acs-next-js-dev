"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bell,
  ChevronDown,
  LineChart,
  Menu,
  Search,
  Settings,
  Zap,
  Phone,
  Briefcase,
  Package,
  MoreHorizontal,
  Grid,
  ArrowUp,
  User,
  LayoutGrid,
  Sun,
  Moon,
} from "lucide-react"
import Sidebar from "../components/DashboardPage/Sidebar"
import EditDashboard from "../components/DashboardPage/EditDashboard"
import WelcomeSection from "../components/DashboardPage/WelcomeSection"
import KeyMetrics from "../components/DashboardPage/KeyMetrics"
import DashboardChart from "../components/DashboardPage/DashboardChart"
import NotificationBox from "../components/DashboardPage/NotificationBox"
import TotalSalesWidget from "../components/DashboardPage/TotalSalesWidget"
import EarningsWidget from "../components/DashboardPage/EarningsWidget"
import AveragePriceWidget from "../components/DashboardPage/AveragePriceWidget"
import TotalProductsWidget from "../components/DashboardPage/TotalProductsWidget"
import CampaignDistributionWidget from "../components/DashboardPage/CampaignDistributionWidget"
import NavigationWidget from "../components/DashboardPage/NavigationWidget"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { goto404 } from "../utils/error"

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
type NotificationType = "newLeads" | "followUps" | "recentUpdates"

interface SectionState {
  keyWidgets: boolean
  dataVisualization: boolean
  navigation: boolean
  functionalities: boolean
}

interface NotificationState {
  newLeads: boolean
  followUps: boolean
  recentUpdates: boolean
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
      span: 8 // Spans 8 columns
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
      span: 4 // Takes remaining 4 columns in first row
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
      span: 4 // First 4 columns of second row
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
      span: 8 // Remaining 8 columns of second row
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
      span: 4 // First 4 columns of third row
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
      span: 4 // Middle 4 columns of third row
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
      span: 4 // Last 4 columns of third row
    }
  }
];

const Dashboard = () => {
  // State management
  const router = useRouter()
  const { data: session, status } = useSession()
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

  // State for notification badges
  const [notifications, setNotifications] = useState({
    newLeads: true,
    followUps: false,
    recentUpdates: false,
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

  const toggleNotification = (type: string) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type as keyof typeof notifications],
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
    console.log('status', status)
    if (status === 'unauthenticated') {
      goto404('405', 'User not authenticated', router)
    }
    else {
      // Print all session user fields
      console.log('Session User Fields:')
      console.log('-------------------')
      console.log('Full Session:', session)
      console.log('User Object:', session?.user)
      console.log('id:', session?.user?.id)
      console.log('email:', session?.user?.email)
      console.log('name:', session?.user?.name)
      console.log('provider:', session?.user?.provider)
      console.log('authType:', session?.user?.authType)
      console.log('accessToken:', session?.user?.accessToken)
      console.log('sessionCookie:', session?.user?.sessionCookie)
      console.log('-------------------')
    }
  }, [status, router])

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
          userName={session?.user?.name || 'Guest'}
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

      
    </div>
  )
}

export default Dashboard 