'use client';

import React, { useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from 'next-themes';
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
    const isHomePage = pathname === '/';

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            storageKey="theme"
        >
            <MuiThemeProvider>
                <CssBaseline />
                <Box
                    component="main"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100vh',
                        width: '100%',
                        bgcolor: 'background.default',
                        color: 'text.primary',
                    }}
                >
                    {isHomePage ? <LandingNavbar /> : <Navbar />}
                    <Box
                        sx={{
                            flex: 1,
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
        </ThemeProvider>
    );
} 