'use client';

import React, { useState } from 'react';
import {
    Typography,
    TextField,
    Button,
    Link as MuiLink,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const LoginPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

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
        try {
            // TODO: Implement actual login logic here
            await new Promise(resolve => setTimeout(resolve, 1000));
            router.push('/dashboard');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="flex-1 flex items-center justify-center p-8 relative bg-[#0A2F1F] overflow-hidden">
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
                        <Typography variant="h4" className="text-4xl font-bold text-white">
                            Welcome Back!
                        </Typography>
                        <Typography variant="body1" className="text-gray-200">
                            Enter your Credentials to access your account
                        </Typography>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-12">
                        <div className="flex flex-col gap-8">
                            <div className="space-y-6">
                                <div>
                                    <Typography className="text-white mb-2">Email</Typography>
                                    <TextField
                                        fullWidth
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
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
                                    <Typography className="text-white mb-2">Password</Typography>
                                    <TextField
                                        fullWidth
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
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
                                {loading ? 'Signing in...' : 'SIGN IN'}
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
                                <Typography className="text-gray-300">
                                    Don't have an account?{' '}
                                    <MuiLink
                                        component={Link}
                                        href="/signup"
                                        sx={{ 
                                            color: '#fff',
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