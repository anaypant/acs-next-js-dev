import { createTheme, PaletteMode } from '@mui/material';

// Define custom colors
const customColors = {
    light: {
        primary: {
            main: 'rgb(18, 20, 35)',
            light: 'rgb(40, 42, 55)',
            dark: 'rgb(10, 12, 25)',
            contrastText: '#fff'
        },
        background: {
            default: '#fff',
            paper: '#fff',
            accent: 'rgba(0, 0, 0, 0.02)'
        },
        text: {
            primary: 'rgb(18, 20, 35)',
            secondary: 'rgb(100, 100, 100)'
        },
        divider: 'rgba(0, 0, 0, 0.08)'
    },
    dark: {
        primary: {
            main: '#8FA1D0',
            light: '#A5B3D9',
            dark: '#7A8CB8',
            contrastText: '#fff'
        },
        background: {
            default: '#121212',
            paper: '#1E1E1E',
            accent: 'rgba(255, 255, 255, 0.05)'
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
            ...(mode === 'light'
                ? {
                      primary: customColors.light.primary,
                      background: customColors.light.background,
                      text: customColors.light.text,
                      divider: customColors.light.divider,
                      customColors: {
                          darkGreen: 'rgb(18, 20, 35)',
                          lightGreen: 'rgb(40, 42, 55)',
                          lightBg: '#fff'
                      }
                  }
                : {
                      primary: customColors.dark.primary,
                      background: customColors.dark.background,
                      text: customColors.dark.text,
                      divider: customColors.dark.divider,
                      customColors: {
                          darkGreen: '#8FA1D0',
                          lightGreen: '#A5B3D9',
                          lightBg: '#1E1E1E'
                      }
                  })
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            h1: {
                fontWeight: 600
            },
            h6: {
                fontWeight: 500
            }
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px'
                    }
                }
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: mode === 'light' ? '#fff' : '#1E1E1E',
                        borderBottom: `1px solid ${mode === 'light' ? customColors.light.divider : customColors.dark.divider}`
                    }
                }
            }
        }
    });
}; 