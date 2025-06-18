/**
 * File: app/demo/page.tsx
 * Purpose: Demo access page with code verification and navigation to login/signup
 * Author: Assistant
 * Date: 12/19/24
 * Version: 1.0.0
 */

"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

/**
 * DemoPage Component
 * Demo access page with code verification functionality
 * 
 * Features:
 * - Demo code verification
 * - ACS brand design consistency
 * - Error handling and validation
 * - Loading states
 * - Navigation to login/signup after verification
 * - Responsive design
 * 
 * State Management:
 * - Demo code input
 * - Loading state
 * - Error state
 * - Success state
 * 
 * @returns {JSX.Element} Complete demo access page
 */
const DemoPage = () => {
  const router = useRouter()
  const [demoCode, setDemoCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  /**
   * Handles demo code input changes
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDemoCode(e.target.value)
    setError(null) // Clear error when user starts typing
  }

  /**
   * Handles form submission for demo code verification
   * Validates the demo code and redirects to login/signup on success
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/verify-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ demoCode }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        // Redirect to login page after a brief delay
        setTimeout(() => {
          router.push('/login')
        }, 1500)
      } else {
        setError(data.error || 'Invalid demo code')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f9f4] to-[#e6f5ec] flex flex-col">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center">
          <Link href="/" className="no-underline">
            <span className="text-xl font-semibold bg-gradient-to-br from-[#0e6537] to-[#157a42] bg-clip-text text-transparent">
              ACS
            </span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl border border-[#0e6537]/5 p-8 transition-all duration-300 hover:shadow-2xl"
          >
            {/* Page Header */}
            <div className="text-center mb-8">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0e6537] to-[#157a42] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-semibold text-[#002417] mb-2">
                Demo Access Required
              </h1>
              <p className="text-[#0e6537]/70 text-sm leading-relaxed">
                ACS is currently in a closed demo phase. Enter your demo code to access the platform.
              </p>
            </div>

            {/* Info Box */}
            <div className="mb-6 p-4 bg-[#E8F5EE] border border-[#0e6537]/20 rounded-xl">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-[#0e6537] mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-sm text-[#0e6537]">
                  <p className="font-medium mb-1">For more information</p>
                  <p>
                    Visit{' '}
                    <a
                      href="https://www.demoacs.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="!text-blue-500 !underline !hover:text-[#0e6537]/80 transition-colors"
                    >
                      https://www.demoacs.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl"
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="font-medium">Demo code verified! Redirecting...</span>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl"
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              </motion.div>
            )}

            {/* Demo Code Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="demoCode" className="block text-sm font-medium text-[#002417] mb-2">
                  Demo Code
                </label>
                <input
                  id="demoCode"
                  name="demoCode"
                  type="text"
                  required
                  value={demoCode}
                  onChange={handleChange}
                  placeholder="Enter your demo code"
                  className="w-full px-4 py-3 border border-[#0e6537]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e6537]/20 focus:border-[#0e6537] transition-all duration-200 placeholder-[#0e6537]/50 text-[#002417] bg-white hover:border-[#0e6537]/30"
                  disabled={loading || success}
                />
              </div>

              <button
                type="submit"
                disabled={loading || success || !demoCode.trim()}
                className="w-full relative group"
              >
                <span className="relative z-10 inline-flex items-center justify-center gap-2 px-4 py-3 font-medium text-white rounded-xl overflow-hidden whitespace-nowrap">
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Verifying...
                    </>
                  ) : success ? (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Verified!
                    </>
                  ) : (
                    'Verify Demo Code'
                  )}
                </span>
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0e6537] to-[#157a42] transition-all duration-300 ease-out group-hover:scale-[1.02] group-hover:shadow-[0_0_20px_rgba(14,101,55,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"></span>
              </button>
            </form>

            
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DemoPage 