'use client';
import React from 'react';
import HeroSection from './LandingPage/HeroSection';
import FeaturesSection from './LandingPage/FeaturesSection';
import { featuresData } from './constants/features';

// Import Layout Components

export default function Home() {
    return (
        <div className="min-h-screen">
            <main style={{ paddingTop: '0px' }}>
                <HeroSection />
                <FeaturesSection features={featuresData} />
            </main>
        </div>
    );
}





