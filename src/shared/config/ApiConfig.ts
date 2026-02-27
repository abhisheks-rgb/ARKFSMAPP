/**
 * ApiConfig — all API endpoints in one place.
 * path: src/shared/config/ApiConfig.ts
 *
 * To switch environments, change ACTIVE_ENV below.
 */
const ENV = {
  DEV:  'http://3.226.123.91:4002',
  TEST: 'https://test-api.yourcompany.com',
  UAT:  'https://uat-api.yourcompany.com',
  PROD: 'https://api.yourcompany.com',
} as const;

const ACTIVE_ENV: keyof typeof ENV = 'DEV';

export const API_CONFIG = {
  BASE_URL: ENV[ACTIVE_ENV],
  VERSION:  '/api/v1',

  get API_BASE() { return `${this.BASE_URL}${this.VERSION}`; },

  TIMEOUT: 30_000,

  ENDPOINTS: {
    AUTH: {
      LOGIN:  '/login',
      LOGOUT: '/logout',
    },
    USER: {
      GET_BY_ID: '/user',  // ?id=<uuid>
      ME:        '/user/me',
    },
  },

  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'accept':       'application/json',
  },
} as const;