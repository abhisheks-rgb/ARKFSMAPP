import {ViewStyle} from 'react-native';

export const shadows = {
  none: {} as ViewStyle,
  sm: {
    shadowColor: '#000', shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
  } as ViewStyle,
  md: {
    shadowColor: '#000', shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
  } as ViewStyle,
  lg: {
    shadowColor: '#000', shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.12, shadowRadius: 20, elevation: 6,
  } as ViewStyle,
  xl: {
    shadowColor: '#000', shadowOffset: {width: 0, height: 16},
    shadowOpacity: 0.16, shadowRadius: 32, elevation: 10,
  } as ViewStyle,
} as const;

export type ShadowKey = keyof typeof shadows;
