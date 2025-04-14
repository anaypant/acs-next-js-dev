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
    Button
} from '@mui/material';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Contact', href: '/contact' }
];

const Navbar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <header>

            {/* Main Navbar */}
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: 'white',
                    borderBottom: '1px solid',
                    borderColor: 'rgba(0, 0, 0, 0.12)',
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
                                color: '#0A2F1F',
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
                                            color: '#2E2E2E',
                                            textDecoration: 'none',
                                            '&:hover': {
                                                color: '#0A2F1F'
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
                                    sx={{ color: '#0A2F1F' }}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
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

                        {/* Auth Buttons */}
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button
                                component={Link}
                                href="/login"
                                variant="text"
                                sx={{
                                    color: '#2E2E2E',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    '&:hover': {
                                        color: '#0A2F1F'
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
                                    bgcolor: '#0A2F1F',
                                    color: 'white',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    px: 3,
                                    py: 1,
                                    borderRadius: '8px',
                                    '&:hover': {
                                        bgcolor: '#0D3B26'
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