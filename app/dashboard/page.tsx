"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { goto404 } from "../utils/error"
import Sidebar from "../component/dashboard/Sidebar"

const Dashboard = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [refreshDataEnabled, setRefreshDataEnabled] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // State for collapsible sections
  const [sectionsOpen, setSectionsOpen] = useState({
    keyWidgets: true,
    dataVisualization: true,
    navigation: true,
    functionalities: true,
  })

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

  // Effects
  useEffect(() => {
    if (status === 'unauthenticated') {
      goto404('405', 'User not authenticated', router)
    }
    
    // Add session logging
    console.log('Dashboard - Session Status:', status);
    console.log('Dashboard - Full Session:', session);
    if (session?.user) {
      console.log('Dashboard - User Info:', session.user);
    }
  }, [status, router, session])

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

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar 
        darkMode={darkMode}
        onDarkModeToggle={toggleDarkMode}
        onNotificationsToggle={toggleNotificationsEnabled}
        onRefreshToggle={toggleRefreshDataEnabled}
        onEditDashboard={() => setIsEditing(true)}
        sectionsOpen={sectionsOpen}
        toggleSection={toggleSection}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          {/* Main content area - currently empty */}
        </main>
      </div>
    </div>
  )
}

export default Dashboard 