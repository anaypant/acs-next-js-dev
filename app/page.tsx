'use client';
import React from 'react';
import TopBar from './LandingPage/TopBar';
import HeroSection from './LandingPage/HeroSection';
import FeaturesSection from './LandingPage/FeaturesSection';
import { featuresData } from './constants/features';

// Import Layout Components

export default function Home() {
    return (
        <div className="min-h-screen grid-background">
            <TopBar />
            <main style={{ paddingTop: '48px' }}>
                <HeroSection />
                <FeaturesSection features={featuresData} />
            </main>
        </div>
    );
}





