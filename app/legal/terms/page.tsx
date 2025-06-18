"use client"

import { Shield, FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1]">
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <Link 
          href="/legal"
          className="inline-flex items-center gap-2 bg-[#0e6537] text-white px-4 py-2 rounded-lg hover:bg-[#0a5a2f] mb-4 transition-colors shadow-md"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Legal</span>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-[#0e6537]/20 p-6 mb-6">
          <h1 className="text-2xl font-bold text-[#0e6537] mb-2">Terms of Service</h1>
          <p className="text-gray-600">Please review our Terms of Service</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-[#0e6537]/20 p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#0e6537] mb-4">
              <Shield className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Terms of Service</h2>
            </div>

            <section className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">1. Acceptance of Terms</h3>
              <p className="text-gray-600">
                By accessing and using ACS, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">2. Use License</h3>
              <p className="text-gray-600">
                Permission is granted to temporarily use ACS for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software contained on ACS</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">3. User Responsibilities</h3>
              <p className="text-gray-600">
                As a user of ACS, you are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Maintaining the confidentiality of your account</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
                <li>Complying with all applicable laws and regulations</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">4. Service Modifications</h3>
              <p className="text-gray-600">
                ACS reserves the right to modify or discontinue, temporarily or permanently, the service with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
              </p>
            </section>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  )
} 