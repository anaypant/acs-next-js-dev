// Last Modified: 2025-04-14 by AI Assistant

'use client';

import React from 'react';
import {
    AppBar,
    Container,
    Stack,
    Toolbar,
    Typography,
    useTheme,
    useMediaQuery,
    IconButton,
    Menu,
    MenuItem,
    Button,
    Tooltip
} from '@mui/material';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTheme as useNextTheme } from 'next-themes';

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Contact', href: '/contact' }
];

const Navbar = () => {
    const theme = useTheme();
    const { theme: currentTheme, setTheme } = useNextTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const isDark = currentTheme === 'dark';

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <header>
            {/* Main Navbar */}
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: isDark ? 'rgb(17, 17, 17)' : 'white',
                    borderBottom: '1px solid',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters className="flex justify-between items-center">
                        {/* Logo */}
                        <Typography
                            variant="h6"
                            component={Link}
                            href="/"
                            sx={{
                                color: isDark ? '#fff' : '#0A2F1F',
                                textDecoration: 'none',
                                fontWeight: 700,
                                fontSize: '1.5rem'
                            }}
                        >
                            ACS
                        </Typography>

                        {/* Navigation Links - Desktop */}
                        {!isMobile && (
                            <Stack
                                direction="row"
                                spacing={4}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {navItems.map((item) => (
                                    <Typography
                                        key={item.label}
                                        component={Link}
                                        href={item.href}
                                        sx={{
                                            color: isDark ? '#fff' : '#2E2E2E',
                                            textDecoration: 'none',
                                            '&:hover': {
                                                color: isDark ? '#4CAF50' : '#0A2F1F'
                                            }
                                        }}
                                    >
                                        {item.label}
                                    </Typography>
                                ))}
                            </Stack>
                        )}

                        {/* Mobile Menu */}
                        {isMobile && (
                            <>
                                <IconButton
                                    onClick={handleMenuOpen}
                                    sx={{ color: isDark ? '#fff' : '#0A2F1F' }}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    PaperProps={{
                                        sx: {
                                            bgcolor: isDark ? 'rgb(17, 17, 17)' : 'white',
                                            color: isDark ? '#fff' : 'inherit'
                                        }
                                    }}
                                >
                                    {navItems.map((item) => (
                                        <MenuItem
                                            key={item.label}
                                            onClick={handleMenuClose}
                                            component={Link}
                                            href={item.href}
                                        >
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        )}

                        {/* Auth Buttons and Theme Toggle */}
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
                                <IconButton
                                    onClick={toggleTheme}
                                    sx={{
                                        color: isDark ? '#fff' : '#0A2F1F',
                                        '&:hover': {
                                            color: isDark ? '#4CAF50' : '#0D3B26'
                                        }
                                    }}
                                >
                                    {isDark ? <LightModeIcon /> : <DarkModeIcon />}
                                </IconButton>
                            </Tooltip>
                            <Button
                                component={Link}
                                href="/login"
                                variant="text"
                                sx={{
                                    color: isDark ? '#fff' : '#2E2E2E',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    '&:hover': {
                                        color: isDark ? '#4CAF50' : '#0A2F1F'
                                    }
                                }}
                            >
                                Sign in
                            </Button>
                            <Button
                                component={Link}
                                href="/signup"
                                variant="contained"
                                sx={{
                                    bgcolor: isDark ? '#4CAF50' : '#0A2F1F',
                                    color: 'white',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    px: 3,
                                    py: 1,
                                    borderRadius: '8px',
                                    '&:hover': {
                                        bgcolor: isDark ? '#45a049' : '#0D3B26'
                                    }
                                }}
                            >
                                Get Started
                            </Button>
                        </Stack>
                    </Toolbar>
                </Container>
            </AppBar>
        </header>
    );
};

export default Navbar;