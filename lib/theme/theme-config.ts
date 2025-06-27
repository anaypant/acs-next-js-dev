// Theme configuration system for ACS Next.js
// This allows for easy customization of color schemes and themes

import type { 
  ThemeConfig, 
  ThemeColors, 
  ThemeCSSVariables 
} from '@/types/theme';
import { 
  generateCSSVariables, 
  validateTheme, 
  createDarkVariant 
} from './theme-utils';

// Midnight Green color palette for Green & White theme
const midnightGreenPalette = {
  midnight50:  '#eafff6',
  midnight100: '#baffdf',
  midnight200: '#7dffd0',
  midnight300: '#39ffb7',
  midnight400: '#00ff94', // Neon green accent
  midnight500: '#00ff6a', // Neon green main
  midnight600: '#00b34a',
  midnight700: '#007a34',
  midnight800: '#00331a',
  midnight900: '#001a0d',
  midnight950: '#000a05', // Almost black
};

// Midnight Blue color palette for Blue & White theme
const midnightBluePalette = {
  midnight50: '#f0f7ff',
  midnight100: '#e0effe',
  midnight200: '#bae0fd',
  midnight300: '#7cc7fb',
  midnight400: '#36a7f7',
  midnight500: '#0e8aed',
  midnight600: '#0c6fd8',
  midnight700: '#0d5ab0',
  midnight800: '#114b8f',
  midnight900: '#134076',
  midnight950: '#0d2a4d',
};

// Midnight Purple color palette for Purple & White theme
const midnightPurplePalette = {
  midnight50: '#faf5ff',
  midnight100: '#f3e8ff',
  midnight200: '#e9d5ff',
  midnight300: '#d8b4fe',
  midnight400: '#c084fc',
  midnight500: '#a855f7',
  midnight600: '#9333ea',
  midnight700: '#7c3aed',
  midnight800: '#6b21a8',
  midnight900: '#581c87',
  midnight950: '#3b0764',
};

// Green and White Theme (Current ACS Theme) - Updated with Midnight Green
export const greenWhiteTheme: ThemeConfig = {
  name: 'Green & White',
  description: 'Classic ACS green and white theme with midnight green accents',
  colors: {
    primary: {
      main: '#0f2a1c',
      light: '#23573b',
      dark: '#0a1f14',
      contrast: '#FFFFFF',
    },
    secondary: {
      main: '#2d8a56',
      light: '#5bc285',
      dark: '#276e47',
      contrast: '#FFFFFF',
      xlight: '#dcf2e3',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
      accent: '#f0f9f4',
      subtle: 'rgba(15, 42, 28, 0.02)',
    },
    text: {
      primary: '#0f2a1c',
      secondary: 'rgba(15, 42, 28, 0.7)',
      muted: 'rgba(15, 42, 28, 0.5)',
      inverse: '#FFFFFF',
      gradient: 'rgba(255, 255, 255, 0.9)',
    },
    border: {
      default: 'rgba(15, 42, 28, 0.08)',
      subtle: 'rgba(15, 42, 28, 0.04)',
      accent: '#2d8a56',
    },
    status: {
      success: '#22c55e',
      warning: '#eab308',
      error: '#ef4444',
      info: '#3b82f6',
    },
    interactive: {
      hover: 'rgba(15, 42, 28, 0.04)',
      active: 'rgba(15, 42, 28, 0.08)',
      focus: '#2d8a56',
      disabled: 'rgba(15, 42, 28, 0.2)',
    },
    gradients: {
      primary: ['#0f2a1c', '#2d8a56', '#5bc285'],
      secondary: ['#23573b', '#2d8a56', '#276e47'],
      background: ['#f0f9f4', '#FFFFFF', '#e8f5ed'],
    },
    charts: {
      chart1: '#0f2a1c',
      chart2: '#2d8a56',
      chart3: '#5bc285',
      chart4: '#23573b',
      chart5: '#276e47',
    },
    sidebar: {
      background: '#f0f9f4',
      foreground: '#0f2a1c',
      primary: '#0f2a1c',
      primaryForeground: '#FFFFFF',
      accent: '#f0f9f4',
      accentForeground: '#0f2a1c',
      border: 'rgba(15, 42, 28, 0.08)',
      ring: '#2d8a56',
    },
    midnight: midnightGreenPalette,
  },
  radius: 0.5,
  cssVariables: {} as ThemeCSSVariables, // Will be generated
  isDark: false,
};

// Blue and White Theme (Alternative) - Updated with Midnight Blue
export const blueWhiteTheme: ThemeConfig = {
  name: 'Blue & White',
  description: 'Professional blue and white theme with midnight blue accents',
  colors: {
    primary: {
      main: '#0d2a4d',
      light: '#134076',
      dark: '#0a1f3a',
      contrast: '#FFFFFF',
    },
    secondary: {
      main: '#0c6fd8',
      light: '#36a7f7',
      dark: '#0d5ab0',
      contrast: '#FFFFFF',
      xlight: '#e0effe',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
      accent: '#f0f7ff',
      subtle: 'rgba(13, 42, 77, 0.02)',
    },
    text: {
      primary: '#0d2a4d',
      secondary: 'rgba(13, 42, 77, 0.7)',
      muted: 'rgba(13, 42, 77, 0.5)',
      inverse: '#FFFFFF',
      gradient: 'rgba(255, 255, 255, 0.9)',
    },
    border: {
      default: 'rgba(13, 42, 77, 0.08)',
      subtle: 'rgba(13, 42, 77, 0.04)',
      accent: '#0c6fd8',
    },
    status: {
      success: '#22c55e',
      warning: '#eab308',
      error: '#ef4444',
      info: '#3b82f6',
    },
    interactive: {
      hover: 'rgba(13, 42, 77, 0.04)',
      active: 'rgba(13, 42, 77, 0.08)',
      focus: '#0c6fd8',
      disabled: 'rgba(13, 42, 77, 0.2)',
    },
    gradients: {
      primary: ['#0d2a4d', '#0c6fd8', '#36a7f7'],
      secondary: ['#134076', '#0c6fd8', '#0d5ab0'],
      background: ['#f0f7ff', '#FFFFFF', '#e6f3ff'],
    },
    charts: {
      chart1: '#0d2a4d',
      chart2: '#0c6fd8',
      chart3: '#36a7f7',
      chart4: '#134076',
      chart5: '#0d5ab0',
    },
    sidebar: {
      background: '#f0f7ff',
      foreground: '#0d2a4d',
      primary: '#0d2a4d',
      primaryForeground: '#FFFFFF',
      accent: '#f0f7ff',
      accentForeground: '#0d2a4d',
      border: 'rgba(13, 42, 77, 0.08)',
      ring: '#0c6fd8',
    },
    midnight: midnightBluePalette,
  },
  radius: 0.5,
  cssVariables: {} as ThemeCSSVariables, // Will be generated
  isDark: false,
};

