'use client';

import React, { useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Link as MuiLink,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const SignupPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
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
            // TODO: Implement actual signup logic here
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
            {/* Left Side - Animated Background with Logo */}
            <div className="hidden md:flex md:w-[45%] bg-[#0A2F1F] relative items-center justify-center">
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
                    className="text-white text-7xl font-bold relative z-10"
                >
                    ACS
                </Typography>
            </div>

            {/* Right Side - Sign Up Form */}
            <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-[#f8faf9]">
                <div className="w-full max-w-[440px] space-y-12">
                    <div className="text-center space-y-3">
                        <Typography variant="h4" className="text-3xl font-bold text-[#0A2F1F]">
                            Get Started Now
                        </Typography>
                        <Typography variant="body1" className="text-gray-600">
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
                                            '&:hover fieldset': {
                                                borderColor: '#0A2F1F80',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#0A2F1F',
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#666666',
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
                                            '&:hover fieldset': {
                                                borderColor: '#0A2F1F80',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#0A2F1F',
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#666666',
                                            '&.Mui-focused': {
                                                color: '#0A2F1F',
                                            }
                                        }
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    label="Password"
                                    variant="outlined"
                                    value={formData.password}
                                    onChange={handleChange}
                                    sx={{
                                        marginBottom: '32px',
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'white',
                                            borderRadius: '12px',
                                            '&:hover fieldset': {
                                                borderColor: '#0A2F1F80',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#0A2F1F',
                                            }
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#666666',
                                            '&.Mui-focused': {
                                                color: '#0A2F1F',
                                            }
                                        }
                                    }}
                                />
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
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-6 bg-[#f8faf9] text-gray-500">or continue with</span>
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
                                    className="py-3 border-gray-200 text-gray-700 bg-white hover:bg-gray-50 normal-case rounded-xl"
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
                                    className="py-3 border-gray-200 text-gray-700 bg-white hover:bg-gray-50 normal-case rounded-xl"
                                >
                                    Apple
                                </Button>
                            </div>

                            <div className="text-center">
                                <Typography 
                                    variant="body2" 
                                    className="text-gray-600"
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