// Last Modified: 2025-04-14 by AI Assistant

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Grid, Card, CardContent, Typography } from '@mui/material';

import { Feature } from '../types/landing';

interface FeatureCardProps {
    feature: Feature;
    index: number; // Index can be used for staggered animations if needed
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => {
    return (
        <div className="w-full sm:w-1/2 md:w-1/3 p-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }} // Optional: stagger animation
                viewport={{ once: true }}
                style={{ height: '100%' }} // Ensure motion div takes full height for consistent card alignment
            >
                <Card
                    sx={{
                        bgcolor: 'rgb(55, 56, 75)', // Use theme palette if available e.g., theme.palette.background.paper
                        color: 'rgb(210, 210, 230)', // Use theme palette e.g., theme.palette.text.primary
                        p: 2,
                        borderRadius: 2,
                        height: '100%', // Make card fill the grid item height
                        display: 'flex', // Added for flex column structure if needed
                        flexDirection: 'column', // Added for flex column structure
                        transition: 'box-shadow 0.3s ease-in-out',
                        '&:hover': {
                            boxShadow: '0px 6px 25px rgba(233, 69, 96, 0.6)' // Slightly enhanced hover shadow
                        },
                    }}
                >
                    <CardContent sx={{ flexGrow: 1 }}> {/* Allow content to grow */}
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            gutterBottom
                            sx={{ color: 'rgb(130, 160, 255)' }} // theme.palette.secondary.main or similar
                        >
                            {feature.title}
                        </Typography>
                        <Typography variant="body1">
                            {feature.description}
                        </Typography>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default FeatureCard;