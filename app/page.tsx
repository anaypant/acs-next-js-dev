// Last Modified: 2025-04-14 by AI Assistant

import React from 'react';
import dynamic from 'next/dynamic';
import HeroSection from './LandingPage/HeroSection';
import FeaturesSection from './LandingPage/FeaturesSection';
import { featuresData } from './constants/features';
import LandingNavbar from './LandingPage/LandingNavbar';

// Import Layout Components

// Remove unused configurations
export default function Home() {
    return (
        <div className="min-h-screen bg-white grid-background">
            <LandingNavbar />
            <main>
                <HeroSection />
                <FeaturesSection features={featuresData} />
            </main>
        </div>
    );
}





