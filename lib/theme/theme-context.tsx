'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ThemeContextType } from '@/types/theme';
import { 
  getThemeConfig, 
  getThemeNames, 
  getThemeDisplayNames,
  defaultTheme 
} from './theme-config';
import { 
  applyThemeToDocument, 
  getStoredTheme, 
  storeThemePreference 
} from './theme-utils';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: string;
}

export function ThemeProvider({ children, initialTheme = defaultTheme }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<string>(initialTheme);
  const [isDark, setIsDark] = useState<boolean>(false);
  const themeConfig = getThemeConfig(currentTheme);
  const availableThemes = getThemeDisplayNames();

  // Apply theme CSS variables to document
  const applyTheme = (themeName: string) => {
    const config = getThemeConfig(themeName);
    applyThemeToDocument(config);
    setIsDark(config.isDark || false);
    
    // Store theme preference
    storeThemePreference(themeName);
  };

  // Set theme and apply it
  const setTheme = (themeName: string) => {
    if (getThemeNames().includes(themeName)) {
      setCurrentTheme(themeName);
      applyTheme(themeName);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const currentConfig = getThemeConfig(currentTheme);
    const isCurrentlyDark = currentConfig.isDark || false;
    
    if (isCurrentlyDark) {
      // Switch to light variant
      const lightThemeName = currentTheme.replace('dark-', '');
      setTheme(lightThemeName);
    } else {
      // Switch to dark variant
      const darkThemeName = `dark-${currentTheme}`;
      if (getThemeNames().includes(darkThemeName)) {
        setTheme(darkThemeName);
      }
    }
  };

  // Initialize theme on mount
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = getStoredTheme();
    if (savedTheme && getThemeNames().includes(savedTheme)) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme(currentTheme);
    }
  }, []);

  // Apply theme when currentTheme changes
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  const value: ThemeContextType = {
    currentTheme,
    themeConfig,
    availableThemes,
    setTheme,
    applyTheme,
    isDark,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
} 