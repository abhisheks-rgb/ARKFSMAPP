/**
 * App.tsx — root entry point
 * path: App.tsx  (project root)
 */
import React from 'react';
import {ThemeProvider} from './src/presentation/theme';
import AppNavigator from './src/presentation/navigation/AppNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}