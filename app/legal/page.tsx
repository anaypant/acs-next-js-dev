"use client"

import { Shield, Lock, Cookie, ArrowLeft } from "lucide-react"
import Link from "next/link"
import LegalHeader from "@/app/components/LegalHeader"

export default function LegalPage() {
  return (
    <>
      <LegalHeader />
      <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1]">
        <div className="max-w-4xl mx-auto p-6">
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-[#0e6537] hover:text-[#0a5a2f] mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>

          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-[#0e6537]/20 p-6 mb-6">
            <h1 className="text-2xl font-bold text-[#0e6537] mb-2">Legal Information</h1>
            <p className="text-gray-600">Please review our legal documents</p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Terms of Service Card */}
            <Link href="/legal/terms" className="block">
              <div className="bg-white rounded-lg shadow-sm border border-[#0e6537]/20 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 text-[#0e6537] mb-4">
                  <Shield className="w-6 h-6" />
                  <h2 className="text-xl font-semibold">Terms of Service</h2>
                </div>
                <p className="text-gray-600">
                  Read our terms of service to understand the rules and guidelines for using our platform.
                </p>
              </div>
            </Link>

            {/* Privacy Policy Card */}
            <Link href="/legal/privacy" className="block">
              <div className="bg-white rounded-lg shadow-sm border border-[#0e6537]/20 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 text-[#0e6537] mb-4">
                  <Lock className="w-6 h-6" />
                  <h2 className="text-xl font-semibold">Privacy Policy</h2>
                </div>
                <p className="text-gray-600">
                  Learn about how we collect, use, and protect your personal information.
                </p>
              </div>
            </Link>

            {/* Cookie Policy Card */}
            <Link href="/legal/cookies" className="block">
              <div className="bg-white rounded-lg shadow-sm border border-[#0e6537]/20 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 text-[#0e6537] mb-4">
                  <Cookie className="w-6 h-6" />
                  <h2 className="text-xl font-semibold">Cookie Policy</h2>
                </div>
                <p className="text-gray-600">
                  Understand how we use cookies and similar technologies on our website.
                </p>
              </div>
            </Link>
          </div>

          {/* Last Updated */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </>
  )
} 