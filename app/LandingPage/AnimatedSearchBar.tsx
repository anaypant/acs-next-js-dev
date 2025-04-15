// Last Modified: 2025-04-14 by AI Assistant

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button } from '@mui/material';

const PLACEHOLDER_TEXTS = [
    'Search for properties...',
    'Find investment opportunities...',
    'Analyze market trends...',
    'Discover neighborhoods...'
];

const SEARCH_BUTTON_TEXT = 'Search';
const TYPING_DELAY = 3000;
const TYPING_SPEED = 100;

const AnimatedSearchBar: React.FC = () => {
    const [currentPlaceholder, setCurrentPlaceholder] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mounted, setMounted] = useState(false);

    const animateText = useCallback(() => {
        let currentText = '';
        let charIndex = 0;

        const typingInterval = setInterval(() => {
            if (charIndex < PLACEHOLDER_TEXTS[currentIndex].length) {
                currentText += PLACEHOLDER_TEXTS[currentIndex][charIndex];
                setCurrentPlaceholder(currentText);
                charIndex++;
            }
        }, TYPING_SPEED);

        return () => clearInterval(typingInterval);
    }, [currentIndex]);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const indexInterval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % PLACEHOLDER_TEXTS.length);
        }, TYPING_DELAY);

        return () => clearInterval(indexInterval);
    }, [mounted]);

    useEffect(() => {
        if (!mounted) return;
        return animateText();
    }, [currentIndex, mounted, animateText]);

    if (!mounted) {
        return (
            <TextField
                fullWidth
                placeholder={PLACEHOLDER_TEXTS[0]}
                variant="outlined"
                sx={{
                    visibility: 'hidden',
                }}
            />
        );
    }

    return (
        <div className="mb-4 max-w-[600px] w-[90%] flex items-center gap-0 rounded-[50px] overflow-hidden shadow-lg bg-gradient-to-r from-[rgb(55,56,75)] to-[rgb(65,66,85)]">
            <TextField
                variant="standard"
                placeholder={currentPlaceholder}
                fullWidth
                InputProps={{
                    disableUnderline: true,
                    sx: {
                        height: '100%',
                        padding: '15px 25px',
                        color: 'white',
                        '& input::placeholder': {
                            color: 'rgba(255, 255, 255, 0.7)',
                            opacity: 1
                        }
                    }
                }}
            />
            <Button
                variant="contained"
                sx={{
                    px: 4,
                    py: '15px',
                    fontWeight: 'bold',
                    borderRadius: '0 50px 50px 0',
                    color: 'white',
                    background: 'linear-gradient(to right, rgb(130, 160, 255), rgb(233, 69, 96))',
                    boxShadow: '0 4px 15px rgba(233, 69, 96, 0.5)',
                    transition: 'transform 0.2s ease, background 0.3s ease',
                    flexShrink: 0,
                    '&:hover': {
                        background: 'linear-gradient(to right, rgb(150, 180, 255), rgb(255, 90, 120))',
                        transform: 'scale(1.05)',
                        boxShadow: '0 6px 20px rgba(233, 69, 96, 0.6)',
                    },
                }}
            >
                {SEARCH_BUTTON_TEXT}
            </Button>
        </div>
    );
};

export default AnimatedSearchBar;