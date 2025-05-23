import React, { useState } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Collapse,
    styled,
    useTheme,
    alpha
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface Feature {
    title: string;
    description: string;
}

interface FeatureAccordionProps {
    features: Feature[];
}

const FeatureAccordion: React.FC<FeatureAccordionProps> = ({ features }) => {
    const [expanded, setExpanded] = useState<number | null>(null);
    const theme = useTheme();

    const handleToggle = (index: number) => {
        setExpanded(expanded === index ? null : index);
    };

    const FeatureItem = styled(ListItem)(({ theme }) => ({
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(2, 0),
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
        },
    }));

    return (
        <Box sx={{ maxWidth: '800px', width: '100%', mt: 4 }}>
            <List disablePadding>
                {features.map((feature, index) => (
                    <FeatureItem
                        key={index}
                        onClick={() => handleToggle(index)}
                        disablePadding
                    >
                        <Box sx={{ width: '100%' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%'
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: expanded === index ? 600 : 400,
                                        color: theme.palette.text.primary
                                    }}
                                >
                                    {feature.title}
                                </Typography>
                                <IconButton
                                    edge="end"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggle(index);
                                    }}
                                    sx={{
                                        transform: expanded === index ? 'rotate(180deg)' : 'none',
                                        transition: 'transform 0.3s',
                                        color: theme.palette.text.primary
                                    }}
                                >
                                    {expanded === index ? <RemoveIcon /> : <AddIcon />}
                                </IconButton>
                            </Box>
                            <Collapse in={expanded === index} timeout="auto" unmountOnExit>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        mt: 1,
                                        color: theme.palette.text.secondary,
                                        pr: 4
                                    }}
                                >
                                    {feature.description}
                                </Typography>
                            </Collapse>
                        </Box>
                    </FeatureItem>
                ))}
            </List>
        </Box>
    );
};

export default FeatureAccordion; 