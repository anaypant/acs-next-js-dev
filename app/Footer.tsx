'use client';

/**
 * File: app/Footer.tsx
 * Purpose: Renders the application footer with navigation links, company information, and legal resources.
 * Author: acagliol
 * Date: 06/15/25
 * Version: 1.0.4
 */

import Link from "next/link"

/**
 * Footer Component
 * Application footer with responsive grid layout and navigation sections
 * 
 * Features:
 * - Responsive grid layout
 * - Company branding
 * - Navigation sections (Solutions, Company, Legal)
 * - Dynamic copyright year
 * - Hover effects on links
 * - Semantic HTML structure
 * 
 * Sections:
 * - Brand section with company description
 * - Solutions links for product features
 * - Company information and resources
 * - Legal documents and policies
 * 
 * @returns {JSX.Element} Complete footer with all navigation sections and copyright
 */
export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="container mx-auto px-4">
        {/* Main footer content in responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section with logo and description */}
          <div>
            <Link href="/" className="text-2xl font-bold" style={{ color: '#0e6537', textDecoration: 'none' }}>
              ACS
            </Link>
            <p className="mt-2 text-gray-600 font-semibold">AI-powered solutions for real estate professionals</p>
          </div>

          {/* Solutions navigation section */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Solutions</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/solutions" style={{ color: '#0e6537', textDecoration: 'none' }} className="font-semibold hover:text-[#157a42]">
                  Pricing Prediction
                </Link>
              </li>
              <li>
                <Link href="/solutions" style={{ color: '#0e6537', textDecoration: 'none' }} className="font-semibold hover:text-[#157a42]">
                  Email Communications
                </Link>
              </li>
              <li>
                <Link href="/solutions" style={{ color: '#0e6537', textDecoration: 'none' }} className="font-semibold hover:text-[#157a42]">
                  Marketing Optimization
                </Link>
              </li>
              <li>
                <Link href="/solutions" style={{ color: '#0e6537', textDecoration: 'none' }} className="font-semibold hover:text-[#157a42]">
                  Lead Scoring
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal documents section */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/terms" style={{ color: '#0e6537', textDecoration: 'none' }} className="font-semibold hover:text-[#157a42]">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" style={{ color: '#0e6537', textDecoration: 'none' }} className="font-semibold hover:text-[#157a42]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" style={{ color: '#0e6537', textDecoration: 'none' }} className="font-semibold hover:text-[#157a42]">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Company information section */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" style={{ color: '#0e6537', textDecoration: 'none' }} className="font-semibold hover:text-[#157a42]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" style={{ color: '#0e6537', textDecoration: 'none' }} className="font-semibold hover:text-[#157a42]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright section with dynamic year */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm font-semibold">
          <p>&copy; {new Date().getFullYear()} ACS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

/**
 * Change Log:
 * 06/15/25 - Version 1.0.3
 * - Removed: -- a/app/Footer.tsx
 * - Added: ++ b/app/Footer.tsx
 * - Removed:                 <Link href="/pricing" style={{ color: '#0e6537', textDecoration: 'none' }} className="font-semibold hover:text-[#157a42]">
 * - Added:                 <Link href="/solutions" style={{ color: '#0e6537', textDecoration: 'none' }} className="font-semibold hover:text-[#157a42]">
 * - Removed:                 <Link href="/email" style={{ color: '#0e6537', textDecoration: 'none' }} className="font-semibold hover:text-[#157a42]">
 * 06/11/25 - Version 1.0.1
 * - Updated documentation format
 * - Enhanced component documentation
 * - Added detailed feature descriptions
 * 
 * 5/25/25 - Version 1.0.0
 * - Created responsive footer layout
 * - Added navigation sections
 * - Implemented company branding
 * - Added legal resources
 * - Integrated dynamic copyright year
 * - Enhanced link hover effects
 * - Improved semantic structure
*/