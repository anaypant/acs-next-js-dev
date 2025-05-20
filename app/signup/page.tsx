'use client';

import React, { useState } from 'react';
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
import { goto404 } from '../utils/error';

// Adding recaptcha to the whole window
declare global {
  interface Window {
    grecaptcha: {
      execute(siteKey: string, options: { action: string }): Promise<string>;
      ready(cb: () => void): void;
    };
  }
}

const SignupPage: React.FC = () => {
  const router = useRouter(); // Navigation to other pages
  const [loading, setLoading] = useState(false); // If the page is loading (not interactive)
  const [error, setError] = useState<string | null>(null); // Showing Error Messages
  const [recaptchaReady, setRecaptchaReady] = useState(false); // Checking that a recaptcha is ready
  const [formData, setFormData] = useState<SignupData>({ // Email Form Data
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    provider: 'form',
  });
  // Form Fields
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [showCaptchaError, setShowCaptchaError] = useState(false);
  const [showUserExistsError, setShowUserExistsError] = useState(false);

  // Password Checks
  const passwordChecks = [
    { label: 'At least 8 characters', test: (pw: string) => pw.length >= 8 },
    { label: 'One uppercase letter', test: (pw: string) => /[A-Z]/.test(pw) },
    { label: 'One number', test: (pw: string) => /\d/.test(pw) },
    { label: 'One symbol', test: (pw: string) => /[^A-Za-z0-9\s]/.test(pw) },
  ];

  // Getting the recaptcha token
  const getCaptchaToken = async (): Promise<string | null> => {
    try {
      const token = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
        { action: 'signup' }
      );
      return token;
    } catch (error) {
      goto404('202', 'Test Error', router);
      return null;
    }
  };

  // Handling the form changes - every time a form changes, do this
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') setConfirmPassword(value);
    else setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handling the form submission - every time the form is submitted, do this
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Checking if all fields are filled
    const { firstName, lastName, email, password } = formData;
    const allFilled = firstName && lastName && email && password && confirmPassword;
    const passwordsMatch = password === confirmPassword;
    const allValid = passwordChecks.every(c => c.test(password || ''));

    // If all fields are not filled, show the requirements
    if (!allFilled || !passwordsMatch || !allValid) {
      setShowRequirements(true);
      setLoading(false);
      return;
    }

    // Retrieve recaptcha token, this is passed to backend to verify authentic signup
    const captchaToken = await getCaptchaToken();
    if (!captchaToken) {
      setShowCaptchaError(true);
      setLoading(false);
      return;
    }

    // Combine firstName and lastName into name for backend
    const name = `${firstName} ${lastName}`;

    // Send the data to the backend
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, name, captchaToken }),
      });

      // Get the response from the backend
      const payload = await res.json();
      
      // If the user already exists, show the error
      if (res.status === 409) {
        // If the user already exists, show the error
        setShowUserExistsError(true);
      } else {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // When sign in with google button is clicked, do this
  const handleGoogleSignIn = () => {
    setLoading(true);
    // Set localStorage to indicate this is a new user
    localStorage.setItem('authType', 'new');
    signIn('google', { callbackUrl: '/process-google'});
  };

  // Page content
  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="beforeInteractive"
        onLoad={() => {
          if (window.grecaptcha) {
            window.grecaptcha.ready(() => {
              setRecaptchaReady(true);
            });
          }
        }}
      />
      <div className="min-h-screen flex">
        {/* Left Side - Animated Background with Logo */}
        <div className="hidden md:flex md:w-[45%] bg-accent relative items-center justify-center">
          {/* Background image */}
          <div className="absolute inset-0 bg-[url('/signup-bg.jpg')] bg-cover bg-center" />
          {/* Overlay and content */}
          <Image
            src="/signup-bg.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#0A2F1F]/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A2F1F]/30 to-[#0A2F1F]/70" />
          <Typography 
            variant="h2" 
            component="h1" 
            className="font-bold relative z-10"
            sx={{ color: '#fff !important', fontSize: '8.75rem', fontWeight: 900, letterSpacing: '0.04em', textShadow: '0 2px 24px rgba(0,0,0,0.18)', lineHeight: 1 }}
          >
            ACS
          </Typography>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-[linear-gradient(120deg,_#f8faf9_60%,_#b2f1e6_85%,_#38b88b_100%)]">
          <div className="w-full max-w-[440px] space-y-12">
            <div className="text-center space-y-3">
              <Typography variant="h4" className="text-3xl font-bold" sx={{ color: '#0A2F1F' }}>
                Get Started Now
              </Typography>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="flex flex-col gap-8">

                {/* First Name and Last Name */}
                <div className="mt-4">
                  <div className="flex flex-row gap-4">
                  <TextField
                    fullWidth
                    name="firstName"
                    placeholder="Enter your first name"
                    label="First Name"
                    variant="outlined"
                    value={formData.firstName}
                    onChange={handleChange}
                    sx={{
                      marginBottom: '16px',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        color: '#134d36',
                        '& fieldset': {
                          borderColor: '#134d36',
                        },
                        '&:hover fieldset': {
                          borderColor: '#0A2F1F',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#0A2F1F',
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#134d36',
                        '&.Mui-focused': {
                          color: '#0A2F1F',
                        }
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    name="lastName"
                    placeholder="Enter your last name"
                    label="Last Name"
                    variant="outlined"
                    value={formData.lastName}
                    onChange={handleChange}
                    sx={{
                      marginBottom: '32px',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        color: '#134d36',
                        '& fieldset': {
                          borderColor: '#134d36',
                        },
                        '&:hover fieldset': {
                          borderColor: '#0A2F1F',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#0A2F1F',
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#134d36',
                        '&.Mui-focused': {
                          color: '#0A2F1F',
                        }
                      }
                    }}
                  />

                  {/* Email */}
                  </div>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    label="Email address"
                    variant="outlined"
                    value={formData.email}
                    onChange={handleChange}
                    sx={{
                      marginBottom: '32px',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        color: '#134d36',
                        '& fieldset': {
                          borderColor: '#134d36',
                        },
                        '&:hover fieldset': {
                          borderColor: '#0A2F1F',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#0A2F1F',
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#134d36',
                        '&.Mui-focused': {
                          color: '#0A2F1F',
                        }
                      }
                    }}
                  />

                  {/* Password */}
                  <TextField
                    fullWidth
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    label="Password"
                    variant="outlined"
                    value={formData.password}
                    onChange={handleChange}
                    sx={{
                      marginBottom: '16px',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        color: '#134d36',
                        '& fieldset': {
                          borderColor: '#134d36',
                        },
                        '&:hover fieldset': {
                          borderColor: '#0A2F1F',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#0A2F1F',
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#134d36',
                        '&.Mui-focused': {
                          color: '#0A2F1F',
                        }
                      }
                    }}

                    // Password toggle
                    InputProps={{
                      endAdornment: (
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowPassword((v) => !v)}
                          className="focus:outline-none transition-colors duration-200 rounded-full p-1 hover:bg-[#e0f7fa] group"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          style={{ display: 'flex', alignItems: 'center', border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                          <span className="transition-transform duration-200 group-hover:scale-110">
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </span>
                        </button>
                      ),
                    }}
                  />

                  {/* Confirm Password */}
                  <TextField
                    fullWidth
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    label="Confirm Password"
                    variant="outlined"
                    value={confirmPassword}
                    onChange={handleChange}
                    sx={{
                      marginBottom: '16px',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        color: '#134d36',
                        '& fieldset': {
                          borderColor: '#134d36',
                        },
                        '&:hover fieldset': {
                          borderColor: '#0A2F1F',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#0A2F1F',
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: '#134d36',
                        '&.Mui-focused': {
                          color: '#0A2F1F',
                        }
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          className="focus:outline-none transition-colors duration-200 rounded-full p-1 hover:bg-[#e0f7fa] group"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          style={{ display: 'flex', alignItems: 'center', border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                          <span className="transition-transform duration-200 group-hover:scale-110">
                            {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </span>
                        </button>
                      ),
                    }}
                  />
                  {/* Password checklist */}
                  <div className="mb-6">
                    <div className="mb-1 text-sm font-medium text-[#134d36]">Passwords must include:</div>
                    <ul className="space-y-1 text-sm">
                      {passwordChecks.map((check) => {
                        const passed = check.test(formData.password || '');
                        return (
                          <li key={check.label} className={passed ? 'text-[#38b88b] font-semibold' : 'text-red-600 font-semibold'}>
                            <span className="inline-block w-4">
                              {passed ? '✓' : <span className="font-bold">✗</span>}
                            </span> {check.label}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
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
                  {loading ? 'Creating account...' : 'Sign Up'}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#134d36]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-6 bg-[linear-gradient(120deg,_#f8faf9_60%,_#b2f1e6_85%,_#38b88b_100%)] text-[#134d36]">or continue with</span>
                  </div>
                </div>

                <div className="">
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={
                      <Image 
                        src="/google.svg" 
                        alt="Google" 
                        width={20} 
                        height={20}
                      />
                    }
                    onClick={handleGoogleSignIn}
                    className="py-3 border border-black bg-white text-[#3c4043] font-medium text-base rounded-full normal-case hover:bg-gray-100 transition-colors duration-150 shadow-md"
                    sx={{
                      borderColor: '#000',
                      color: '#3c4043',
                      fontWeight: 500,
                      fontSize: '1rem',
                      backgroundColor: '#fff',
                      borderRadius: '9999px',
                      boxShadow: '0 2px 8px 0 rgba(60,64,67,0.10)',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#f7f8fa',
                        boxShadow: '0 4px 16px 0 rgba(60,64,67,0.16)',
                        borderColor: '#000',
                      },
                      '&.Mui-disabled': {
                        backgroundColor: '#f5f5f5',
                        color: '#9e9e9e',
                        borderColor: '#e0e0e0',
                      }
                    }}
                  >
                    Sign in with Google
                  </Button>
                  {/* <Button
                      fullWidth
                      variant="outlined"
                      startIcon={
                          <Image 
                              src="/apple.svg" 
                              alt="Apple" 
                              width={20} 
                              height={20}
                          />
                      }
                      className="py-3 border-[#134d36] text-[#134d36] bg-white hover:bg-[#e0f7fa] normal-case rounded-xl"
                  >
                      Apple
                  </Button> */}
                </div>

                <div className="text-center">
                  <Typography 
                    variant="body2" 
                    sx={{ color: '#134d36' }}
                  >
                    Have an account?{' '}
                    <MuiLink
                      component={Link}
                      href="/login"
                      sx={{ 
                        color: '#0A2F1F',
                        fontWeight: 600,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                          color: '#0D3B26'
                        }
                      }}
                    >
                      Sign In
                    </MuiLink>
                  </Typography>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Snackbar open={showRequirements} autoHideDuration={6000} onClose={() => setShowRequirements(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <MuiAlert onClose={() => setShowRequirements(false)} severity="warning" sx={{ width: '100%' }}>
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
      <Snackbar open={showCaptchaError} autoHideDuration={6000} onClose={() => setShowCaptchaError(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <MuiAlert onClose={() => setShowCaptchaError(false)} severity="error" sx={{ width: '100%' }}>
          reCAPTCHA failed. Please try again.
        </MuiAlert>
      </Snackbar>
      <Snackbar open={showUserExistsError} autoHideDuration={6000} onClose={() => setShowUserExistsError(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <MuiAlert onClose={() => setShowUserExistsError(false)} severity="error" sx={{ width: '100%' }}>
          An account with this email already exists. Please try logging in instead.
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default SignupPage;