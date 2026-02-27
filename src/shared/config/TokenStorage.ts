/**
 * TokenStorage — persists auth tokens.
 * path: src/shared/config/TokenStorage.ts
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const K = {
  ACCESS:  '@auth/access_token',
  REFRESH: '@auth/refresh_token',
  USER_ID: '@auth/user_id',
} as const;

export const TokenStorage = {
  async saveTokens(p: {access_token: string; refresh_token: string; user_id: string}) {
    await Promise.all([
      AsyncStorage.setItem(K.ACCESS,  p.access_token),
      AsyncStorage.setItem(K.REFRESH, p.refresh_token),
      AsyncStorage.setItem(K.USER_ID, p.user_id),
    ]);
  },

  getAccessToken():  Promise<string | null> { return AsyncStorage.getItem(K.ACCESS);  },
  getRefreshToken(): Promise<string | null> { return AsyncStorage.getItem(K.REFRESH); },
  getUserId():       Promise<string | null> { return AsyncStorage.getItem(K.USER_ID); },

  async clearAll() {
    await Promise.all([
      AsyncStorage.removeItem(K.ACCESS),
      AsyncStorage.removeItem(K.REFRESH),
      AsyncStorage.removeItem(K.USER_ID),
    ]);
  },
};