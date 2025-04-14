// Last Modified: 2025-04-14 by AI Assistant

import React from 'react';
import dynamic from 'next/dynamic';

// Import Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './LandingPage/HeroSection';

// Remove unused configurations
export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                <HeroSection />
            </main>
            <Footer />
        </div>
    );
}





