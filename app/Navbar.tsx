/**
 * File: app/Navbar.tsx
 * Purpose: Renders the main navigation bar with responsive design, animated hover effects, and authentication links.
 * Author: Alejo Cagliolo
 * Date: 6/11/25
 * Version: 1.5.0
 */

"use client"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Logo } from "@/app/utils/Logo"

/**
 * Navbar Component
 * Main navigation component with responsive design and interactive elements
 * 
 * Features:
 * - Responsive navigation menu
 * - Animated hover effects using Framer Motion
 * - Mobile-friendly design with hamburger menu
 * - Sticky positioning
 * - Gradient text and button effects
 * 
 * State Management:
 * - Tracks hovered navigation items
 * - Manages responsive menu state
 * - Controls mobile menu visibility
 * 
 * @returns {JSX.Element} Complete navigation bar with all interactive elements
 */
const Navbar = () => {
  // Track which navigation item is currently hovered
  const [hovered, setHovered] = useState<string | null>(null)
  // Track mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // Check if we're on the dashboard
  const [isDashboard, setIsDashboard] = useState(false)

  // Check if we're on the dashboard
  useEffect(() => {
    setIsDashboard(window.location.pathname.startsWith('/dashboard'))
  }, [])

  const navigationItems = ["Home", "About", "Contact"]

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 sm:py-4 lg:py-5">
          {/* Logo/Brand link with gradient hover effect */}
          <div className="flex-shrink-0">
            <Logo href="/" size="lg" variant="icon-only" />
          </div>

          {/* Mobile menu button - only show if not on dashboard */}
          {!isDashboard && (
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 sm:h-7 sm:w-7 text-[#0e6537]" />
              ) : (
                <Menu className="h-6 w-6 sm:h-7 sm:w-7 text-[#0e6537]" />
              )}
            </button>
          )}

          {/* Desktop navigation - Centered - only show if not on dashboard */}
          {!isDashboard && (
            <div className="hidden md:flex flex-1 justify-center">
              <div className="flex items-center space-x-8 lg:space-x-12 xl:space-x-16">
                {navigationItems.map((item, index) => {
                  const href = item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`
                  return (
                    <Link
                      key={index}
                      href={href}
                      className="relative py-2 px-1"
                      onMouseEnter={() => setHovered(item)}
                      onMouseLeave={() => setHovered(null)}
                      style={{ color: '#0e6537', textDecoration: 'none' }}
                    >
                      <span className="relative z-10 transition-colors duration-300 text-base lg:text-lg xl:text-xl font-medium" style={{ color: '#0e6537' }}>
                        {item}
                      </span>
                      {hovered === item && (
                        <motion.span
                          className="absolute inset-0 bg-[#E8F5EE] rounded-md z-0"
                          layoutId="navBackground"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                        />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Invisible spacer to balance the logo on the left */}
          {!isDashboard && (
            <div className="hidden md:flex flex-shrink-0 w-[120px]">
            </div>
          )}
        </div>

        {/* Mobile menu - only show if not on dashboard */}
        {!isDashboard && (
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden"
              >
                <div className="pt-4 pb-3 space-y-1">
                  {navigationItems.map((item, index) => {
                    const href = item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`
                    return (
                      <Link
                        key={index}
                        href={href}
                        className="block px-3 py-3 rounded-md text-base font-medium text-[#0e6537] hover:bg-[#E8F5EE] transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{ color: '#0e6537' }}
                      >
                        {item}
                      </Link>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </nav>
  )
}

export default Navbar

/**
 * Change Log:
 * 06/15/25 - Version 1.5.0
 * - Removed sign in and get started authentication links from both desktop and mobile navigation
 * - Removed authentication section from mobile menu
 * - Maintained layout balance with empty div for desktop view
 * - Updated component documentation to reflect removal of authentication features
 * 
 * 06/15/25 - Version 1.4.0
 * - Removed top padding to eliminate white space between navbar and hero
 * - Increased logo size by removing width constraint
 * - Made navbar elements larger and more responsive
 * - Added responsive text sizes for navigation items
 * - Improved spacing and padding for different screen sizes
 * - Enhanced mobile menu button sizing
 * - Added z-index for proper layering
 * 
 * 06/11/25 - Version 1.3.0
 * - Added Solutions page to navigation items
 * - Updated navigation order for better user flow
 * 
 * 06/11/25 - Version 1.2.0
 * - Added mobile menu with hamburger button
 * - Improved responsive design for all screen sizes
 * - Added smooth animations for mobile menu
 * - Enhanced accessibility with proper ARIA labels
 * - Improved touch targets for mobile devices
 * - Added proper spacing and padding for mobile view
 * 
 * 06/11/25 - Version 1.1.0
 * - Enhanced documentation with detailed component information
 * - Added comprehensive state management documentation
 * - Improved code readability with additional comments
 * - Added dependency documentation
 * 
 * 5/25/25 - Initial version
 * - Created responsive navigation bar
 * - Implemented hover animations with Framer Motion
 * - Added authentication links
 * - Integrated gradient effects
 * - Enhanced mobile responsiveness
 * - Added sticky positioning
 * - Implemented backdrop blur effect
 */
