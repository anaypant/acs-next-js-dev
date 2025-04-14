// Last Modified: 2025-04-14 by AI Assistant

'use client';

import React from 'react';
import { Container, Typography, Grid } from '@mui/material';
import FeatureCard from '../components/FeatureCard';
import type { Feature } from '../types/landing'; // Assuming types are defined

// Constants for Features Section
const FEATURES_TITLE = "Features";
const FEATURES_SECTION_ID = "features"; // For potential navigation

interface FeaturesSectionProps {
    features: Feature[]; // Use the defined Feature type
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
    return (
        <Container id={FEATURES_SECTION_ID} sx={{ py: 8 }}>
            <Typography
                variant="h4"
                fontWeight="bold"
                textAlign="center"
                sx={{ mb: 6, color: 'rgb(130, 160, 255)' }} // Use theme colors if available
            >
                {FEATURES_TITLE}
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                {features.map((feature, index) => (
                    // Pass key here at the list level
                    <FeatureCard key={index} feature={feature} index={index} />
                ))}
            </Grid>
        </Container>
    );
};

export default FeaturesSection;