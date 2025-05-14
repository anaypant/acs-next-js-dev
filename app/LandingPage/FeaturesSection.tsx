// Last Modified: 2025-04-14 by AI Assistant

'use client';

import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { motion } from 'framer-motion';
import FeatureCard from '../components/FeatureCard';
import type { Feature } from '../types/landing'; // Assuming types are defined
import { useTheme } from 'next-themes'; // Use next-themes hook

// Constants for Features Section
const FEATURES_TITLE = "Powerful Features for Real Estate Professionals";
const FEATURES_SECTION_ID = "features"; // For potential navigation

interface FeaturesSectionProps {
    features: Feature[]; // Use the defined Feature type
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
    const { resolvedTheme } = useTheme(); // Get resolved theme
    const isDark = resolvedTheme === 'dark';

    return (
        <section id={FEATURES_SECTION_ID} className="py-8 lg:py-12 bg-[#f7faf9]">
            <Container maxWidth="lg" className="px-2 sm:px-4 lg:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8 lg:mb-10"
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-[#0A2F1F]" style={{fontFamily: 'Inter, Arial, Helvetica, sans-serif'}}>
                        {FEATURES_TITLE}
                    </h2>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto text-[#0A2F1F]/80 font-medium" style={{fontFamily: 'Inter, Arial, Helvetica, sans-serif'}}>
                        Discover how our AI-powered tools can transform your real estate business
                    </p>
                </motion.div>
                <Grid container spacing={2} justifyContent="center">
                    {features.map((feature, index) => (
                        <Grid component="div" xs={12} sm={6} md={4} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="h-full"
                            >
                                <FeatureCard feature={feature} index={index} />
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </section>
    );
};

export default FeaturesSection;