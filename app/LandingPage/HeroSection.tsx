// Last Modified: 2025-04-14 by AI Assistant

'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { featuresData } from '../constants/features';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// Use motion components directly instead of dynamic imports
const MotionDiv = motion.div;

const HeroSection: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [expandedTab, setExpandedTab] = useState<number | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleTabClick = (index: number) => {
        setExpandedTab(expandedTab === index ? null : index);
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#e6f0eb] via-[#f0f7f3] to-[#e6f0eb] opacity-50" />
            <div className="absolute inset-0 bg-[url('/mesh-gradient.svg')] bg-cover bg-center opacity-30" />
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-64 h-64 bg-[#0A2F1F] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" />
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#2A5F4F] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '-2s' }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[760px] h-[760px] bg-[#1A3F2F] rounded-full mix-blend-multiply filter blur-3xl opacity-5" />
            </div>
            
            {/* Content */}
            <div className="relative w-full px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[calc(100vh-2rem)] max-w-[1900px] mx-auto">
                    {/* Left Column */}
                    <div className="space-y-8 pl-6 lg:pl-14 backdrop-blur-sm">
                        <MotionDiv
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-4"
                        >
                            <h1 className="font-montserrat font-bold text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight">
                                <span className="bg-gradient-to-r from-[#0A2F1F] via-[#2A5F4F] to-[#0A2F1F] bg-clip-text text-transparent animate-text-gradient">
                                    Empowering
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-[#0A2F1F]/90 via-[#2A5F4F]/90 to-[#0A2F1F]/90 bg-clip-text text-transparent animate-text-gradient">
                                    Realtors with AI
                                </span>
                            </h1>
                        </MotionDiv>

                        <MotionDiv
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-base text-gray-700 max-w-lg font-sans leading-relaxed"
                        >
                            Leverage AI to generate real-time business solutions and make informed decisions faster than ever.
                        </MotionDiv>

                        <MotionDiv
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex gap-4"
                        >
                            <Button
                                component={Link}
                                href="/signup"
                                variant="contained"
                                className="bg-[#0A2F1F] hover:bg-[#0D3B26] text-white px-7 py-2.5 text-base rounded-md shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            >
                                Get Started
                            </Button>
                        </MotionDiv>

                        <MotionDiv
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="space-y-3"
                        >
                            {featuresData.map((feature, index) => (
                                <MotionDiv
                                    key={feature.title}
                                    className="border-b border-gray-200 last:border-b-0 bg-white/50 backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-300 hover:bg-white/70"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                >
                                    <button
                                        onClick={() => handleTabClick(index)}
                                        className="w-full flex items-center justify-between p-3.5 text-left focus:outline-none group"
                                    >
                                        <div className="flex items-center">
                                            <span className="text-[#0A2F1F] transform transition-transform duration-300 group-hover:translate-x-2">→</span>
                                            <span className="ml-3 text-base text-gray-800 font-medium">
                                                {feature.title}
                                            </span>
                                        </div>
                                        <MotionDiv
                                            animate={{ rotate: expandedTab === index ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-[#0A2F1F]"
                                        >
                                            {expandedTab === index ? <RemoveIcon /> : <AddIcon />}
                                        </MotionDiv>
                                    </button>
                                    <AnimatePresence>
                                        {expandedTab === index && (
                                            <MotionDiv
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="py-3.5 px-7 text-gray-600 text-sm">
                                                    {feature.description}
                                                </p>
                                            </MotionDiv>
                                        )}
                                    </AnimatePresence>
                                </MotionDiv>
                            ))}
                        </MotionDiv>
                    </div>

                    {/* Right Column - Image */}
                    <div className="relative h-[570px] lg:h-[760px] pr-6 lg:pr-14">
                        <MotionDiv
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="relative h-full animate-float"
                        >
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-xl" />
                            <Image
                                src="/realtor-ai-dashboard.gif"
                                alt="AI-Powered Real Estate Dashboard"
                                fill
                                className="object-contain rounded-xl shadow-xl"
                                priority
                            />
                            
                            <MotionDiv
                                className="absolute top-[10%] -right-[5%] w-[170px] h-[114px] rounded-lg overflow-hidden shadow-lg"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                                <Image
                                    src="/price-prediction.png"
                                    alt="Price Prediction Feature"
                                    fill
                                    className="object-cover"
                                />
                            </MotionDiv>
                            
                            <MotionDiv
                                className="absolute bottom-[15%] -left-[5%] w-[152px] h-[95px] rounded-lg overflow-hidden shadow-lg"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1 }}
                            >
                                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                                <Image
                                    src="/email-automation.png"
                                    alt="Email Communications Automation Feature"
                                    fill
                                    className="object-cover"
                                />
                            </MotionDiv>
                        </MotionDiv>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;