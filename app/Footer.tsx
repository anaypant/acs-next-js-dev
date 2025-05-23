/**
 * @author Alejo Cagliolo
 * @date 2025-05-19
 * @todo Create and implement all page routes and hyperlinks for navigation items
 */

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="text-2xl font-bold text-[#127954]">
              ACS
            </Link>
            <p className="mt-2 text-gray-600 font-semibold">AI-powered solutions for real estate professionals</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Solutions</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing" className="text-gray-600 hover:text-[#127954] font-semibold">
                  Pricing Prediction
                </Link>
              </li>
              <li>
                <Link href="/email" className="text-gray-600 hover:text-[#127954] font-semibold">
                  Email Communications
                </Link>
              </li>
              <li>
                <Link href="/marketing" className="text-gray-600 hover:text-[#127954] font-semibold">
                  Marketing Optimization
                </Link>
              </li>
              <li>
                <Link href="/leads" className="text-gray-600 hover:text-[#127954] font-semibold">
                  Lead Scoring
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#127954] font-semibold">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-[#127954] font-semibold">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-[#127954] font-semibold">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-[#127954] font-semibold">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-[#127954] font-semibold">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-[#127954] font-semibold">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-600 hover:text-[#127954] font-semibold">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm font-semibold">
          <p>&copy; {new Date().getFullYear()} ACS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 