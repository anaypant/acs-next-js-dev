'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@mui/material';

const Navbar = () => {
    return (
        <nav className="bg-white border-b border-gray-100">
            <div className="max-w-[1400px] mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold text-[#0A2F1F]">
                        ACS
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/solutions" className="text-gray-600 hover:text-[#0A2F1F]">
                            Solutions
                        </Link>
                        <Link href="/case-studies" className="text-gray-600 hover:text-[#0A2F1F]">
                            Case Studies
                        </Link>
                        <Link href="/contact" className="text-gray-600 hover:text-[#0A2F1F]">
                            Contact
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link href="/login" className="text-gray-600 hover:text-[#0A2F1F]">
                            Sign in
                        </Link>
                        <Button
                            component={Link}
                            href="/signup"
                            variant="contained"
                            className="bg-[#0A2F1F] hover:bg-[#0D3B26] text-white px-4 py-2 rounded-md"
                        >
                            Get Started
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 