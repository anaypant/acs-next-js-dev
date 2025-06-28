"use client"

import { useEffect } from "react"
import { Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { PageLayout } from "@/components/common/Layout/PageLayout"
import { applyTheme, getCurrentTheme } from "@/lib/theme/simple-theme"

export default function TermsPage() {
  useEffect(() => {
    const theme = getCurrentTheme()
    applyTheme(theme)
  }, [])

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
        {/* Top Bar/Header - matches legal page */}
        <div className="bg-[#0e6537] rounded-lg shadow-2xl border border-[#0e6537]/20 p-4 sm:p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-white" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">Terms of Service</h1>
          </div>
          <p className="text-white/80 text-sm sm:text-base">Please review our Terms of Service</p>
        </div>
        {/* Main Content */}
        <div className="bg-[var(--card)] rounded-lg shadow-sm border border-gray-300 p-4 sm:p-6 w-full max-w-5xl md:max-w-7xl mx-auto">
          <div className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-[var(--foreground)]">1. Acceptance of Terms</h3>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base">
                By accessing and using ACS, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-[var(--foreground)]">2. Use License</h3>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base">
                Permission is granted to temporarily use ACS for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 text-sm sm:text-base">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software contained on ACS</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-[var(--foreground)]">3. User Responsibilities</h3>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base">
                As a user of ACS, you are responsible for:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 text-sm sm:text-base">
                <li>Maintaining the confidentiality of your account</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
                <li>Complying with all applicable laws and regulations</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-[var(--foreground)]">4. Service Modifications</h3>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base">
                ACS reserves the right to modify or discontinue, temporarily or permanently, the service with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
              </p>
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