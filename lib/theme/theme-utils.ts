/**
 * Theme utility functions for generating CSS variables and validating themes
 */

import type { 
  ThemeConfig, 
  ThemeColors, 
  ThemeCSSVariables, 
  ThemeValidation,
  ThemeGenerator 
} from '@/types/theme';

/**
 * Generate CSS variables from theme colors
 */
export function generateCSSVariables(colors: ThemeColors, radius: number): ThemeCSSVariables {
  return {
    // Core variables
    '--background': colors.background.default,
    '--foreground': colors.text.primary,
    '--card': colors.background.paper,
    '--card-foreground': colors.text.primary,
    '--popover': colors.background.paper,
    '--popover-foreground': colors.text.primary,
    
    // Primary variables
    '--primary': colors.primary.main,
    '--primary-light': colors.primary.light,
    '--primary-dark': colors.primary.dark,
    '--primary-foreground': colors.primary.contrast,
    
    // Secondary variables
    '--secondary': colors.secondary.main,
    '--secondary-light': colors.secondary.light,
    '--secondary-xlight': colors.secondary.xlight,
    '--secondary-dark': colors.secondary.dark,
    '--secondary-foreground': colors.secondary.contrast,
    
    // Muted variables
    '--muted': colors.background.accent,
    '--muted-foreground': colors.text.secondary,
    
    // Text gradient variable
    '--text-gradient': colors.text.gradient,
    
    // Accent variables
    '--accent': colors.background.accent,
    '--accent-foreground': colors.text.primary,
    
    // Destructive variables
    '--destructive': colors.status.error,
    '--destructive-foreground': colors.text.inverse,
    
    // Border and input variables
    '--border': colors.border.default,
    '--input': colors.background.accent,
    '--ring': colors.interactive.focus,
    '--radius': `${radius}rem`,
    
    // Status variables
    '--status-success': colors.status.success,
    '--status-warning': colors.status.warning,
    '--status-error': colors.status.error,
    '--status-info': colors.status.info,
    
    // Chart variables
    '--chart-1': colors.charts.chart1,
    '--chart-2': colors.charts.chart2,
    '--chart-3': colors.charts.chart3,
    '--chart-4': colors.charts.chart4,
    '--chart-5': colors.charts.chart5,
    
    // Sidebar variables
    '--sidebar': colors.sidebar.background,
    '--sidebar-foreground': colors.sidebar.foreground,
    '--sidebar-primary': colors.sidebar.primary,
    '--sidebar-primary-foreground': colors.sidebar.primaryForeground,
    '--sidebar-accent': colors.sidebar.accent,
    '--sidebar-accent-foreground': colors.sidebar.accentForeground,
    '--sidebar-border': colors.sidebar.border,
    '--sidebar-ring': colors.sidebar.ring,
    
    // Midnight variables
    '--midnight-50': colors.midnight.midnight50,
    '--midnight-100': colors.midnight.midnight100,
    '--midnight-200': colors.midnight.midnight200,
    '--midnight-300': colors.midnight.midnight300,
    '--midnight-400': colors.midnight.midnight400,
    '--midnight-500': colors.midnight.midnight500,
    '--midnight-600': colors.midnight.midnight600,
    '--midnight-700': colors.midnight.midnight700,
    '--midnight-800': colors.midnight.midnight800,
    '--midnight-900': colors.midnight.midnight900,
    '--midnight-950': colors.midnight.midnight950,
  };
}

/**
 * Validate a theme configuration
 */
