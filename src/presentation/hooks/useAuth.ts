/**
 * useAuth — login / logout state for the UI layer.
 * path: src/presentation/hooks/useAuth.ts
 */
import {useState, useCallback} from 'react';
import {AppError} from '../../domain/errors/AppError';

// ── Inline repository + use-case (no separate files needed for now) ──────────
import axios from 'axios';
import { TokenStorage } from '../../shared/config/TokenStorage';

const API_BASE = 'http://3.226.123.91:4002/api/v1';
function base64Decode(str: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  const input = str.replace(/-/g, '+').replace(/_/g, '/');
  let i = 0;
  while (i < input.length) {
    const e1 = chars.indexOf(input[i++]);
    const e2 = chars.indexOf(input[i++]);
    const e3 = chars.indexOf(input[i++]);
    const e4 = chars.indexOf(input[i++]);
    output += String.fromCharCode((e1 << 2) | (e2 >> 4));
    if (e3 !== 64) output += String.fromCharCode(((e2 & 15) << 4) | (e3 >> 2));
    if (e4 !== 64) output += String.fromCharCode(((e3 & 3)  << 6) | e4);
  }
  return output;
}

function decodeJwtUserId(token: string): string {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(base64Decode(payload));
    return decoded.id as string;
  } catch {
    throw new Error('Invalid token received');
  }
}

async function callLogin(identifier: string, password: string) {
  const response = await axios.post(
    `${API_BASE}/login`,
    {
      user_name:     identifier.trim(),
      user_password: password,
      device_id:     'samsung_SM-A715F_qcom_TP1A.220624.014',
      device_token:  'efKbOQx7TD6qcGgihiS_VO:APA91bHY7AmPPT6YuiYUYmz1Cec7MtXK-vvgkoBvbfKCpDNDufOHlmvfSe4BLwW4Da9YL33UvWBxScKeMAMlphrfU9XD8YBHFId1tahy6wRotfyIct_4KUE',
    },
    {headers: {'Content-Type': 'application/json'}},
  );
  return response.data as {
    access_token: string;
    refresh_token: string;
    username: string | null;
  };
}

// ─────────────────────────────────────────────────────────────

interface AuthState {
  isLoading: boolean;
  error: string | null;
  userId: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isLoading: false,
    error: null,
    userId: null,
  });

  const login = useCallback(
    async (identifier: string, password: string): Promise<string | null> => {
      setState(s => ({...s, isLoading: true, error: null}));
      try {
        const data = await callLogin(identifier, password);
        const userId = decodeJwtUserId(data.access_token);
        await TokenStorage.saveTokens({
          access_token:  data.access_token,
          refresh_token: data.refresh_token,
          user_id:       userId,
        });
        setState({isLoading: false, error: null, userId});
        return userId;
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Login failed. Please try again.';
        setState({isLoading: false, error: message, userId: null});
        return null;
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    await TokenStorage.clearAll();
    setState({isLoading: false, error: null, userId: null});
  }, []);

  const clearError = useCallback(() => {
    setState(s => ({...s, error: null}));
  }, []);

  return {
    isLoading: state.isLoading,
    error:     state.error,
    userId:    state.userId,
    login,
    logout,
    clearError,
  };
}