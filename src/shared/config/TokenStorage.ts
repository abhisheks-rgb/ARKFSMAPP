/**
 * TokenStorage — persists auth tokens.
 * path: src/shared/config/TokenStorage.ts
 *
 * Stores access + refresh tokens only.
 * user_id is NOT stored — profile is fetched via Bearer token.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const K = {
  ACCESS:  '@auth/access_token',
  REFRESH: '@auth/refresh_token',
} as const;

export const TokenStorage = {
  async saveTokens(p: {access_token: string; refresh_token: string}) {
    await Promise.all([
      AsyncStorage.setItem(K.ACCESS,  p.access_token),
      AsyncStorage.setItem(K.REFRESH, p.refresh_token),
    ]);
  },

  getAccessToken():  Promise<string | null> { return AsyncStorage.getItem(K.ACCESS);  },
  getRefreshToken(): Promise<string | null> { return AsyncStorage.getItem(K.REFRESH); },

  async clearAll() {
    await Promise.all([
      AsyncStorage.removeItem(K.ACCESS),
      AsyncStorage.removeItem(K.REFRESH),
    ]);
  },
};