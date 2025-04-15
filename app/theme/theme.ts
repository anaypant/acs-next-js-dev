import { createTheme, PaletteMode } from '@mui/material';

// Define custom colors
const customColors = {
    light: {
        primary: {
            main: '#0A2F1F',
            light: '#2A5F4F',
            dark: '#071F15',
            contrastText: '#fff'
        },
        secondary: {
            main: '#2A5F4F',
            light: '#3A7F6F',
            dark: '#1A3F2F',
            contrastText: '#fff'
        },
        background: {
            default: '#fff',
            paper: '#fff',
            accent: 'rgba(10, 47, 31, 0.02)'
        },
        text: {
            primary: '#0A2F1F',
            secondary: 'rgba(10, 47, 31, 0.7)'
        },
        divider: 'rgba(10, 47, 31, 0.08)'
    },
    dark: {
        primary: {
            main: '#2A5F4F',
            light: '#3A7F6F',
            dark: '#1A3F2F',
            contrastText: '#fff'
        },
        secondary: {
            main: '#0A2F1F',
            light: '#2A5F4F',
            dark: '#071F15',
            contrastText: '#fff'
        },
        background: {
            default: '#121212',
            paper: '#1E1E1E',
            accent: 'rgba(42, 95, 79, 0.05)'
        },
        text: {
            primary: '#fff',
            secondary: 'rgba(255, 255, 255, 0.7)'
        },
        divider: 'rgba(255, 255, 255, 0.12)'
    }
};

export const getTheme = (mode: PaletteMode) => {
    return createTheme({
        palette: {
            mode,
            ...(mode === 'light' ? customColors.light : customColors.dark)
        },
        typography: {
            fontFamily: [
                'Inter',
                'Montserrat',
                'Playfair Display',
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
            ].join(','),
            h1: {
                fontWeight: 700,
                fontSize: '2.5rem',
                lineHeight: 1.2,
            },
            h2: {
                fontWeight: 600,
                fontSize: '2rem',
                lineHeight: 1.3,
            },
            h3: {
                fontWeight: 600,
                fontSize: '1.75rem',
                lineHeight: 1.3,
            },
            h4: {
                fontWeight: 600,
                fontSize: '1.5rem',
                lineHeight: 1.4,
            },
            h5: {
                fontWeight: 600,
                fontSize: '1.25rem',
                lineHeight: 1.4,
            },
            h6: {
                fontWeight: 600,
                fontSize: '1rem',
                lineHeight: 1.4,
            },
            body1: {
                fontSize: '1rem',
                lineHeight: 1.5,
            },
            body2: {
                fontSize: '0.875rem',
                lineHeight: 1.5,
            },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        borderRadius: 8,
                        padding: '8px 16px',
                    },
                    contained: {
                        boxShadow: 'none',
                        '&:hover': {
                            boxShadow: 'none',
                        },
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    },
                },
            },
        },
    });
}; 