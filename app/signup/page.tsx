/**
 * File: app/signup/page.tsx
 * Purpose: Renders the signup page with email/password and Google authentication, including reCAPTCHA verification and password validation.
 * Author: Anay Pant
 * Date: 5/25/25
 * Version: 1.0.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link as MuiLink,
  Snackbar,
  Alert as MuiAlert,
} from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [recaptchaLoading, setRecaptchaLoading] = useState(true);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    password: '',
    provider: 'form',
    captchaToken: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [showCaptchaError, setShowCaptchaError] = useState(false);
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
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
   * @param {React.FormEvent} e - Form submission event
   * @throws {Error} If validation fails or account creation fails
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecaptchaError(null);

    // Validate form data
    const validation = validateAuthForm(formData);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid form data');
      setLoading(false);
      return;
    }

    // Check password match
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Check password requirements
    const allValid = passwordChecks.every(c => c.test(formData.password || ''));
    if (!allValid) {
      setShowRequirements(true);
      setLoading(false);
      return;
    }

    if (!recaptchaReady) {
      setRecaptchaError('reCAPTCHA is not ready. Please wait or refresh the page.');
      setLoading(false);
      return;
    }

    const captchaToken = await getCaptchaToken();
    if (!captchaToken) {
      setLoading(false);
      return;
    }

    try {
      // Clear any existing auth data before signup
      clearAuthData();
      
      // Set auth type for new user
      setAuthType('new');

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          captchaToken 
        }),
        credentials: 'include',
      });

      const payload = await res.json();
      
      if (res.status === 409) {
        setShowUserExistsError(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(payload.error || 'Signup failed');
      }

      // Create NextAuth session
      const authResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        redirect: false,
        callbackUrl: `/verify-email?email=${encodeURIComponent(formData.email)}`
      });

      if (authResult?.error) {
        throw new Error(authResult.error);
      }

      // Redirect to email verification
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      setError(handleAuthError(err));
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
    try {
      setLoading(true);
      setError(null);
      
      // Clear any existing auth data
      clearAuthData();
      
      // Set auth type for new user
      setAuthType('new');
      
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

      <div className="min-h-screen flex">
        {/* Left Side - Animated Background with Logo */}
        <div className="hidden md:flex md:w-[45%] bg-[#0a5a2f] relative items-center justify-center">
          {/* Background image with overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a5a2f] via-[#0e6537] to-[#157a42] opacity-85 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-[#0e6537]/20" />

          {/* Logo/Brand text */}
          <div className="relative z-10">
            <Link href="/" className="no-underline block">
              <h1 className="brand-logo cursor-pointer relative z-10">
                ACS
              </h1>
            </Link>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-gradient-to-b from-[#e6f5ec] via-[#f0f9f4] to-white">
          <div className="w-full max-w-[440px] space-y-12">
            <div className="text-center space-y-3">
              <Typography variant="h4" className="heading-text">
                Get Started Now
              </Typography>
              <Typography variant="body1" className="subheading-text">
                Enter your credentials to access your account
              </Typography>
            </div>

            {error && (
              <Alert severity="error" className="error-alert">
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="flex flex-col gap-8">
                <TextField
                  fullWidth
                  name="name"
                  placeholder="Enter your name"
                  label="Name"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                />
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  label="Email address"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                />
                <TextField
                  fullWidth
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  label="Password"
                  variant="outlined"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input password-input"
                  InputProps={{
                    endAdornment: (
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((v) => !v)}
                        className="password-toggle"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <span className="toggle-icon">
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </span>
                      </button>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  label="Confirm Password"
                  variant="outlined"
                  value={confirmPassword}
                  onChange={handleChange}
                  className="form-input password-input"
                  InputProps={{
                    endAdornment: (
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="password-toggle"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        <span className="toggle-icon">
                          {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </span>
                      </button>
                    ),
                  }}
                />
                {/* Password checklist */}
                <div className="password-checklist">
                  <div className="checklist-title">Password requirements:</div>
                  <ul className="checklist-items">
                    {passwordChecks.map((check) => {
                      const passed = check.test(formData.password || '')
                      return (
                        <li key={check.label} className={`checklist-item ${passed ? "passed" : "not-passed"}`}>
                          <span className={`check-icon ${passed ? "passed-icon" : "not-passed-icon"}`}>
                            {passed ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon-svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon-svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </span>
                          {check.label}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading || recaptchaLoading}
                sx={{
                  py: 2,
                  mt: 4,
                  bgcolor: '#0A2F1F',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: '#0D3B26'
                  }
                }}
              >
                {loading ? 'Creating account...' : recaptchaLoading ? 'Loading...' : 'Sign Up'}
              </Button>

              {/* Google Sign In Button */}
              <Button
                fullWidth
                variant="outlined"
                onClick={handleGoogleSignIn}
                disabled={loading}
                startIcon={
                  <Image
                    src="/google.svg"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                }
                sx={{
                  py: 2,
                  mt: 2,
                  borderColor: 'rgba(14, 101, 55, 0.2)',
                  color: '#002417',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: '#0e6537',
                    backgroundColor: '#f0f9f4'
                  }
                }}
              >
                Sign up with Google
              </Button>

              <div className="text-center mt-4">
                <Typography variant="body2" className="login-text">
                  Have an account?{" "}
                  <MuiLink component={Link} href="/login" className="login-link">
                    Sign In
                  </MuiLink>
                </Typography>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Snackbar 
        open={showRequirements} 
        autoHideDuration={6000} 
        onClose={() => setShowRequirements(false)} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert 
          onClose={() => setShowRequirements(false)} 
          severity="warning" 
          sx={{ width: '100%' }}
        >
          Please complete all fields, ensure your password meets requirements, and matches confirmation.<br />
          <ul style={{ margin: 0, paddingLeft: 20, textAlign: 'left' }}>
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
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert 
          onClose={() => setRecaptchaError(null)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {recaptchaError}
        </MuiAlert>
      </Snackbar>

      <Snackbar 
        open={showUserExistsError} 
        autoHideDuration={6000} 
        onClose={() => setShowUserExistsError(false)} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert 
          onClose={() => setShowUserExistsError(false)} 
          severity="error" 
          sx={{ width: '100%' }}
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
