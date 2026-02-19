import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import type { Palette } from './palettes';
import { lightPalette, darkPalette } from './palettes';

export type AppearanceMode = 'system' | 'light' | 'dark';

type ThemeContextValue = {
  colors: Palette;
  isDark: boolean;
  appearance: AppearanceMode;
  setAppearance: (mode: AppearanceMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = {
  appearance: AppearanceMode;
  onAppearanceChange: (mode: AppearanceMode) => void;
  children: React.ReactNode;
};

export function ThemeProvider({ appearance, onAppearanceChange, children }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const resolved = useMemo((): 'light' | 'dark' => {
    if (appearance === 'system') return systemScheme === 'dark' ? 'dark' : 'light';
    return appearance;
  }, [appearance, systemScheme]);
  const isDark = resolved === 'dark';
  const colors = isDark ? darkPalette : lightPalette;
  const setAppearance = useCallback(
    (mode: AppearanceMode) => onAppearanceChange(mode),
    [onAppearanceChange]
  );
  const value = useMemo<ThemeContextValue>(
    () => ({ colors, isDark, appearance, setAppearance }),
    [colors, isDark, appearance, setAppearance]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
