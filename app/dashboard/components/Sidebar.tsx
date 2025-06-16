/**
 * File: app/dashboard/Sidebar.tsx
 * Purpose: Implements a collapsible sidebar navigation with context management and responsive design.
 * Author: acagliol
 * Date: 06/15/25
 * Version: 1.0.2
 */

"use client"
import { Home, Mail, Users, MessageSquare, BarChart3, Settings, Phone, Calendar, PanelLeft, AlertTriangle, RefreshCw, ChevronDown, X, Shield, ShieldOff, FileText, Menu, Trash2, CreditCard, LogOut } from "lucide-react"
import type React from "react"
import { useState, createContext, useContext, useEffect, useRef } from "react"
import { useSession, signOut } from "next-auth/react"
import type { Session } from "next-auth"

/**
 * SidebarContext
 * Context for managing sidebar state across components
 */
const SidebarContext = createContext({
  isOpen: true,
  toggle: () => {},
})

/**
 * useSidebar Hook
 * Custom hook to access sidebar context
 * @returns {Object} Sidebar context with isOpen state and toggle function
 */
function useSidebar() {
  return useContext(SidebarContext)
}

/**
 * Logo Component
 * Displays the ACS logo with customizable size and gradient styling
 * 
 * @param {Object} props - Component props
 * @param {"sm" | "lg"} props.size - Size variant of the logo
 * @returns {JSX.Element} ACS logo with gradient background
 */
function Logo({ size = "lg" }: { size?: "sm" | "lg" }) {
  const { isOpen } = useSidebar()

  if (size === "sm") {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-[#0a5a2f] via-[#0e6537] to-[#157a42] rounded-lg flex items-center justify-center shadow-sm">
          <span className="font-bold text-sm bg-gradient-to-r from-[#0a5a2f] to-[#157a42] bg-clip-text text-transparent">ACS</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 px-3 py-4">
      <div className="w-10 h-10 bg-gradient-to-br from-[#e6f5ec] via-[#f0f9f4] to-[#d8eee1] rounded-lg flex items-center justify-center shadow-sm border border-white/20">
        <span className="font-bold text-lg bg-gradient-to-r from-[#0a5a2f] to-[#157a42] bg-clip-text text-transparent">
          ACS
        </span>
      </div>
      {isOpen && (
        <div className="flex flex-col">
          <span style={{ color: 'white' }} className="text-xs opacity-80"></span>
        </div>
      )}
    </div>
  )
}

/**
 * SidebarProvider Component
 * Provides sidebar context to child components
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Context provider wrapper
 */
function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggle = () => setIsOpen(!isOpen)

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      <div className="relative">
        {isMobile && isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" 
            onClick={toggle}
            style={{ opacity: isOpen ? 1 : 0 }}
          />
        )}
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

/**
 * Sidebar Component
 * Main sidebar container with collapsible functionality
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Sidebar container
 */
function Sidebar({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div
      className={`${
        isOpen ? "w-64" : isMobile ? "w-0" : "w-16"
      } transition-all duration-300 bg-gradient-to-b from-[#0a5a2f] via-[#0e6537] to-[#157a42] border-r border-[#0e6537]/20 fixed h-screen z-50 ${
        isMobile && !isOpen ? "translate-x-[-100%]" : ""
      }`}
    >
      {children}
    </div>
  )
}

/**
 * SidebarContent Component
 * Container for sidebar content
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Content container
 */
function SidebarContent({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col h-full">{children}</div>
}

/**
 * SidebarGroup Component
 * Groups related sidebar items
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Group container
 */
function SidebarGroup({ children }: { children: React.ReactNode }) {
  return <div className="px-3 py-4">{children}</div>
}

/**
 * SidebarMenu Component
 * Navigation menu container
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Menu container
 */
function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <nav className="space-y-2">{children}</nav>
}

/**
 * SidebarMenuItem Component
 * Individual menu item container
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Menu item container
 */
