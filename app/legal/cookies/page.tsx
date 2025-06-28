"use client"

import { Cookie, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { PageLayout } from "@/components/common/Layout/PageLayout"
import { applyTheme, getCurrentTheme } from "@/lib/theme/simple-theme"

export default function CookiesPage() {
  useEffect(() => {
    applyTheme(getCurrentTheme());
  }, []);

  return (
    <>
      {/* Top Row: Back Button & Logo */}
      <div className="w-full max-w-5xl md:max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 pt-6 pb-0">
        <Link 
          href="/legal"
          className="inline-flex items-center gap-2 text-[#0e6537] hover:text-[#0a5a2f] transition-colors text-base sm:text-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Legal</span>
        </Link>
        <Link href="/">
          <img src="/favicon.ico" alt="ACS Logo" className="w-16 h-16 object-contain cursor-pointer" />
        </Link>
      </div>
      <div className="w-full max-w-5xl md:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        {/* Top Bar/Header - matches legal/terms */}
        <div className="bg-[#0e6537] rounded-lg shadow-2xl border border-[#0e6537]/20 p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Cookie className="w-5 h-5 text-white" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">Cookie Policy</h1>
          </div>
          <p className="text-white/80 text-sm sm:text-base">Please review our Cookie Policy</p>
        </div>
        {/* Main Content */}
        <div className="bg-[var(--card)] rounded-lg shadow-sm border border-gray-300 p-4 sm:p-6 w-full max-w-5xl md:max-w-7xl mx-auto">
          <div className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-[var(--foreground)]">1. What Are Cookies?</h3>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base">
                Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They help the website remember your preferences, enhance your user experience, and provide anonymized tracking data to website owners.
              </p>
            </section>
            <section className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-[var(--foreground)]">2. Types of Cookies We Use</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800">Essential Cookies</h4>
                  <p className="text-[var(--text-secondary)] text-sm sm:text-base">These cookies are necessary for the proper functioning of our website and cannot be disabled. They allow you to navigate the site, use essential features, and access secure areas.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Performance Cookies</h4>
                  <p className="text-[var(--text-secondary)] text-sm sm:text-base">These cookies help us understand how users interact with our site by collecting and reporting information anonymously. This allows us to improve website functionality and user experience.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Functional Cookies</h4>
                  <p className="text-[var(--text-secondary)] text-sm sm:text-base">These cookies enable enhanced functionality and personalization, such as remembering language preferences or user settings.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Targeting/Advertising Cookies</h4>
                  <p className="text-[var(--text-secondary)] text-sm sm:text-base">We use these cookies to deliver advertisements more relevant to you and your interests. They may also be used to limit how often you see an ad and to measure the effectiveness of campaigns.</p>
                </div>
              </div>
            </section>
            <section className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-[var(--foreground)]">3. How We Use Cookies</h3>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base">We use cookies to:</p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 text-sm sm:text-base">
                <li>Analyze website traffic and usage patterns</li>
                <li>Remember user preferences and settings</li>
                <li>Improve performance and functionality</li>
                <li>Deliver personalized content and ads</li>
              </ul>
            </section>
            <section className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-[var(--foreground)]">4. Managing Cookies</h3>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base">You can control and manage cookies in your browser settings. Most browsers allow you to:</p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 text-sm sm:text-base">
                <li>View which cookies are stored</li>
                <li>Delete existing cookies</li>
                <li>Block future cookies</li>
              </ul>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base mt-2">Please note that disabling certain cookies may affect the functionality of our website.</p>
            </section>
            <section className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-[var(--foreground)]">5. Third-Party Cookies</h3>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base">
                Some cookies on our site may be placed by third-party services such as analytics tools (e.g., Google Analytics) or advertising platforms. These providers have their own privacy policies which govern the use of their cookies.
              </p>
            </section>
            <section className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-[var(--foreground)]">6. Updates to This Policy</h3>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base">
                We may update this Cookie Policy from time to time to reflect changes in technology or legal requirements. All updates will be posted on this page with a revised effective date.
              </p>
            </section>
            <section className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-[var(--foreground)]">7. Contact Us</h3>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base">
                If you have any questions about our use of cookies or this policy, please contact us at:
              </p>
              <div className="text-[var(--text-secondary)] space-y-1 text-sm sm:text-base">
                <p>Email: <a href="mailto:support@automatedconsultancy.com" className="text-[#0e6537] hover:underline">support@automatedconsultancy.com</a></p>
                <p>Address: 501 North Capitol Avenue, Indianapolis, IN 46204</p>
              </div>
            </section>
          </div>
        </div>
        <div className="mt-6 text-center text-xs sm:text-sm text-[var(--text-muted)] w-full max-w-5xl md:max-w-7xl mx-auto">
          Last updated: {new Date().toLocaleDateString()}
        </div>
        <div className="mb-4 text-center text-xs text-gray-400 w-full max-w-5xl md:max-w-7xl mx-auto">
          © 2025 ACS. All rights reserved.
        </div>
      </div>
    </>
  )
}