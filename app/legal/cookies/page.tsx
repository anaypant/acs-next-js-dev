"use client"

import { Cookie } from "lucide-react"

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] via-[#e6f5ec] to-[#d8eee1]">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-[#0e6537]/20 p-6 mb-6">
          <h1 className="text-2xl font-bold text-[#0e6537] mb-2">Cookie Policy</h1>
          <p className="text-gray-600">Please review our Cookie Policy</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-[#0e6537]/20 p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[#0e6537] mb-4">
              <Cookie className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Cookie Policy</h2>
            </div>

            <section className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">1. What Are Cookies?</h3>
              <p className="text-gray-600">
                Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They help the website remember your preferences, enhance your user experience, and provide anonymized tracking data to website owners.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">2. Types of Cookies We Use</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800">Essential Cookies</h4>
                  <p className="text-gray-600">These cookies are necessary for the proper functioning of our website and cannot be disabled. They allow you to navigate the site, use essential features, and access secure areas.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Performance Cookies</h4>
                  <p className="text-gray-600">These cookies help us understand how users interact with our site by collecting and reporting information anonymously. This allows us to improve website functionality and user experience.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Functional Cookies</h4>
                  <p className="text-gray-600">These cookies enable enhanced functionality and personalization, such as remembering language preferences or user settings.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Targeting/Advertising Cookies</h4>
                  <p className="text-gray-600">We use these cookies to deliver advertisements more relevant to you and your interests. They may also be used to limit how often you see an ad and to measure the effectiveness of campaigns.</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">3. How We Use Cookies</h3>
              <p className="text-gray-600">We use cookies to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Analyze website traffic and usage patterns</li>
                <li>Remember user preferences and settings</li>
                <li>Improve performance and functionality</li>
                <li>Deliver personalized content and ads</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">4. Managing Cookies</h3>
              <p className="text-gray-600">You can control and manage cookies in your browser settings. Most browsers allow you to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>View which cookies are stored</li>
                <li>Delete existing cookies</li>
                <li>Block future cookies</li>
              </ul>
              <p className="text-gray-600 mt-2">Please note that disabling certain cookies may affect the functionality of our website.</p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">5. Third-Party Cookies</h3>
              <p className="text-gray-600">
                Some cookies on our site may be placed by third-party services such as analytics tools (e.g., Google Analytics) or advertising platforms. These providers have their own privacy policies which govern the use of their cookies.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">6. Updates to This Policy</h3>
              <p className="text-gray-600">
                We may update this Cookie Policy from time to time to reflect changes in technology or legal requirements. All updates will be posted on this page with a revised effective date.
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">7. Contact Us</h3>
              <p className="text-gray-600">
                If you have any questions about our use of cookies or this policy, please contact us at:
              </p>
              <div className="text-gray-600 space-y-1">
                <p>Email: <a href="mailto:privacy@acscompany.com" className="text-[#0e6537] hover:underline">privacy@acscompany.com</a></p>
                <p>Address: 123 Business Avenue, Suite 500, San Francisco, CA 94107</p>
              </div>
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