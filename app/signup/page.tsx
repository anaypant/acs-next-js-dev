/**
 * File: app/signup/page.tsx
 * Purpose: Renders the signup page with email/password and Google authentication, including reCAPTCHA verification and password validation.
 * Author: acagliol
 * Date: 06/15/25
 * Version: 1.0.1
 */

"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CircularProgress, Snackbar, Alert as MuiAlert } from '@mui/material';
import { signIn } from 'next-auth/react';
import { SignupData } from '../types/auth';
import Script from 'next/script';
import { handleAuthError, validateAuthForm, clearAuthData, setAuthType } from '../utils/auth';

/**
 * Global type declaration for reCAPTCHA
 * Extends Window interface to include reCAPTCHA functionality
 */
declare global {
  interface Window {
    grecaptcha: {
      execute(siteKey: string, options: { action: string }): Promise<string>;
      ready(cb: () => void): void;
    };
  }
}

/**
 * SignupPage Component
 * Client-side signup page with email/password and Google authentication
 * 
 * Features:
 * - Email/password registration
 * - Google OAuth integration
 * - reCAPTCHA verification
 * - Password strength validation
 * - Form validation
 * - Error handling
 * - Loading states
 * - Responsive design
 * 
 * State Management:
 * - Form data
 * - Loading states
 * - Error states
 * - reCAPTCHA states
 * - Password visibility
 * - Validation states
 * 
 * @returns {JSX.Element} Complete signup page with authentication options
 */
const SignupPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    password: '',
    provider: 'form',
    captchaToken: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [recaptchaLoading, setRecaptchaLoading] = useState(true);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
  const [showUserExistsError, setShowUserExistsError] = useState(false);

  /**
   * Password validation rules
   * Array of checks for password strength requirements
   */
  const passwordChecks = [
    { label: 'At least 8 characters', test: (pw: string) => pw.length >= 8 },
    { label: 'One uppercase letter', test: (pw: string) => /[A-Z]/.test(pw) },
    { label: 'One number', test: (pw: string) => /\d/.test(pw) },
    { label: 'One symbol', test: (pw: string) => /[^A-Za-z0-9\s]/.test(pw) },
  ];

  /**
   * Retrieves reCAPTCHA token for form submission
   * @returns {Promise<string|null>} reCAPTCHA token or null if failed
   * @throws {Error} If reCAPTCHA is not ready or fails to execute
   */
  const getCaptchaToken = async (): Promise<string | null> => {
    if (!recaptchaReady || !window.grecaptcha) {
      setRecaptchaError('reCAPTCHA is not ready. Please refresh the page and try again.');
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
        { action: 'signup' }
      );
      if (!token) {
        setRecaptchaError('Failed to get reCAPTCHA token. Please try again.');
        return null;
      }
      return token;
    } catch (error) {
      console.error('Captcha error:', error);
      setRecaptchaError('Failed to verify reCAPTCHA. Please try again.');
      return null;
    }
  };

  /**
   * Handles form input changes
   * Updates form state based on input field changes
   * 
   * @param {ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "confirmPassword") {
      setConfirmPassword(value)
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  /**
   * Handles form submission
   * Validates form data, checks password requirements, and creates account
   * 
   * @param {FormEvent<HTMLFormElement>} e - Form submission event
   * @throws {Error} If validation fails or account creation fails
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecaptchaError(null);

    try {
      // Validate form data
      const validation = validateAuthForm(formData);
      if (!validation.isValid) {
        setError(validation.error || "Invalid form data");
        setShowRequirements(true);
        return;
      }

      // Check password match
      if (formData.password !== confirmPassword) {
        setError("Passwords do not match");
        setShowRequirements(true);
        return;
      }

      // Get reCAPTCHA token
      if (!recaptchaReady) {
        setError("reCAPTCHA is not ready. Please try again.");
        return;
      }

      const token = await getCaptchaToken();
      if (!token) {
        setLoading(false);
        return;
      }

      // Update form data with captcha token
      setFormData((prev) => ({
        ...prev,
        captchaToken: token,
      }));

      // Create account
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          captchaToken: token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "User already exists") {
          setShowUserExistsError(true);
        } else {
          setError(handleAuthError(data.error));
        }
        return;
      }

      // Clear form data and redirect
      clearAuthData();
      setAuthType('new');
      
      // After successful signup, the backend already creates a session
      // We need to ensure NextAuth is synchronized with this session
      console.log('[signup] Signup successful, creating NextAuth session');
      
      // Create a NextAuth session without triggering another login call
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        provider: 'form',
        redirect: false,
        callbackUrl: '/dashboard'
      });

      console.log('[signup] NextAuth session creation result:', result);

      if (result?.error) {
        console.error('[signup] NextAuth session creation error:', result.error);
        // Even if NextAuth session creation fails, the backend session exists
        // Redirect to dashboard anyway
        router.push('/process-form?authType=new');
        return;
      }

      // Redirect to dashboard
      router.push('/process-form?authType=new');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles Google OAuth signup
   * Initiates Google authentication flow
   * 
   * @throws {Error} If Google authentication fails
   */
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      await signIn('google', { callbackUrl: '/process-google' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initializes reCAPTCHA
   * Sets up ready state when reCAPTCHA is loaded
   */
  useEffect(() => {
    const initializeRecaptcha = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          setRecaptchaReady(true);
          setRecaptchaLoading(false);
        });
      }
    };

    let checkInterval: NodeJS.Timeout;

    // Check if reCAPTCHA is already loaded
    if (window.grecaptcha) {
      initializeRecaptcha();
    } else {
      // Wait for reCAPTCHA to be loaded by the Script component
      checkInterval = setInterval(() => {
        if (window.grecaptcha) {
          initializeRecaptcha();
          clearInterval(checkInterval);
        }
      }, 100);

      // Clear interval after 10 seconds if reCAPTCHA doesn't load
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.grecaptcha) {
          setRecaptchaLoading(false);
          setRecaptchaError('reCAPTCHA failed to load. Please refresh the page.');
        }
      }, 10000);
    }

    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, []);

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
        onLoad={() => {
          if (window.grecaptcha) {
            window.grecaptcha.ready(() => {
              setRecaptchaReady(true);
              setRecaptchaLoading(false);
            });
          }
        }}
        onError={() => {
          setRecaptchaLoading(false);
          setRecaptchaError('Failed to load reCAPTCHA. Please refresh the page.');
        }}
      />
      {/* Global styles for the signup page */}
      <style jsx global>{`
        /* Base font definitions */
        :root {
          --font-inter: "Inter", system-ui, arial;
          --font-playfair: "Playfair Display", Georgia, serif;
          --font-montserrat: "Montserrat", system-ui, arial;
          
          /* Green color palette */
          --dark-green: #0a5a2f;
          --medium-green: #0e6537;
          --bright-green: #157a42;
          --forest-green: #002417;
          --light-green: #e6f5ec;
          --pale-mint: #f0f9f4;
          --pale-sage: #d8eee1;
        }

        /* Import fonts locally or use system fallbacks */
        @font-face {
          font-family: "Inter";
          src: local("Inter"), local("Inter-Regular");
          font-weight: 300 700;
          font-display: swap;
        }

        @font-face {
          font-family: "Playfair Display";
          src: local("Playfair Display"), local("PlayfairDisplay-Regular");
          font-weight: 400 900;
          font-display: swap;
        }

        @font-face {
          font-family: "Montserrat";
          src: local("Montserrat"), local("Montserrat-Regular");
          font-weight: 400 700;
          font-display: swap;
        }

        /* Typography */
        .brand-logo {
          color: #fff !important;
          font-size: 8.75rem !important;
          font-weight: 900 !important;
          letter-spacing: 0.04em !important;
          text-shadow: 0 2px 24px rgba(0, 0, 0, 0.18) !important;
          line-height: 1 !important;
          font-family: "Montserrat", system-ui, arial !important;
        }

        .heading-text {
          color: var(--forest-green) !important;
          font-size: 1.875rem !important;
          font-weight: 700 !important;
          font-family: "Montserrat", system-ui, arial !important;
        }

        .subheading-text {
          color: var(--medium-green) !important;
          font-family: "Inter", system-ui, arial !important;
        }

        /* Form elements */
        .form-input {
          margin-bottom: 32px !important;
        }

        .form-input .MuiOutlinedInput-root {
          background-color: white !important;
          border-radius: 12px !important;
          color: var(--forest-green) !important;
          font-family: "Montserrat", system-ui, arial !important;
        }

        .form-input .MuiOutlinedInput-root fieldset {
          border-color: var(--medium-green) !important;
          border-width: 1px !important;
        }

        .form-input .MuiOutlinedInput-root:hover fieldset {
          border-color: var(--dark-green) !important;
          border-width: 1px !important;
        }

        .form-input .MuiOutlinedInput-root.Mui-focused fieldset {
          border-color: var(--dark-green) !important;
          border-width: 2px !important;
        }

        .form-input .MuiInputLabel-root {
          color: var(--medium-green) !important;
          font-family: "Montserrat", system-ui, arial !important;
        }

        .form-input .MuiInputLabel-root.Mui-focused {
          color: var(--dark-green) !important;
        }

        .password-input {
          margin-bottom: 16px !important;
        }

        .password-toggle {
          display: flex;
          align-items: center;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.2s;
          padding: 8px;
          border-radius: 50%;
        }

        .password-toggle:hover {
          background-color: var(--light-green);
        }

        .toggle-icon {
          transition: transform 0.2s;
          color: var(--medium-green);
        }

        .toggle-icon:hover {
          transform: scale(1.1);
        }

        /* Password checklist */
        .password-checklist {
          margin-bottom: 24px;
          background-color: rgba(14, 101, 55, 0.05);
          padding: 16px;
          border-radius: 8px;
          border: 1px solid rgba(14, 101, 55, 0.2);
        }

        .checklist-title {
          margin-bottom: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--forest-green);
          font-family: "Montserrat", system-ui, arial;
        }

        .checklist-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 0.875rem;
        }

        .checklist-item {
          display: flex;
          align-items: center;
          font-family: "Inter", system-ui, arial;
        }

        .checklist-item.passed {
          color: var(--bright-green);
          font-weight: 500;
        }

        .checklist-item.not-passed {
          color: var(--forest-green);
          opacity: 0.7;
          font-weight: 500;
        }

        .check-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          margin-right: 8px;
          border-radius: 50%;
        }

        .passed-icon {
          background-color: var(--bright-green);
        }

        .not-passed-icon {
          background-color: rgba(14, 101, 55, 0.1);
          border: 1px solid rgba(14, 101, 55, 0.2);
        }

        .icon-svg {
          width: 12px;
          height: 12px;
          color: white;
        }

        .not-passed-icon .icon-svg {
          color: var(--medium-green);
        }

        /* Social buttons */
        .social-button {
          padding: 12px 0 !important;
          border-color: rgba(14, 101, 55, 0.2) !important;
          color: var(--forest-green) !important;
          background-color: white !important;
          border-radius: 10px !important;
          text-transform: none !important;
          font-family: "Montserrat", system-ui, arial !important;
          font-weight: 500 !important;
          margin-bottom: 24px !important;
        }

        .social-button:hover {
          background-color: var(--light-green) !important;
          border-color: var(--medium-green) !important;
        }

        /* Login link */
        .login-text {
          color: var(--medium-green) !important;
          font-family: "Inter", system-ui, arial !important;
        }

        .login-link {
          color: var(--dark-green) !important;
          font-weight: 600 !important;
          text-decoration: none !important;
        }

        .login-link:hover {
          text-decoration: underline !important;
          color: var(--bright-green) !important;
        }

        /* Error alert */
        .error-alert {
          border-radius: 10px !important;
          background-color: #ffebee !important;
        }
      `}</style>

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
                <h1 className="text-2xl font-semibold text-[#002417]">Create Account</h1>
                <p className="text-[#0e6537]/70 text-sm mt-2 transition-colors duration-200">
                  Enter your details to create your account
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
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full name"
                      className="w-full px-4 py-3 border border-[#0e6537]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e6537]/20 focus:border-[#0e6537] transition-all duration-200 placeholder-[#0e6537]/50 text-[#002417] bg-white hover:border-[#0e6537]/30"
                    />
                  </div>
                  <div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email address"
                      className="w-full px-4 py-3 border border-[#0e6537]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e6537]/20 focus:border-[#0e6537] transition-all duration-200 placeholder-[#0e6537]/50 text-[#002417] bg-white hover:border-[#0e6537]/30"
                    />
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full px-4 py-3 border border-[#0e6537]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e6537]/20 focus:border-[#0e6537] transition-all duration-200 placeholder-[#0e6537]/50 text-[#002417] bg-white hover:border-[#0e6537]/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0e6537] hover:text-[#157a42]"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      className="w-full px-4 py-3 border border-[#0e6537]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e6537]/20 focus:border-[#0e6537] transition-all duration-200 placeholder-[#0e6537]/50 text-[#002417] bg-white hover:border-[#0e6537]/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0e6537] hover:text-[#157a42]"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                {showRequirements && (
                  <div className="p-4 bg-[#f0f9f4] border border-[#0e6537]/20 rounded-xl text-sm text-[#002417]">
                    <h3 className="font-medium mb-2">Password Requirements:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {passwordChecks.map((check) => (
                        <li key={check.label} className={check.test(formData.password || "") ? "text-[#0e6537]" : ""}>
                          {check.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || recaptchaLoading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#0e6537] to-[#157a42] text-white text-sm font-medium rounded-xl hover:from-[#157a42] hover:to-[#0e6537] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0e6537]/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <CircularProgress size={20} className="text-white mr-2" />
                      Creating account...
                    </div>
                  ) : recaptchaLoading ? (
                    <div className="flex items-center justify-center">
                      <CircularProgress size={20} className="text-white mr-2" />
                      Loading...
                    </div>
                  ) : (
                    "Sign up"
                  )}
                </button>
              </form>

              {/* Google Sign In */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center py-3 px-4 border border-[#0e6537]/20 rounded-xl text-sm font-medium text-[#002417] hover:bg-[#f0f9f4] transition-all duration-200 hover:border-[#0e6537]/30 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <CircularProgress size={20} className="text-[#0e6537] mr-2" />
                      Signing up...
                    </div>
                  ) : (
                    <>
                      <Image src="/google.svg" alt="Google" width={18} height={18} className="mr-3" />
                      Sign up with Google
                    </>
                  )}
                </button>
              </div>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link 
                    href="/login" 
                    className="!text-black hover:!text-blue-600"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Snackbars */}
      <Snackbar 
        open={showRequirements} 
        autoHideDuration={6000} 
        onClose={() => setShowRequirements(false)} 
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert 
          onClose={() => setShowRequirements(false)} 
          severity="warning" 
          sx={{ width: "100%" }}
        >
          Please complete all fields, ensure your password meets requirements, and matches confirmation.<br />
          <ul style={{ margin: 0, paddingLeft: 20, textAlign: "left" }}>
            <li>At least 8 characters</li>
            <li>One uppercase letter</li>
            <li>One number</li>
            <li>One symbol</li>
            <li>Passwords must match</li>
          </ul>
        </MuiAlert>
      </Snackbar>

      <Snackbar 
        open={!!recaptchaError} 
        autoHideDuration={6000} 
        onClose={() => setRecaptchaError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert 
          onClose={() => setRecaptchaError(null)} 
          severity="error" 
          sx={{ width: "100%" }}
        >
          {recaptchaError}
        </MuiAlert>
      </Snackbar>

      <Snackbar 
        open={showUserExistsError} 
        autoHideDuration={6000} 
        onClose={() => setShowUserExistsError(false)} 
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert 
          onClose={() => setShowUserExistsError(false)} 
          severity="error" 
          sx={{ width: "100%" }}
        >
          An account with this email already exists. Please try logging in instead.
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default SignupPage;

/**
 * Change Log:
 * 06/15/25 - Version 1.0.1
 * - Removed: -- a/app/signup/page.tsx
 * - Added: ++ b/app/signup/page.tsx
 * - Removed: 'use client';
 * - Added: "use client";
 * - Removed: import React, { useState, useEffect } from 'react';
 * 5/25/25 - Initial version
 * - Created signup page with email/password registration
 * - Implemented Google OAuth integration
 * - Added reCAPTCHA verification
 * - Integrated password strength validation
 * - Added form validation and error handling
 * - Implemented loading states and animations
 * - Enhanced UI with responsive design
 * - Added user feedback and notifications
 */
