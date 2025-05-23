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
            className="h-full transition-all duration-300 hover:shadow-2xl rounded-2xl border border-[#e0e7ef] bg-white"
            sx={{
                bgcolor: 'white',
                color: 'text.primary',
                borderRadius: 4,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid',
                borderColor: '#e0e7ef',
                boxShadow: '0 4px 32px 0 rgba(10,47,31,0.07)',
                '&:hover': {
                    transform: 'translateY(-6px) scale(1.03)',
                    boxShadow: '0 8px 40px 0 rgba(10,47,31,0.13)',
                },
                fontFamily: 'Inter, Arial, Helvetica, sans-serif',
            }}
        >
            <CardContent sx={{ flexGrow: 1, p: 4 }}>
                <Typography
                    variant="h5"
                    component="h3"
                    fontWeight="extrabold"
                    gutterBottom
                    className="text-[#0A2F1F] text-2xl lg:text-3xl mb-3"
                    style={{fontFamily: 'inherit'}}
                >
                    {feature.title}
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    className="leading-relaxed text-lg text-[#0A2F1F]/80"
                    style={{fontFamily: 'inherit'}}
                >
                    {feature.description}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default FeatureCard;