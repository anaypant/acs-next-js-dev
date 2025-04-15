// Last Modified: 2025-04-14 by AI Assistant

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, Typography, useTheme } from '@mui/material';
import { Feature } from '../types/landing';

interface FeatureCardProps {
    feature: Feature;
    index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => {
    const theme = useTheme();

    return (
        <Card
            className="h-full transition-all duration-300 hover:shadow-xl"
            sx={{
                bgcolor: 'white',
                color: 'text.primary',
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                },
            }}
        >
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography
                    variant="h5"
                    component="h3"
                    fontWeight="bold"
                    gutterBottom
                    className="text-[#0A2F1F]"
                >
                    {feature.title}
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    className="leading-relaxed"
                >
                    {feature.description}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default FeatureCard;