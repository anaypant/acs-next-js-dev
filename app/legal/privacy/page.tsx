"use client"

import { Lock } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1]">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-[#0e6537]/20 p-6 mb-6">
          <h1 className="text-2xl font-bold text-[#0e6537] mb-2">Privacy Policy</h1>
          <p className="text-gray-600">Please review our Privacy Policy</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-[#0e6537]/20 p-6">
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
        </div>

        {/* Last Updated */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  )
} 