export function validateTheme(theme: ThemeConfig): ThemeValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required properties
  if (!theme.name) errors.push('Theme name is required');
  if (!theme.description) errors.push('Theme description is required');
  if (!theme.colors) errors.push('Theme colors are required');
  if (!theme.cssVariables) errors.push('Theme CSS variables are required');
  if (typeof theme.radius !== 'number') errors.push('Theme radius must be a number');

  // Check colors structure
  if (theme.colors) {
    const requiredColorProps = ['primary', 'secondary', 'background', 'text', 'border', 'status', 'interactive', 'gradients', 'charts', 'sidebar'];
    requiredColorProps.forEach(prop => {
      if (!theme.colors[prop as keyof ThemeColors]) {
        errors.push(`Missing required color property: ${prop}`);
      }
    });

    // Check primary colors
    if (theme.colors.primary) {
      const primaryProps = ['main', 'light', 'dark', 'contrast'];
      primaryProps.forEach(prop => {
        if (!theme.colors.primary[prop as keyof typeof theme.colors.primary]) {
          errors.push(`Missing primary color property: ${prop}`);
        }
      });
    }

    // Check secondary colors
    if (theme.colors.secondary) {
      const secondaryProps = ['main', 'light', 'dark', 'contrast', 'xlight'];
      secondaryProps.forEach(prop => {
        if (!theme.colors.secondary[prop as keyof typeof theme.colors.secondary]) {
          errors.push(`Missing secondary color property: ${prop}`);
        }
      });
    }

    // Check background colors
    if (theme.colors.background) {
      const backgroundProps = ['default', 'paper', 'accent', 'subtle'];
      backgroundProps.forEach(prop => {
        if (!theme.colors.background[prop as keyof typeof theme.colors.background]) {
          errors.push(`Missing background color property: ${prop}`);
        }
      });
    }

    // Check text colors
    if (theme.colors.text) {
      const textProps = ['primary', 'secondary', 'muted', 'inverse', 'gradient'];
      textProps.forEach(prop => {
        if (!theme.colors.text[prop as keyof typeof theme.colors.text]) {
          errors.push(`Missing text color property: ${prop}`);
        }
      });
    }

    // Check border colors
    if (theme.colors.border) {
      const borderProps = ['default', 'subtle', 'accent'];
      borderProps.forEach(prop => {
        if (!theme.colors.border[prop as keyof typeof theme.colors.border]) {
          errors.push(`Missing border color property: ${prop}`);
        }
      });
    }

    // Check status colors
    if (theme.colors.status) {
      const statusProps = ['success', 'warning', 'error', 'info'];
      statusProps.forEach(prop => {
        if (!theme.colors.status[prop as keyof typeof theme.colors.status]) {
          errors.push(`Missing status color property: ${prop}`);
        }
      });
    }

    // Check interactive colors
    if (theme.colors.interactive) {
      const interactiveProps = ['hover', 'active', 'focus', 'disabled'];
      interactiveProps.forEach(prop => {
        if (!theme.colors.interactive[prop as keyof typeof theme.colors.interactive]) {
          errors.push(`Missing interactive color property: ${prop}`);
        }
      });
    }

    // Check gradients
    if (theme.colors.gradients) {
      const gradientProps = ['primary', 'secondary', 'background'];
      gradientProps.forEach(prop => {
        if (!theme.colors.gradients[prop as keyof typeof theme.colors.gradients]) {
          errors.push(`Missing gradient property: ${prop}`);
        } else if (!Array.isArray(theme.colors.gradients[prop as keyof typeof theme.colors.gradients])) {
          errors.push(`Gradient property ${prop} must be an array`);
        }
      });
    }

    // Check charts
    if (theme.colors.charts) {
      const chartProps = ['chart1', 'chart2', 'chart3', 'chart4', 'chart5'];
      chartProps.forEach(prop => {
        if (!theme.colors.charts[prop as keyof typeof theme.colors.charts]) {
          errors.push(`Missing chart color property: ${prop}`);
        }
      });
    }

    // Check sidebar
    if (theme.colors.sidebar) {
      const sidebarProps = ['background', 'foreground', 'primary', 'primaryForeground', 'accent', 'accentForeground', 'border', 'ring'];
      sidebarProps.forEach(prop => {
        if (!theme.colors.sidebar[prop as keyof typeof theme.colors.sidebar]) {
          errors.push(`Missing sidebar color property: ${prop}`);
        }
      });
    }

    // Check midnight
    if (theme.colors.midnight) {
      const midnightProps = ['midnight50', 'midnight100', 'midnight200', 'midnight300', 'midnight400', 'midnight500', 'midnight600', 'midnight700', 'midnight800', 'midnight900', 'midnight950'];
      midnightProps.forEach(prop => {
        if (!theme.colors.midnight[prop as keyof typeof theme.colors.midnight]) {
          errors.push(`Missing midnight color property: ${prop}`);
        }
      });
    }
  }

  // Check CSS variables
  if (theme.cssVariables) {
    const requiredCSSVars = [
      '--background', '--foreground', '--card', '--card-foreground',
      '--popover', '--popover-foreground', '--primary', '--primary-light',
      '--primary-dark', '--primary-foreground', '--secondary', '--secondary-light',
      '--secondary-xlight', '--secondary-dark', '--secondary-foreground',
      '--muted', '--muted-foreground', '--text-gradient', '--accent', '--accent-foreground',
      '--destructive', '--destructive-foreground', '--border', '--input',
      '--ring', '--radius', '--status-success', '--status-warning',
      '--status-error', '--status-info', '--chart-1', '--chart-2',
      '--chart-3', '--chart-4', '--chart-5', '--sidebar', '--sidebar-foreground',
      '--sidebar-primary', '--sidebar-primary-foreground', '--sidebar-accent',
      '--sidebar-accent-foreground', '--sidebar-border', '--sidebar-ring',
      '--midnight-50', '--midnight-100', '--midnight-200', '--midnight-300', '--midnight-400',
      '--midnight-500', '--midnight-600', '--midnight-700', '--midnight-800', '--midnight-900', '--midnight-950'
    ];

    requiredCSSVars.forEach(varName => {
      if (!theme.cssVariables[varName as keyof ThemeCSSVariables]) {
        errors.push(`Missing CSS variable: ${varName}`);
      }
    });
  }

  // Check radius value
  if (theme.radius < 0) {
    errors.push('Theme radius must be a positive number');
  }

  // Warnings
  if (theme.radius > 2) {
    warnings.push('Theme radius is quite large, consider using a smaller value');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Create a dark variant of a light theme
 */
export function createDarkVariant(lightTheme: ThemeConfig): ThemeConfig {
  const darkColors: ThemeColors = {
    primary: {
      main: lightTheme.colors.secondary.main,
      light: lightTheme.colors.secondary.light,
      dark: lightTheme.colors.secondary.dark,
      contrast: lightTheme.colors.secondary.contrast,
    },
    secondary: {
      main: lightTheme.colors.primary.main,
      light: lightTheme.colors.primary.light,
      dark: lightTheme.colors.primary.dark,
      contrast: lightTheme.colors.primary.contrast,
      xlight: lightTheme.colors.primary.light,
    },
    background: {
      default: lightTheme.colors.primary.main,
      paper: lightTheme.colors.primary.light,
      accent: lightTheme.colors.primary.dark,
      subtle: `rgba(255, 255, 255, 0.05)`,
    },
    text: {
      primary: lightTheme.colors.text.inverse,
      secondary: `rgba(255, 255, 255, 0.7)`,
      muted: `rgba(255, 255, 255, 0.5)`,
      inverse: lightTheme.colors.text.primary,
      gradient: `rgba(255, 255, 255, 0.9)`,
    },
    border: {
      default: `rgba(255, 255, 255, 0.08)`,
      subtle: `rgba(255, 255, 255, 0.04)`,
      accent: lightTheme.colors.secondary.light,
    },
    status: lightTheme.colors.status,
    interactive: {
      hover: `rgba(255, 255, 255, 0.04)`,
      active: `rgba(255, 255, 255, 0.08)`,
      focus: lightTheme.colors.secondary.light,
      disabled: `rgba(255, 255, 255, 0.2)`,
    },
    gradients: {
      primary: lightTheme.colors.gradients.primary.reverse(),
      secondary: lightTheme.colors.gradients.secondary.reverse(),
      background: lightTheme.colors.gradients.background.reverse(),
    },
    charts: lightTheme.colors.charts,
    sidebar: {
      background: lightTheme.colors.primary.dark,
      foreground: lightTheme.colors.text.inverse,
      primary: lightTheme.colors.secondary.main,
      primaryForeground: lightTheme.colors.secondary.contrast,
      accent: lightTheme.colors.primary.main,
      accentForeground: lightTheme.colors.text.inverse,
      border: `rgba(255, 255, 255, 0.08)`,
      ring: lightTheme.colors.secondary.light,
    },
    midnight: lightTheme.colors.midnight,
  };

  const darkCSSVariables = generateCSSVariables(darkColors, lightTheme.radius);

  return {
    name: `${lightTheme.name} (Dark)`,
    description: `Dark variant of ${lightTheme.name}`,
    colors: darkColors,
    cssVariables: darkCSSVariables,
    radius: lightTheme.radius,
    isDark: true,
  };
}

/**
 * Theme generator utility
 */
export const themeGenerator: ThemeGenerator = {
  generateCSSVariables,
  validateTheme,
  createDarkVariant,
};

/**
 * Apply theme CSS variables to document
 */
export function applyThemeToDocument(theme: ThemeConfig): void {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  
  // Apply CSS variables
  Object.entries(theme.cssVariables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}

/**
 * Get theme from localStorage or return default
 */
export function getStoredTheme(): string {
  if (typeof window === 'undefined') return 'green-white';
  
  const stored = localStorage.getItem('acs-theme');
  return stored || 'green-white';
}

/**
 * Store theme preference
 */
export function storeThemePreference(themeName: string): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('acs-theme', themeName);
} 