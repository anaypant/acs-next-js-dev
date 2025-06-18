/**
 * File: app/dashboard/Sidebar.tsx
 * Purpose: Implements a collapsible sidebar navigation with context management and responsive design.
 * Author: acagliol
 * Date: 06/15/25
 * Version: 1.2.0
 */

"use client"
import { Home, Mail, Users, MessageSquare, BarChart3, Settings, Phone, Calendar, PanelLeft, AlertTriangle, RefreshCw, ChevronDown, X, Shield, ShieldOff, FileText, Menu, Trash2, CreditCard, LogOut, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import type React from "react"
import { useState, createContext, useContext, useEffect, useRef } from "react"
import { useSession, signOut } from "next-auth/react"
import type { Session } from "next-auth"
import { clearAuthData } from '../../utils/auth'
import { Logo } from "@/app/utils/Logo"

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
        // On desktop, start with sidebar open
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
        {/* Mobile overlay removed - mobile menu is handled separately */}
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

  // Don't render sidebar on mobile - mobile menu is handled separately
  if (isMobile) {
    return null;
  }

  return (
    <div
      className={`
        ${isOpen
          ? 'w-16 sm:w-20 md:w-64'
          : 'w-12 sm:w-16 md:w-28'}
        transition-all duration-300 ease-in-out bg-gradient-to-b from-[#0a5a2f] via-[#0e6537] to-[#157a42] border-r border-white/10 fixed h-screen z-50 shadow-xl
      `}
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
  const { isOpen, toggle } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)
  const [screenSize, setScreenSize] = useState<'mobile' | 'sm' | 'md'>('md')

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth
      if (width < 640) {
        setIsMobile(true)
        setScreenSize('mobile')
      } else if (width < 768) {
        setIsMobile(false)
        setScreenSize('sm')
      } else {
        setIsMobile(false)
        setScreenSize('md')
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  let logoSize: 'sm' | 'md' | 'lg' = 'lg'
  if (screenSize === 'mobile') logoSize = 'sm'
  else if (screenSize === 'sm') logoSize = 'md'
  else logoSize = 'lg'

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        {/* Responsive Logo: show icon+text when open, icon-only when collapsed */}
        {isOpen ? (
          <Logo size={logoSize} variant="default" whiteText />
        ) : (
          <Logo size={logoSize === 'lg' ? 'md' : 'sm'} variant="icon-only" />
        )}
        <div className="flex items-center gap-2">
          {isMobile && (
            <button
              onClick={toggle}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
              title="Close sidebar"
            >
              <X className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
            </button>
          )}
          {!isMobile && (
            <button
              onClick={toggle}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
              title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isOpen ? (
                <ChevronLeft className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
              ) : (
                <ChevronRight className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
              )}
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

/**
 * SidebarGroup Component
 * Groups related sidebar items
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.title - Group title (only shown when sidebar is open)
 * @returns {JSX.Element} Group container
 */
function SidebarGroup({ children, title }: { children: React.ReactNode; title?: string }) {
  const { isOpen } = useSidebar()
  
  return (
    <div className="px-4 py-4">
      {title && isOpen && (
        <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3 px-2">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

/**
 * SidebarMenu Component
 * Navigation menu container
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Menu container
 */
function SidebarMenu({ children, className }: { children: React.ReactNode; className?: string }) {
  return <nav className={`space-y-1 ${className || ''}`}>{children}</nav>
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
    <button
      onClick={toggle}
      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
    >
      <Menu className="h-6 w-6 text-white" />
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
interface SidebarInsetProps {
  children: React.ReactNode;
  className?: string;
}

function SidebarInset({ children, className }: SidebarInsetProps) {
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

  // Responsive margin logic to match sidebar width
  let marginClass = '';
  if (isMobile) {
    marginClass = 'ml-0'; // No margin on mobile - mobile menu is handled separately
  } else {
    marginClass = isOpen ? 'ml-16 sm:ml-20 md:ml-64' : 'ml-12 sm:ml-16 md:ml-28';
  }

  return (
    <div
      className={`${marginClass} transition-all duration-300 ease-in-out ${className || ''}`}
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
    description: "Overview & Analytics"
  },
  {
    title: "Conversations",
    icon: MessageSquare,
    url: "/dashboard/conversations",
    description: "Manage Leads"
  },
  {
    title: "History",
    icon: Clock,
    url: "/dashboard/history",
    description: "Completed Threads"
  },
  {
    title: "Resources",
    icon: FileText,
    url: "/dashboard/resources",
    description: "Help & Documentation"
  },
  {
    title: "Junk",
    icon: Trash2,
    url: "/dashboard/junk",
    description: "Spam & Filtered"
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/settings",
    description: "Account & Preferences"
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
    // Clear session_id cookie before signing out
    clearAuthData()
    await signOut({ callbackUrl: '/' })
  }

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center gap-3 px-3 py-3 text-sm rounded-xl transition-all duration-200 w-full text-white hover:text-white hover:bg-white/10 group cursor-pointer ${
        isOpen ? 'justify-start' : 'justify-center w-full'
      }`}
    >
      <LogOut className={`h-6 w-6 md:h-5 md:w-5 group-hover:scale-110 transition-transform ${!isOpen ? 'mx-auto' : ''}`} />
      {isOpen && (
        <div className="flex flex-col items-start">
          <span className="font-medium">Logout</span>
          <span className="text-xs text-white/60">Sign out of account</span>
        </div>
      )}
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
        {/* Main navigation section */}
        <SidebarGroup title="Navigation">
          <SidebarMenu className="space-y-1">
            {mainNavigation.map((item) => (
              <SidebarMenuItem key={item.title}>
                <a
                  href={item.url}
                  className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm rounded-xl transition-all duration-200 text-white hover:text-white hover:bg-white/10 group cursor-pointer ${
                    isOpen ? 'justify-start' : 'justify-center w-full'
                  }`}
                >
                  <item.icon className={`h-6 w-6 md:h-5 md:w-5 group-hover:scale-110 transition-transform ${!isOpen ? 'mx-auto' : ''}`} />
                  {isOpen && (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-xs text-white/60">{item.description}</span>
                      </div>
                      {item.title === "Junk" && unreadSpamCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
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

        {/* User section */}
        {isOpen && session?.user && (
          <SidebarGroup title="Account">
            <div className="px-3 py-3 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {session.user.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-medium text-sm">{session.user.name || 'User'}</span>
                  <span className="text-white/60 text-xs">{session.user.email}</span>
                </div>
              </div>
            </div>
          </SidebarGroup>
        )}

        {/* Logout button */}
        <div className="px-4 mt-auto">
          <LogoutButton />
        </div>

        {/* Footer section */}
        {isOpen && (
          <div className="px-4 py-4 border-t border-white/10">
            <div className="flex flex-col gap-3 text-xs text-white/60">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <a href="/legal/terms" className="hover:text-white transition-colors">Terms</a>
                <a href="/legal/privacy" className="hover:text-white transition-colors">Privacy</a>
                <a href="/legal/cookies" className="hover:text-white transition-colors">Cookies</a>
              </div>
              <span className="text-white/40">© 2025 ACS. All rights reserved.</span>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}

export { SidebarProvider, AppSidebar, SidebarInset, Logo, useSidebar, SidebarTrigger }

/**
 * Change Log:
 * 06/15/25 - Version 1.2.0
 * - Enhanced mobile responsiveness with full-width sidebar
 * - Improved overlay with backdrop blur
 * - Better close button functionality
 * - Optimized mobile navigation experience
 * - Enhanced sidebar animations and transitions
 * 
 * 06/15/25 - Version 1.1.0
 * - Enhanced sidebar design with modern styling
 * - Improved collapse functionality for desktop
 * - Added user profile section
 * - Better visual hierarchy and spacing
 * - Enhanced hover effects and transitions
 * - Improved accessibility and user experience
 * 
 * 06/15/25 - Version 1.0.2
 * - Added mobile responsiveness
 * - Enhanced sidebar animations
 * - Improved accessibility
 * - Added keyboard navigation
 */
