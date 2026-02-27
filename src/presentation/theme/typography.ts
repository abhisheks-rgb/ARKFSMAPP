import {TextStyle} from 'react-native';

/**
 * Typography scale.
 * ─────────────────────────────────────────────────────────
 * HOW TO USE A CUSTOM FONT:
 *   1. Add your font files to ios/ and android/
 *   2. Run: npx react-native-asset  (after installing react-native-asset)
 *   3. Set BASE_FONT / BOLD_FONT below to your font family names
 */
const BASE_FONT  = undefined; // e.g. 'Inter-Regular'
const BOLD_FONT  = undefined; // e.g. 'Inter-Bold'
const MONO_FONT  = 'Menlo';

export const typography = {
  // Display
  displayLg: { fontSize: 48, fontWeight: '900', lineHeight: 56, fontFamily: BOLD_FONT } as TextStyle,
  displayMd: { fontSize: 36, fontWeight: '800', lineHeight: 44, fontFamily: BOLD_FONT } as TextStyle,

  // Headings
  h1: { fontSize: 30, fontWeight: '800', lineHeight: 38, fontFamily: BOLD_FONT } as TextStyle,
  h2: { fontSize: 24, fontWeight: '700', lineHeight: 32, fontFamily: BOLD_FONT } as TextStyle,
  h3: { fontSize: 20, fontWeight: '700', lineHeight: 28, fontFamily: BOLD_FONT } as TextStyle,
  h4: { fontSize: 18, fontWeight: '600', lineHeight: 26, fontFamily: BOLD_FONT } as TextStyle,

  // Body
  bodyLg: { fontSize: 18, fontWeight: '400', lineHeight: 28, fontFamily: BASE_FONT } as TextStyle,
  body:   { fontSize: 16, fontWeight: '400', lineHeight: 24, fontFamily: BASE_FONT } as TextStyle,
  bodySm: { fontSize: 14, fontWeight: '400', lineHeight: 22, fontFamily: BASE_FONT } as TextStyle,

  // UI elements
  label:    { fontSize: 14, fontWeight: '600', lineHeight: 20, fontFamily: BOLD_FONT } as TextStyle,
  labelSm:  { fontSize: 12, fontWeight: '600', lineHeight: 18, letterSpacing: 0.5, fontFamily: BOLD_FONT } as TextStyle,
  caption:  { fontSize: 12, fontWeight: '400', lineHeight: 18, fontFamily: BASE_FONT } as TextStyle,
  overline: { fontSize: 11, fontWeight: '700', lineHeight: 16, letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: BOLD_FONT } as TextStyle,
  button:   { fontSize: 16, fontWeight: '700', lineHeight: 24, letterSpacing: 0.3, fontFamily: BOLD_FONT } as TextStyle,
  buttonSm: { fontSize: 14, fontWeight: '600', lineHeight: 20, fontFamily: BOLD_FONT } as TextStyle,

  // Monospace
  code: { fontSize: 14, fontFamily: MONO_FONT, lineHeight: 22 } as TextStyle,
} as const;

export type TypographyKey = keyof typeof typography;
