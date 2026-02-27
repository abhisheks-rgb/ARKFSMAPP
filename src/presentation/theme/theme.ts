import {lightColors, darkColors, ColorTheme} from './colors';
import {typography} from './typography';
import {spacing} from './spacing';
import {radii} from './radii';
import {shadows} from './shadows';

export type Theme = {
  colors:     ColorTheme;
  typography: typeof typography;
  spacing:    typeof spacing;
  radii:      typeof radii;
  shadows:    typeof shadows;
  isDark:     boolean;
};

export const lightTheme: Theme = {
  colors: lightColors, typography, spacing, radii, shadows, isDark: false,
};

export const darkTheme: Theme = {
  colors: darkColors, typography, spacing, radii, shadows, isDark: true,
};
