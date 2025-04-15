'use client';

import React, { useState, useEffect } from 'react';
import { CssBaseline, Box } from '@mui/material';
import { ThemeProvider } from './theme/ThemeContext';
import Navbar from './Navbar';
import Footer from './components/Footer';
import { usePathname } from 'next/navigation';

interface ClientLayoutProps {
    children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <ThemeProvider>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                }}
            >
                {!isHomePage && <Navbar />}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {children}
                </Box>
                <Footer />
            </Box>
        </ThemeProvider>
    );
} 