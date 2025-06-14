"use client"

import { Shield, Lock, FileText, ChevronRight } from "lucide-react"
import { useState } from "react"

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<'tos' | 'privacy'>('tos')

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1]">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-[#0e6537]/20 p-6 mb-6">
          <h1 className="text-2xl font-bold text-[#0e6537] mb-2">Legal Information</h1>
          <p className="text-gray-600">Please review our Terms of Service and Privacy Policy</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('tos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'tos'
                ? 'bg-[#0e6537] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'privacy'
                ? 'bg-[#0e6537] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Lock className="w-4 h-4" />
            Privacy Policy
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-[#0e6537]/20 p-6">
          {activeTab === 'tos' ? (
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
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[#0e6537] mb-4">
                <Lock className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Privacy Policy</h2>
              </div>

              <section className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">1. Information We Collect</h3>
                <p className="text-gray-600">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Account information (name, email, phone number)</li>
                  <li>Communication data</li>
                  <li>Usage data and preferences</li>
                  <li>Device and connection information</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">2. How We Use Your Information</h3>
                <p className="text-gray-600">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Provide and maintain our services</li>
                  <li>Improve and personalize your experience</li>
                  <li>Communicate with you about our services</li>
                  <li>Protect against fraud and abuse</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">3. Data Security</h3>
                <p className="text-gray-600">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">4. Your Rights</h3>
                <p className="text-gray-600">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                </ul>
              </section>
            </div>
          )}
        </div>

        {/* Last Updated */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  )
} 