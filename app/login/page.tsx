'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Link as MuiLink
} from '@mui/material';

const LoginPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            if (data.success) {
                // Store tokens securely
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('idToken', data.idToken);
                router.push('/dashboard');
            }
        } catch (err: any) {
            console.error('Login Error:', err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="flex-1 flex items-start justify-center p-8 pt-20 md:pt-32 relative bg-[#0A2F1F] overflow-hidden">
                <div 
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `url('/signup-bg.jpg'),
                            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                            radial-gradient(circle at 100% 100%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
                        backgroundSize: 'cover, 100% 100%, 50% 50%',
                        backgroundPosition: 'center',
                        animation: 'pulse 8s infinite'
                    }}
                />
                
                <div className="w-full max-w-[440px] space-y-12 relative z-10">
                    <div className="text-center space-y-3">
                        <Typography variant="h4" className="text-4xl font-bold" sx={{ color: '#fff !important' }}>
                            Welcome Back!
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#e5e7eb !important' }}>
                            Enter your Credentials to access your account
                        </Typography>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-12">
                        <div className="flex flex-col gap-8">
                            <div className="space-y-6">
                                <div>
                                    <Typography className="mb-2" sx={{ color: '#fff !important' }}>Email</Typography>
                                    <TextField
                                        fullWidth
                                        name="email"
                                        type="email"
                                        placeholder="Enter Email"
                                        variant="outlined"
                                        value={formData.email}
                                        onChange={handleChange}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                color: 'white',
                                                '& input::placeholder': {
                                                    color: 'rgba(255,255,255,0.5)',
                                                },
                                                '& fieldset': {
                                                    borderColor: 'rgba(255,255,255,0.2)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'rgba(255,255,255,0.4)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'rgba(255,255,255,0.6)',
                                                }
                                            }
                                        }}
                                    />
                                </div>
                                <div>
                                    <Typography className="mb-2" sx={{ color: '#fff !important' }}>Password</Typography>
                                    <TextField
                                        fullWidth
                                        name="password"
                                        type="password"
                                        placeholder="Enter Your Password"
                                        variant="outlined"
                                        value={formData.password}
                                        onChange={handleChange}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                                borderRadius: '12px',
                                                color: 'white',
                                                '& input::placeholder': {
                                                    color: 'rgba(255,255,255,0.5)',
                                                },
                                                '& fieldset': {
                                                    borderColor: 'rgba(255,255,255,0.2)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'rgba(255,255,255,0.4)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'rgba(255,255,255,0.6)',
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    py: 2,
                                    bgcolor: 'rgba(255,255,255,0.9)',
                                    color: '#0A2F1F',
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    '&:hover': {
                                        bgcolor: 'white'
                                    }
                                }}
                            >
                                {loading ? 'Logging in...' : 'LOG IN'}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <div className="px-4 text-sm text-gray-300 bg-[#0A2F1F]">or</div>
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
                                    sx={{
                                        py: 1.5,
                                        borderColor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        backgroundColor: 'transparent',
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderColor: 'rgba(255,255,255,0.4)',
                                            backgroundColor: 'rgba(255,255,255,0.1)'
                                        }
                                    }}
                                >
                                    Sign in with Google
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
                                            className="invert"
                                        />
                                    }
                                    sx={{
                                        py: 1.5,
                                        borderColor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        backgroundColor: 'transparent',
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderColor: 'rgba(255,255,255,0.4)',
                                            backgroundColor: 'rgba(255,255,255,0.1)'
                                        }
                                    }}
                                >
                                    Sign in with Apple
                                </Button>
                            </div>

                            <div className="text-center">
                                <Typography sx={{ color: '#e5e7eb !important' }}>
                                    Don't have an account?{' '}
                                    <MuiLink
                                        component={Link}
                                        href="/login"
                                        sx={{ 
                                            color: '#38b88b',
                                            fontWeight: 500,
                                            textDecoration: 'none',
                                            '&:hover': {
                                                textDecoration: 'underline'
                                            }
                                        }}
                                    >
                                        Sign Up
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

export default LoginPage; 