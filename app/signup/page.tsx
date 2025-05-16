'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Container, Box, Typography, TextField, Button, Alert, CircularProgress, Link as MuiLink
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const SignupPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ 
        email: '', 
        password: '',
        name: '' 
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'confirmPassword') {
            setConfirmPassword(value);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Basic validation
        const allFieldsFilled = formData.name && formData.email && formData.password && confirmPassword;
        const passwordsMatch = formData.password === confirmPassword;
        const allChecks = passwordChecks.every(check => check.test(formData.password));
        if (!allFieldsFilled || !passwordsMatch || !allChecks) {
            setLoading(false);
            alert('Please fill all fields, ensure password requirements are met, and passwords match.');
            return;
        }
        try {
            // TODO: Implement actual signup logic here
            await new Promise(resolve => setTimeout(resolve, 1000));
            router.push('/dashboard');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Password checklist logic
    const passwordChecks = [
        {
            label: 'At least 8 characters',
            test: (pw: string) => pw.length >= 8,
        },
        {
            label: 'One uppercase letter',
            test: (pw: string) => /[A-Z]/.test(pw),
        },
        {
            label: 'One number',
            test: (pw: string) => /[0-9]/.test(pw),
        },
        {
            label: 'One symbol',
            test: (pw: string) => /[^A-Za-z0-9\s]/.test(pw) && !/\s/.test(pw),
        },
    ];

    return (
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
                        <Typography variant="body1" sx={{ color: '#134d36' }}>
                            Enter your Credentials to access your account
                        </Typography>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-12">
                        <div className="flex flex-col gap-8">
                            <div className="mt-4">
                                <TextField
                                    fullWidth
                                    name="name"
                                    placeholder="Enter your name"
                                    label="Name"
                                    variant="outlined"
                                    value={formData.name}
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
                                      const passed = check.test(formData.password);
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    className="py-3 border-[#134d36] text-[#134d36] bg-white hover:bg-[#e0f7fa] normal-case rounded-xl"
                                >
                                    Google
                                </Button>
                                <Button
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
                                </Button>
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
    );
};

export default SignupPage;