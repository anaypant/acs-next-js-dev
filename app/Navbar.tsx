/**
 * File: app/Navbar.tsx
 * Purpose: Renders the main navigation bar with responsive design, animated hover effects, and authentication links.
 * Author: Alejo Cagliolo
 * Date: 5/25/25
 * Version: 1.0.0
 */

"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"

/**
 * Navbar Component
 * Main navigation component with responsive design and interactive elements
 * 
 * Features:
 * - Responsive navigation menu
 * - Animated hover effects using Framer Motion
 * - Authentication links (Sign in/Get Started)
 * - Mobile-friendly design
 * - Sticky positioning
 * - Gradient text and button effects
 * 
 * State Management:
 * - Tracks hovered navigation items
 * - Manages responsive menu state
 * 
 * @returns {JSX.Element} Complete navigation bar with all interactive elements
 */
const Navbar = () => {
  // Track which navigation item is currently hovered
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Brand link with gradient hover effect */}
          <Link href="/" className="text-2xl font-bold relative group">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0A2F1F] to-[#0A2F1F] group-hover:from-[#0A2F1F] group-hover:to-[#34A65F] transition-all duration-500">
              ACS
            </span>
          </Link>

          {/* Main navigation links with hover animations */}
          <div className="hidden md:flex items-center space-x-8">
            {["Home", "Solutions", "Case Studies", "Contact"].map((item, index) => {
              const href = item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`
              return (
                <Link
                  key={index}
                  href={href}
                  className="relative py-2 px-1"
                  onMouseEnter={() => setHovered(item)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span className="relative z-10 transition-colors duration-300 text-gray-600 hover:text-[#0A2F1F]">
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

          {/* Authentication links with hover effects */}
          <div className="flex items-center space-x-6">
            {/* Sign in link with hover animation */}
            <Link
              href="/login"
              className="relative overflow-hidden group py-2 px-3"
              onMouseEnter={() => setHovered("signin")}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="relative z-10 font-medium transition-colors duration-300 text-gray-600 hover:text-[#0A2F1F]">
                Sign in
              </span>
              {hovered === "signin" && (
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

            {/* Get Started button with gradient and hover effects */}
            <Link
              href="/signup"
              className="relative group"
              onMouseEnter={() => setHovered("getstarted")}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="relative z-10 inline-flex items-center gap-2 px-6 py-2.5 font-medium text-white rounded-full overflow-hidden">
                Get Started
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </span>
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0A2F1F] to-[#1A5F3F] transition-all duration-300 ease-out group-hover:scale-[1.03] group-hover:shadow-[0_0_20px_rgba(10,47,31,0.4)]"></span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

/**
 * Change Log:
 * 5/25/25 - Initial version
 * - Created responsive navigation bar
 * - Implemented hover animations with Framer Motion
 * - Added authentication links
 * - Integrated gradient effects
 * - Enhanced mobile responsiveness
 * - Added sticky positioning
 * - Implemented backdrop blur effect
 */
