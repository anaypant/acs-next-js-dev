// Last Modified: 2025-04-14 by AI Assistant

'use client';

import React from 'react';
import { Container, Typography, Grid, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import FeatureCard from '../components/FeatureCard';
import type { Feature } from '../types/landing'; // Assuming types are defined

// Constants for Features Section
const FEATURES_TITLE = "Powerful Features for Real Estate Professionals";
const FEATURES_SECTION_ID = "features"; // For potential navigation

interface FeaturesSectionProps {
    features: Feature[]; // Use the defined Feature type
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
    const theme = useTheme();

    return (
        <section id={FEATURES_SECTION_ID} className="py-16 bg-gradient-to-b from-white to-gray-50">
            <Container maxWidth="lg">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Typography
                        variant="h2"
                        component="h2"
                        align="center"
                        className="mb-4 text-3xl md:text-4xl font-bold text-[#0A2F1F]"
                    >
                        {FEATURES_TITLE}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        align="center"
                        className="mb-12 text-gray-600 max-w-2xl mx-auto"
                    >
                        Discover how our AI-powered tools can transform your real estate business
                    </Typography>
                </motion.div>

                <Grid container spacing={6} justifyContent="center">
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
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