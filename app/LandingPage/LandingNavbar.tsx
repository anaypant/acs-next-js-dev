'use client';

import React from 'react';
import Link from 'next/link';
import { Button, Container } from '@mui/material';

const LandingNavbar = () => {
    return (
        <nav className="absolute top-0 left-0 right-0 z-50 py-6">
            <Container maxWidth="xl">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-[#0A2F1F] text-2xl font-bold">
                        ACS
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/solutions" className="text-[#0A2F1F]/80 hover:text-[#0A2F1F] transition-colors">
                            Solutions
                        </Link>
                        <Link href="/case-studies" className="text-[#0A2F1F]/80 hover:text-[#0A2F1F] transition-colors">
                            Case Studies
                        </Link>
                        <Link href="/contact" className="text-[#0A2F1F]/80 hover:text-[#0A2F1F] transition-colors">
                            Contact
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link href="/login" className="text-[#0A2F1F]/80 hover:text-[#0A2F1F] transition-colors">
                            Login
                        </Link>
                        <Button
                            component={Link}
                            href="/signup"
                            variant="contained"
                            className="bg-[#0A2F1F] hover:bg-[#0A2F1F]/90 text-white px-6 py-2"
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