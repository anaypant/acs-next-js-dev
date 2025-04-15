// Last Modified: 2025-04-14 by AI Assistant

'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { featuresData } from '../constants/features';
import { HERO_CONSTANTS } from '../constants/hero';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useTheme } from 'next-themes';

// Use motion components directly instead of dynamic imports
const MotionDiv = motion.div;

const HeroSection: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [expandedTab, setExpandedTab] = useState<number | null>(null);
    const { theme, resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleTabClick = (index: number) => {
        setExpandedTab(expandedTab === index ? null : index);
    };

    const highlightText = (text: string) => {
        if (!isMounted) return text;
        
        return HERO_CONSTANTS.DESCRIPTION.HIGHLIGHTS.reduce((acc, highlight) => {
            if (text.includes(highlight)) {
                return acc.replace(
                    highlight,
                    `<span class="${isDark ? 'text-emerald-400' : 'text-[#0A2F1F]'} font-medium">${highlight}</span>`
                );
            }
            return acc;
        }, text);
    };

    if (!isMounted) {
        return (
            <div className="relative min-h-screen w-full overflow-hidden bg-white">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50" />
            </div>
        );
    }

    return (
        <div className={`relative min-h-screen w-full overflow-hidden ${isDark ? 'bg-gradient-to-b from-black via-[#0A2F1F]/10 to-black' : ''}`}>
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className={`absolute top-20 left-10 w-64 h-64 ${isDark ? 'bg-emerald-500/10' : null} rounded-full mix-blend-${isDark ? 'soft-light' : 'multiply'} filter blur-3xl opacity-${isDark ? '20' : '5'} animate-float`} />
                <div className={`absolute bottom-20 right-10 w-80 h-80 ${isDark ? 'bg-emerald-500/10' : null} rounded-full mix-blend-${isDark ? 'soft-light' : 'multiply'} filter blur-3xl opacity-${isDark ? '20' : '5'} animate-float`} style={{ animationDelay: '-2s' }} />
                {/* Grid Lines */}
                {isDark && (
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4ade8005_1px,transparent_1px),linear-gradient(to_bottom,#4ade8005_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
                )}
            </div>
            
            {/* Content */}
            <div className="relative container mx-auto px-4 py-20 lg:py-32">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-0 items-center">
                    <div className="space-y-8">
                        <MotionDiv
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className={`text-5xl lg:text-6xl font-display font-bold ${isDark ? 'text-white' : 'text-[#0A2F1F]'}`}
                        >
                            <span>{HERO_CONSTANTS.MAIN_TITLE.LINE1}</span>
                            <br />
                            <span>{HERO_CONSTANTS.MAIN_TITLE.LINE2}</span>
                        </MotionDiv>

                        <MotionDiv
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={`text-base ${isDark ? 'text-gray-300' : 'text-[#0A2F1F]/60'} max-w-lg font-sans leading-relaxed`}
                        >
                            <p 
                                dangerouslySetInnerHTML={{ 
                                    __html: highlightText(HERO_CONSTANTS.DESCRIPTION.TEXT)
                                }} 
                                className={`${isDark ? 'bg-black/30 border border-emerald-500/20 rounded-lg p-6 backdrop-blur-sm shadow-lg' : ''} text-base ${isDark ? 'text-white' : 'text-[#0A2F1F]/60'} max-w-lg font-sans leading-relaxed`}
                            />
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
                                className={`${isDark ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-[#0A2F1F] hover:bg-[#0D3B26]'} text-white px-7 py-2.5 text-base rounded-md shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
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
                                    className={`border ${isDark ? 'border-gray-800/50 hover:border-gray-700/50 bg-gradient-to-r from-black/50' : 'border-[#0A2F1F]/10 hover:border-[#0A2F1F]/20 bg-gradient-to-r from-white/60'} to-transparent rounded-lg overflow-hidden transition-all duration-300 backdrop-blur-[2px]`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                >
                                    <button
                                        onClick={() => handleTabClick(index)}
                                        className="w-full px-6 py-4 text-left flex items-center justify-between"
                                    >
                                        <span className={`font-medium ${isDark ? 'text-white' : 'text-[#0A2F1F]'}`}>
                                            {feature.title}
                                        </span>
                                        {expandedTab === index ? (
                                            <RemoveIcon className={isDark ? 'text-gray-400' : 'text-[#0A2F1F]/60'} />
                                        ) : (
                                            <AddIcon className={isDark ? 'text-gray-400' : 'text-[#0A2F1F]/60'} />
                                        )}
                                    </button>
                                    <AnimatePresence>
                                        {expandedTab === index && (
                                            <MotionDiv
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className={`px-6 pb-4 ${isDark ? 'text-gray-400' : 'text-[#0A2F1F]/60'}`}
                                            >
                                                {feature.description}
                                            </MotionDiv>
                                        )}
                                    </AnimatePresence>
                                </MotionDiv>
                            ))}
                        </MotionDiv>
                    </div>

                    <div className="relative h-[570px] lg:h-[760px] pr-6 lg:pr-14">
                        <MotionDiv
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="relative h-full animate-float"
                        >
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