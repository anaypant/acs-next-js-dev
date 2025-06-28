/**
 * Simplified Theme Provider
 * Uses the simple theme system for easy theme switching
 */

"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SimpleTheme, greenTheme, blueTheme, applyTheme } from './simple-theme';

interface ThemeContextType {
  currentTheme: SimpleTheme;
  setTheme: (theme: SimpleTheme) => void;
  switchToGreen: () => void;
  switchToBlue: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function SimpleThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<SimpleTheme>(greenTheme);

  // Apply theme to document when it changes
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  const setTheme = (theme: SimpleTheme) => {
    setCurrentTheme(theme);
  };

  const switchToGreen = () => setTheme(greenTheme);
  const switchToBlue = () => setTheme(blueTheme);

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      setTheme,
      switchToGreen,
      switchToBlue,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useSimpleTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useSimpleTheme must be used within SimpleThemeProvider');
  }
  return context;
} 