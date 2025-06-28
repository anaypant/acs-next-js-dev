"use client"

import { Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"
import { PageLayout } from "@/components/common/Layout/PageLayout"
import { applyTheme, getCurrentTheme } from "@/lib/theme/simple-theme"

export default function PrivacyPage() {
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
            <Lock className="w-5 h-5 text-white" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="text-white/80 text-sm sm:text-base">Please review our Privacy Policy</p>
        </div>
        {/* Main Content */}
        <div className="bg-[var(--card)] rounded-lg shadow-sm border border-gray-300 p-4 sm:p-6 w-full max-w-5xl md:max-w-7xl mx-auto">
          <div className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-[var(--foreground)]">1. Information We Collect</h3>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 text-sm sm:text-base">
                <li>Account information (name, email, phone number)</li>
                <li>Communication data</li>
                <li>Usage data and preferences</li>
                <li>Device and connection information</li>
              </ul>
            </section>
            <section className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-[var(--foreground)]">2. How We Use Your Information</h3>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 text-sm sm:text-base">
                <li>Provide and maintain our services</li>
                <li>Improve and personalize your experience</li>
                <li>Communicate with you about our services</li>
                <li>Protect against fraud and abuse</li>
              </ul>
            </section>
            <section className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-[var(--foreground)]">3. Data Security</h3>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>
            <section className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-[var(--foreground)]">4. Your Rights</h3>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 text-sm sm:text-base">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
              </ul>
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