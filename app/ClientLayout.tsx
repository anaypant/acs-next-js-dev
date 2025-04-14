'use client';

import React, { useState, useEffect } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './theme/ThemeContext';

interface ClientLayoutProps {
    children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <ThemeProvider>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
} 