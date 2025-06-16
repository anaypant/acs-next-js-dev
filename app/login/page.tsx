/**
 * File: app/login/page.tsx
 * Purpose: Renders the login page with email/password and Google authentication options.
 * Author: acagliol
 * Date: 06/15/25
 * Version: 1.0.1
 */

"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { CircularProgress } from "@mui/material"
import { signIn } from "next-auth/react"
import { handleAuthError, validateAuthForm } from "../utils/auth"

/**
 * LoginPage Component
 * Client-side login page with email/password and Google authentication
 * 
 * Features:
 * - Email/password authentication
 * - Google OAuth integration
 * - Form validation
 * - Error handling
 * - Loading states
 * - Remember me functionality
 * - Password recovery link
 * - Sign up redirection
 * 
 * @returns {JSX.Element} Complete login page with authentication options
 */
const LoginPage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Handles input field changes
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  /**
   * Handles Google OAuth login
   * Sets auth type and redirects to Google authentication
   * @throws {Error} If authentication fails
   */
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      localStorage.setItem('authType', 'existing');
      
      const result = await signIn('google', {
        callbackUrl: '/process-google',
        redirect: true
      });

      if (result?.error) {
        setError(result.error);
      }
    } catch (err: any) {
      setError(handleAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles form submission for email/password login
   * Validates form data and creates NextAuth session
   * @param {React.FormEvent} e - Form submission event
   * @throws {Error} If validation or authentication fails
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form data
      const validation = validateAuthForm(formData);
      if (!validation.isValid) {
        setError(validation.error || 'Invalid form data');
        return;
      }

      // Create NextAuth session
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl: '/dashboard'
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      // Redirect to dashboard or callback URL
      router.push(result?.url || '/dashboard');
    } catch (err: any) {
      setError(handleAuthError(err));
    } finally {
      setLoading(false);
    }
  };

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
          <div className="bg-white rounded-2xl shadow-xl border border-[#0e6537]/5 p-8 transition-all duration-300 hover:shadow-2xl">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-[#002417]">Welcome Back!</h1>
              <p className="text-[#0e6537]/70 text-sm mt-2 transition-colors duration-200">
                Enter your Credentials to access your account
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl transition-all duration-300">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="w-full px-4 py-3 border border-[#0e6537]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e6537]/20 focus:border-[#0e6537] transition-all duration-200 placeholder-[#0e6537]/50 text-[#002417] bg-white hover:border-[#0e6537]/30"
                  />
                </div>
                <div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full px-4 py-3 border border-[#0e6537]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e6537]/20 focus:border-[#0e6537] transition-all duration-200 placeholder-[#0e6537]/50 text-[#002417] bg-white hover:border-[#0e6537]/30"
                  />

                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#0e6537] focus:ring-[#0e6537]/20 border-[#0e6537]/30 rounded transition-colors duration-200"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-[#002417]">
                    Remember for 30 days
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#0e6537] hover:text-[#157a42] transition-colors duration-200 font-medium"
                >
                  Forgot password
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white text-sm font-medium rounded-xl hover:from-[#157a42] hover:to-[#0e6537] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0e6537]/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <CircularProgress size={20} className="text-white mr-2" />
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Google Sign In */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 border border-[#0e6537]/20 rounded-xl text-sm font-medium text-[#002417] hover:bg-[#f0f9f4] transition-all duration-200 hover:border-[#0e6537]/30 hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <CircularProgress size={20} className="text-[#0e6537] mr-2" />
                    Signing in...
                  </div>
                ) : (
                  <>
                    <Image src="/google.svg" alt="Google" width={18} height={18} className="mr-3" />
                    Sign in with Google
                  </>
                )}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="!text-black hover:!text-blue-600">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

/**
 * Change Log:
 * 06/15/25 - Version 1.0.1
 * - Removed: -- a/app/login/page.tsx
 * - Added: ++ b/app/login/page.tsx
 * - Removed:               <p className="text-sm text-[#0e6537]/70">
 * - Removed:                 Don't have an account?{" "}
 * - Removed:                 <Link
 * 5/25/25 - Initial version
 * - Created login page with email/password authentication
 * - Implemented Google OAuth integration
 * - Added form validation and error handling
 * - Integrated loading states and animations
 * - Added remember me functionality
 * - Implemented password recovery link
 * - Added sign up redirection
 */
