'use client';

import React, { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { ThemeProvider as MuiThemeProvider } from './theme/ThemeContext';
import Navbar from './components/Navbar';
import LandingNavbar from './LandingPage/LandingNavbar';
import Footer from './components/Footer';
import { usePathname } from 'next/navigation';

interface ClientLayoutProps {
    children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const isHomePage = pathname === '/';

    useEffect(() => {
        const timeout = setTimeout(() => {
            setMounted(true);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    // Prevent hydration mismatch by showing nothing until mounted
    if (!mounted) {
        return null;
    }

    return (
        <NextThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            storageKey="theme"
        >
            <MuiThemeProvider>
                <CssBaseline enableColorScheme />
                <Box
                    component="div"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100vh',
                        width: '100%',
                        position: 'relative',
                        backgroundColor: 'background.default',
                        color: 'text.primary',
                    }}
                >
                    {isHomePage ? <LandingNavbar /> : <Navbar />}
                    <Box
                        component="main"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            width: '100%',
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        {children}
                    </Box>
                    <Footer />
                </Box>
            </MuiThemeProvider>
        </NextThemeProvider>
    );
} 