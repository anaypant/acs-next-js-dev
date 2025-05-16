'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Container } from '@mui/material';

const LandingNavbar = () => {
    return (
        <nav 
            className="fixed left-0 right-0 z-50 py-3 bg-white border-b border-gray-200 shadow-sm"
            style={{ top: '48px' }}
        >
            <Container maxWidth="lg" className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-[#0A2F1F]">
                        ACS
                    </Link>
                    
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link href="/" className="text-base font-medium text-[#0A2F1F] hover:text-[#134d36] px-2 py-1">
                            Home
                        </Link>
                        <Link href="/solutions" className="text-base font-medium text-[#0A2F1F] hover:text-[#134d36] px-2 py-1">
                            Solutions
                        </Link>
                        <Link href="/case-studies" className="text-base font-medium text-[#0A2F1F] hover:text-[#134d36] px-2 py-1">
                            Case Studies
                        </Link>
                        <Link href="/contact" className="text-base font-medium text-[#0A2F1F] hover:text-[#134d36] px-2 py-1">
                            Contact
                        </Link>
                        <Button
                            component={Link}
                            href="/login"
                            variant="outlined"
                            className="ml-2 px-4 py-1.5 text-base rounded-md border-[#0A2F1F] text-[#0A2F1F] hover:bg-[#0A2F1F]/10"
                            sx={{ textTransform: 'none', borderColor: '#0A2F1F' }}
                        >
                            Login
                        </Button>
                        <Button
                            component={Link}
                            href="/login"
                            variant="text"
                            className={`${
                                isDark 
                                    ? 'text-white hover:text-emerald-300' 
                                    : 'text-[#0A2F1F]/70 hover:text-[#0A2F1F]'
                            } transform transition-all duration-300`}
                        >
                            Sign in
                        </Button>
                        
                        <Button
                            component={Link}
                            href="/signup"
                            variant="contained"
                            className="ml-2 px-4 py-1.5 text-base rounded-md bg-[#0A2F1F] hover:bg-[#134d36] text-white shadow"
                            sx={{ textTransform: 'none' }}
                        >
                            Sign up
                        </Button>
                    </div>
                </div>
            </Container>
        </nav>
    );
};

export default LandingNavbar; 