// Purple and White Theme (Alternative) - Updated with Midnight Purple
export const purpleWhiteTheme: ThemeConfig = {
  name: 'Purple & White',
  description: 'Modern purple and white theme with midnight purple accents',
  colors: {
    primary: {
      main: '#3b0764',
      light: '#581c87',
      dark: '#2d0a4d',
      contrast: '#FFFFFF',
    },
    secondary: {
      main: '#9333ea',
      light: '#c084fc',
      dark: '#7c3aed',
      contrast: '#FFFFFF',
      xlight: '#f3e8ff',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
      accent: '#faf5ff',
      subtle: 'rgba(59, 7, 100, 0.02)',
    },
    text: {
      primary: '#3b0764',
      secondary: 'rgba(59, 7, 100, 0.7)',
      muted: 'rgba(59, 7, 100, 0.5)',
      inverse: '#FFFFFF',
      gradient: 'rgba(255, 255, 255, 0.9)',
    },
    border: {
      default: 'rgba(59, 7, 100, 0.08)',
      subtle: 'rgba(59, 7, 100, 0.04)',
      accent: '#9333ea',
    },
    status: {
      success: '#22c55e',
      warning: '#eab308',
      error: '#ef4444',
      info: '#3b82f6',
    },
    interactive: {
      hover: 'rgba(59, 7, 100, 0.04)',
      active: 'rgba(59, 7, 100, 0.08)',
      focus: '#9333ea',
      disabled: 'rgba(59, 7, 100, 0.2)',
    },
    gradients: {
      primary: ['#3b0764', '#9333ea', '#c084fc'],
      secondary: ['#581c87', '#9333ea', '#7c3aed'],
      background: ['#faf5ff', '#FFFFFF', '#f3e8ff'],
    },
    charts: {
      chart1: '#3b0764',
      chart2: '#9333ea',
      chart3: '#c084fc',
      chart4: '#581c87',
      chart5: '#7c3aed',
    },
    sidebar: {
      background: '#faf5ff',
      foreground: '#3b0764',
      primary: '#3b0764',
      primaryForeground: '#FFFFFF',
      accent: '#faf5ff',
      accentForeground: '#3b0764',
      border: 'rgba(59, 7, 100, 0.08)',
      ring: '#9333ea',
    },
    midnight: midnightPurplePalette,
  },
  radius: 0.75,
  cssVariables: {} as ThemeCSSVariables, // Will be generated
  isDark: false,
};

// Generate CSS variables for all themes
greenWhiteTheme.cssVariables = generateCSSVariables(greenWhiteTheme.colors, greenWhiteTheme.radius);
blueWhiteTheme.cssVariables = generateCSSVariables(blueWhiteTheme.colors, blueWhiteTheme.radius);
purpleWhiteTheme.cssVariables = generateCSSVariables(purpleWhiteTheme.colors, purpleWhiteTheme.radius);

// Create dark variants
export const darkGreenTheme = createDarkVariant(greenWhiteTheme);
export const darkBlueTheme = createDarkVariant(blueWhiteTheme);
export const darkPurpleTheme = createDarkVariant(purpleWhiteTheme);

// Available themes
export const availableThemes: Record<string, ThemeConfig> = {
  'green-white': greenWhiteTheme,
  'blue-white': blueWhiteTheme,
  'purple-white': purpleWhiteTheme,
  'dark-green': darkGreenTheme,
  'dark-blue': darkBlueTheme,
  'dark-purple': darkPurpleTheme,
};

// Default theme
export const defaultTheme = 'green-white';

// Theme utilities
export function getThemeConfig(themeName: string): ThemeConfig {
  return availableThemes[themeName] || availableThemes[defaultTheme];
}

export function getThemeNames(): string[] {
  return Object.keys(availableThemes);
}

export function getThemeDisplayNames(): Array<{ value: string; label: string; description: string }> {
  return Object.entries(availableThemes).map(([key, theme]) => ({
    value: key,
    label: theme.name,
    description: theme.description,
  }));
}

// Validate all themes on import
export function validateAllThemes(): void {
  Object.entries(availableThemes).forEach(([themeName, theme]) => {
    const validation = validateTheme(theme);
    if (!validation.isValid) {
      console.error(`Theme validation failed for ${themeName}:`, validation.errors);
      throw new Error(`Invalid theme configuration: ${themeName}`);
    }
    if (validation.warnings.length > 0) {
      console.warn(`Theme warnings for ${themeName}:`, validation.warnings);
    }
  });
}

// Run validation on import
validateAllThemes(); 