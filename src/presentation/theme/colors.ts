/**
 * Global color palette.
 * ─────────────────────────────────────────────────────────
 * HOW TO CUSTOMIZE:
 *   1. Change palette values below to match your brand
 *   2. Remap lightColors / darkColors tokens as needed
 *   3. Every component using useTheme() picks up changes instantly
 */

const palette = {
  // Brand blues — swap these for your brand color
  blue50:  '#eff6ff',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  blue700: '#1d4ed8',

  // Neutrals
  white:   '#ffffff',
  grey50:  '#f8f9fa',
  grey100: '#f1f3f5',
  grey200: '#e9ecef',
  grey300: '#dee2e6',
  grey400: '#ced4da',
  grey500: '#adb5bd',
  grey600: '#6c757d',
  grey700: '#495057',
  grey800: '#343a40',
  grey900: '#212529',
  black:   '#000000',

  // Semantic
  green500: '#22c55e',
  green600: '#16a34a',
  red500:   '#ef4444',
  red600:   '#dc2626',
  amber500: '#f59e0b',
  amber600: '#d97706',
} as const;

export type ColorTheme = {
  primary:      string;
  primaryHover: string;
  primaryLight: string;
  secondary:    string;
  background:   string;
  surface:      string;
  surfaceAlt:   string;
  text: {
    primary:   string;
    secondary: string;
    disabled:  string;
    inverse:   string;
    link:      string;
  };
  border:       string;
  borderFocus:  string;
  divider:      string;
  status: {
    success:    string;
    successBg:  string;
    error:      string;
    errorBg:    string;
    warning:    string;
    warningBg:  string;
    info:       string;
    infoBg:     string;
  };
  shadow: string;
};

export const lightColors: ColorTheme = {
  // Brand
  primary:      palette.blue600,
  primaryHover: palette.blue700,
  primaryLight: palette.blue50,
  secondary:    palette.grey600,

  // Surfaces
  background:   palette.grey50,
  surface:      palette.white,
  surfaceAlt:   palette.grey100,

  // Text
  text: {
    primary:   palette.grey900,
    secondary: palette.grey600,
    disabled:  palette.grey400,
    inverse:   palette.white,
    link:      palette.blue600,
  },

  // Borders
  border:       palette.grey200,
  borderFocus:  palette.blue500,
  divider:      palette.grey100,

  // Status
  status: {
    success:    palette.green600,
    successBg:  '#f0fdf4',
    error:      palette.red600,
    errorBg:    '#fef2f2',
    warning:    palette.amber600,
    warningBg:  '#fffbeb',
    info:       palette.blue600,
    infoBg:     palette.blue50,
  },

  shadow: palette.black,
};

export const darkColors: ColorTheme = {
  primary:      palette.blue500,
  primaryHover: palette.blue600,
  primaryLight: '#1e3a5f',
  secondary:    palette.grey400,

  background:   '#0f1117',
  surface:      '#1a1d27',
  surfaceAlt:   '#22263a',

  text: {
    primary:   palette.grey50,
    secondary: palette.grey400,
    disabled:  palette.grey600,
    inverse:   palette.grey900,
    link:      palette.blue500,
  },

  border:       '#2d3748',
  borderFocus:  palette.blue500,
  divider:      '#1e2432',

  status: {
    success:    palette.green500,
    successBg:  '#052e16',
    error:      palette.red500,
    errorBg:    '#450a0a',
    warning:    palette.amber500,
    warningBg:  '#422006',
    info:       palette.blue500,
    infoBg:     '#1e3a5f',
  },

  shadow: palette.black,
} as const;