function SidebarMenuItem({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

/**
 * SidebarTrigger Component
 * Button to toggle sidebar state
 * 
 * @returns {JSX.Element} Toggle button
 */
function SidebarTrigger() {
  const { toggle } = useSidebar()

  return (
    <button 
      onClick={toggle} 
      className="p-2 hover:bg-gray-100 rounded-lg fixed top-4 right-4 z-50 md:relative md:top-0 md:right-0"
    >
      <Menu className="h-5 w-5" />
    </button>
  )
}

/**
 * SidebarInset Component
 * Main content area wrapper
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Content wrapper
 */
function SidebarInset({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div 
      className={`bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1] h-screen overflow-y-auto ${
        isMobile 
          ? "ml-0" 
          : isOpen 
            ? "ml-64" 
            : "ml-16"
      } transition-all duration-300`}
    >
      {children}
    </div>
  )
}

/**
 * Main navigation configuration
 * Defines routes and icons for the sidebar menu
 */
const mainNavigation = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/dashboard",
  },
  {
    title: "Conversations",
    icon: MessageSquare,
    url: "/dashboard/conversations",
  },
  {
    title: "Junk",
    icon: Trash2,
    url: "/dashboard/junk",
  },
  {
    title: "Usage & Billing",
    icon: CreditCard,
    url: "/dashboard/usage",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/settings",
  },
]

/**
 * LogoutButton Component
 * Button to handle user logout
 * 
 * @returns {JSX.Element} Logout button with icon and text
 */
function LogoutButton() {
  const { isOpen } = useSidebar()
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors w-full text-white hover:text-white hover:bg-[#0e6537]/30`}
    >
      <LogOut className="h-4 w-4" style={{ color: 'white' }} />
      {isOpen && <span>Logout</span>}
    </button>
  )
}

/**
 * AppSidebar Component
 * Main sidebar implementation with navigation and footer
 * 
 * @returns {JSX.Element} Complete sidebar with navigation
 */
function AppSidebar() {
  const { data: session, status } = useSession() as { data: (Session & { user?: { id: string } }) | null, status: string };
  const { isOpen } = useSidebar();
  const [unreadSpamCount, setUnreadSpamCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      mounted.current = false;
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (!mounted.current || !session?.user?.id || status !== 'authenticated') return;

    const handleJunkEmailCountUpdate = (event: CustomEvent<number>) => {
      setUnreadSpamCount(event.detail);
    };

    window.addEventListener('junkEmailCountUpdated', handleJunkEmailCountUpdate as EventListener);

    const interval = setInterval(() => {
      // Check for new junk emails
    }, 60000); // Check every minute

    return () => {
      clearInterval(interval);
      window.removeEventListener('junkEmailCountUpdated', handleJunkEmailCountUpdate as EventListener);
    };
  }, [session?.user?.id, status]);

  return (
    <Sidebar>
      <SidebarContent>
        {/* Logo section */}
        <Logo />

        {/* Main navigation section */}
        <SidebarGroup>
          <SidebarMenu className="space-y-0.5">
            {mainNavigation.map((item) => (
              <SidebarMenuItem key={item.title}>
                <a
                  href={item.url}
                  className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-white hover:text-white hover:bg-[#0e6537]/30`}
                >
                  <item.icon className="h-4 w-4" style={{ color: 'white' }} />
                  {isOpen && (
                    <div className="flex items-center justify-between w-full">
                      <span style={{ color: 'white' }}>{item.title}</span>
                      {item.title === "Junk" && unreadSpamCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {unreadSpamCount}
                        </span>
                      )}
                    </div>
                  )}
                </a>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Logout button */}
        <div className="px-3">
          <LogoutButton />
        </div>

        {/* Footer section */}
        <div className={`mt-auto px-3 py-4 border-t border-white/20 ${!isOpen ? 'hidden' : ''}`}>
          <div className="flex flex-col gap-2 text-xs text-white/60">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <a href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/legal/cookies" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
            <span className="text-white/40 mt-2">© 2025 ACS. All rights reserved.</span>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}

export {
  SidebarProvider,
  AppSidebar,
  SidebarTrigger,
  SidebarInset,
  Logo,
  useSidebar
}

/**
 * Change Log:
 * 06/15/25 - Version 1.0.2
 * - Removed: -- a/app/dashboard/components/Sidebar.tsx
 * - Added: ++ b/app/dashboard/components/Sidebar.tsx
 * - Removed:   {
 * - Removed:     title: "Privacy Policy",
 * - Removed:     icon: FileText,
 * 06/11/25 - Version 1.0.1
 * - Enhanced mobile responsiveness
 * - Improved navigation menu accessibility
 * - Added comprehensive documentation
 * - Optimized performance
 * 
 * 5/25/25 - Version 1.0.0
 * - Created collapsible sidebar with context management
 * - Implemented responsive navigation menu
 * - Added footer with legal links
 * - Integrated gradient styling and animations
