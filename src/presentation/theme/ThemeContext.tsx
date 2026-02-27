import React, {
  createContext, useCallback, useContext, useMemo, useState,
} from 'react';
import {useColorScheme} from 'react-native';
import {Theme, lightTheme, darkTheme} from './theme';

export type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  theme:       Theme;
  mode:        ThemeMode;
  setMode:     (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({children}: {children: React.ReactNode}) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  const resolvedTheme = useMemo<Theme>(() => {
    if (mode === 'system') return systemScheme === 'dark' ? darkTheme : lightTheme;
    return mode === 'dark' ? darkTheme : lightTheme;
  }, [mode, systemScheme]);

  const toggleTheme = useCallback(() => {
    setMode(prev => {
      if (prev === 'system') return resolvedTheme.isDark ? 'light' : 'dark';
      return prev === 'dark' ? 'light' : 'dark';
    });
  }, [resolvedTheme.isDark]);

  const value = useMemo<ThemeContextValue>(
    () => ({theme: resolvedTheme, mode, setMode, toggleTheme}),
    [resolvedTheme, mode, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Primary hook — use anywhere in your app:
 *
 *   const { theme, toggleTheme } = useTheme();
 *
 *   <View style={{ backgroundColor: theme.colors.background }}>
 *   <Text style={[theme.typography.h2, { color: theme.colors.text.primary }]}>
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
