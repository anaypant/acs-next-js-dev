'use client';

import React, { useState } from 'react';
import {
    Container,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';
import { Feature } from '../types/landing';

interface FeatureTabsProps {
    features: Feature[];
}

const FeatureTabs: React.FC<FeatureTabsProps> = ({ features }) => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Container maxWidth="xl" className="my-8">
            <div className="max-w-[800px] mx-auto">
                <Typography
                    variant="h2"
                    component="h2"
                    align="center"
                    className="mb-4 text-2xl md:text-[2.5rem] font-semibold"
                >
                    Our Features
                </Typography>
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Accordion
                            expanded={expanded === `panel${index}`}
                            onChange={handleChange(`panel${index}`)}
                            sx={{
                                mb: 2,
                                backgroundColor: theme.palette.background.paper,
                                boxShadow: theme.shadows[2],
                                '&:before': { display: 'none' },
                                borderRadius: '8px !important',
                                overflow: 'hidden'
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                    '&.Mui-expanded': {
                                        minHeight: 64,
                                        borderBottom: `1px solid ${theme.palette.divider}`
                                    }
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 500,
                                        color: theme.palette.text.primary
                                    }}
                                >
                                    {feature.title}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        lineHeight: 1.7
                                    }}
                                >
                                    {feature.description}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </motion.div>
                ))}
            </div>
        </Container>
    );
};

export default FeatureTabs; 