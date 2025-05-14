// Last Modified: 2025-04-14 by AI Assistant

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@mui/material';

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
            } else {
                clearInterval(typingInterval);
            }
        }, TYPING_SPEED);

        return () => clearInterval(typingInterval);
    }, [currentIndex]);

    useEffect(() => {
        setMounted(true);
        setCurrentPlaceholder(PLACEHOLDER_TEXTS[0].substring(0, 0));
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const indexInterval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % PLACEHOLDER_TEXTS.length);
            setCurrentPlaceholder('');
        }, TYPING_DELAY);

        return () => clearInterval(indexInterval);
    }, [mounted]);

    useEffect(() => {
        if (!mounted) return;
        const clearTyping = animateText();
        return clearTyping;
    }, [currentIndex, mounted, animateText]);

    if (!mounted) {
        return <div className="h-[60px] mb-4 max-w-[600px] w-[90%] invisible"></div>;
    }

    return (
        <div className="mb-4 max-w-[600px] w-[90%] flex items-center gap-0 rounded-full overflow-hidden shadow-lg bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 dark:from-gray-800 dark:via-gray-900 dark:to-black border border-gray-600/50 dark:border-gray-700/50">
            <input
                type="text"
                placeholder={currentPlaceholder}
                className="flex-grow h-full px-6 py-4 bg-transparent text-white placeholder-gray-400 outline-none border-none text-base"
            />
            <Button
                variant="contained"
                className="flex-shrink-0 px-6 py-4 rounded-none rounded-r-full font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                sx={{
                    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
                    '&:hover': {
                        boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)',
                    }
                }}
            >
                {SEARCH_BUTTON_TEXT}
            </Button>
        </div>
    );
};

export default AnimatedSearchBar;