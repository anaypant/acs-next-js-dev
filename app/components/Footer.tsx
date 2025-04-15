// Last Modified: 2025-04-14 by AI Assistant

'use client'; // Although simple, it uses Date() which can differ server/client initially

import React, { useState, useEffect } from 'react';
import { Container, Stack, Typography, Link } from '@mui/material';
import { useTheme } from 'next-themes';

const Footer = () => {
    const { theme } = useTheme();
    const [currentYear, setCurrentYear] = useState('');
    const isDark = theme === 'dark';

    useEffect(() => {
        setCurrentYear(new Date().getFullYear().toString());
    }, []);

    return (
        <footer className={`py-8 ${isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-[#0A2F1F]/5 border-[#0A2F1F]/10'} border-t`}>
            <Container maxWidth="xl">
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 4, sm: 2 }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'center', sm: 'flex-start' }}
                >
                    <Stack spacing={2} alignItems={{ xs: 'center', sm: 'flex-start' }}>
                        <Typography
                            variant="h6"
                            className={`${isDark ? 'text-gray-200' : 'text-[#0A2F1F]'} font-bold`}
                        >
                            ACS
                        </Typography>
                        <Typography
                            variant="body2"
                            className={`${isDark ? 'text-gray-400' : 'text-[#0A2F1F]/70'} text-center sm:text-left`}
                        >
                            © {currentYear || new Date().getFullYear()} ACS. All rights reserved.
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={3}>
                        <Link
                            href="/privacy"
                            className={`${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-[#0A2F1F]/70 hover:text-[#0A2F1F]'} transition-colors no-underline`}
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className={`${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-[#0A2F1F]/70 hover:text-[#0A2F1F]'} transition-colors no-underline`}
                        >
                            Terms of Service
                        </Link>
                    </Stack>
                </Stack>
            </Container>
        </footer>
    );
};

export default Footer;