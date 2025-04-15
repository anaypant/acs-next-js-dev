'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Container, IconButton, Tooltip } from '@mui/material';
import { useTheme } from 'next-themes';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const LandingNavbar = () => {
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 py-6 backdrop-blur-md ${
            isDark 
                ? 'bg-black/40 border-b border-emerald-500/20 shadow-lg shadow-emerald-500/5' 
                : 'bg-gradient-to-b from-white via-white/95 to-white/75 border-b border-gray-200/20 shadow-sm'
        }`}>
            <Container maxWidth="lg">
                <div className="flex items-center justify-between">
                    <Link href="/" className={`text-2xl font-bold ${isDark ? 'text-emerald-300' : 'text-[#0A2F1F]'}`}>
                        ACS
                    </Link>
                    
                    <div className="flex items-center gap-6">
                        <Link href="/solutions" className={`${isDark ? 'text-white hover:text-emerald-300' : 'text-[#0A2F1F]/70 hover:text-[#0A2F1F]'}`}>
                            Solutions
                        </Link>
                        <Link href="/case-studies" className={`${isDark ? 'text-white hover:text-emerald-300' : 'text-[#0A2F1F]/70 hover:text-[#0A2F1F]'}`}>
                            Case Studies
                        </Link>
                        <Link href="/contact" className={`${isDark ? 'text-white hover:text-emerald-300' : 'text-[#0A2F1F]/70 hover:text-[#0A2F1F]'}`}>
                            Contact
                        </Link>
                        
                        <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
                            <IconButton 
                                onClick={toggleTheme}
                                sx={{
                                    ml: 2,
                                    color: isDark ? 'white' : '#0A2F1F',
                                    '&:hover': {
                                        color: isDark ? '#34D399' : '#0D3B26'
                                    }
                                }}
                            >
                                {isDark ? <LightModeIcon /> : <DarkModeIcon />}
                            </IconButton>
                        </Tooltip>
                        
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
                            className={`${
                                isDark 
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                                    : 'bg-[#0A2F1F] hover:bg-[#0D3B26] text-white'
                            } px-6 py-2 rounded-md shadow-lg transform transition-all duration-300 hover:scale-105`}
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