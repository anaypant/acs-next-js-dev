// Last Modified: 2025-04-14 by AI Assistant

'use client'; // Although simple, it uses Date() which can differ server/client initially

import React from 'react';
import { Container, Stack, Typography, Link, useTheme } from '@mui/material';

const Footer = () => {
    const theme = useTheme();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-8 bg-[#0A2F1F]/5 border-t border-[#0A2F1F]/10">
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
                            className="text-[#0A2F1F] font-bold"
                        >
                            ACS
                        </Typography>
                        <Typography
                            variant="body2"
                            className="text-[#0A2F1F]/70 text-center sm:text-left"
                        >
                            © {currentYear} ACS. All rights reserved.
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={3}>
                        <Link
                            href="/privacy"
                            className="text-[#0A2F1F]/70 hover:text-[#0A2F1F] transition-colors no-underline"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-[#0A2F1F]/70 hover:text-[#0A2F1F] transition-colors no-underline"
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