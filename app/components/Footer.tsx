// Last Modified: 2025-04-14 by AI Assistant

'use client'; // Although simple, it uses Date() which can differ server/client initially

import React from 'react';
import { Container, Stack, Typography, Link, useTheme } from '@mui/material';

const Footer = () => {
    const theme = useTheme();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-8 bg-white border-t border-gray-200">
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
                            sx={{
                                color: theme.palette.text.primary,
                                fontWeight: 700
                            }}
                        >
                            ACS
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.secondary,
                                textAlign: { xs: 'center', sm: 'left' }
                            }}
                        >
                            © {currentYear} ACS. All rights reserved.
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={3}>
                        <Link
                            href="/privacy"
                            sx={{
                                color: theme.palette.text.secondary,
                                textDecoration: 'none',
                                '&:hover': {
                                    color: theme.palette.text.primary
                                }
                            }}
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            sx={{
                                color: theme.palette.text.secondary,
                                textDecoration: 'none',
                                '&:hover': {
                                    color: theme.palette.text.primary
                                }
                            }}
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