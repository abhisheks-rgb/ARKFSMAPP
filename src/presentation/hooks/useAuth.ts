/**
 * useAuth — login / logout state for the UI layer.
 * path: src/presentation/hooks/useAuth.ts
 *
 * No JWT decoding. No userId in UI state.
 * AppNavigator uses isLoggedIn (boolean) only.
 * Profile is loaded via getCurrentUser() which uses the Bearer token.
 */
import {useState, useCallback} from 'react';
import axios from 'axios';
import {TokenStorage} from '../../shared/config/TokenStorage';

const API_BASE = 'http://3.226.123.91:4002/api/v1';

interface LoginApiResponse {
  error:         boolean;
  message:       string;
  access_token:  string;
  refresh_token: string;
  username:      string | null;
  session_id:    string | null;
  user_id?:      string | null; // backend should add this eventually
}

async function callLogin(
  identifier: string,
  password: string,
): Promise<LoginApiResponse> {
  const response = await axios.post<LoginApiResponse>(
    `${API_BASE}/login`,
    {
      user_name:     identifier.trim(),
      user_password: password,
      device_id:     'react_native_app',
      device_token:  '',
    },
    {headers: {'Content-Type': 'application/json'}},
  );
  const data = response.data;
  if (data.error) throw new Error(data.message ?? 'Login failed');
  return data;
}

interface AuthState {
  isLoading:  boolean;
  error:      string | null;
  isLoggedIn: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isLoading:  false,
    error:      null,
    isLoggedIn: false,
  });

  const login = useCallback(
    async (identifier: string, password: string): Promise<boolean> => {
      setState(s => ({...s, isLoading: true, error: null}));
      try {
        const data = await callLogin(identifier, password);

        // Save tokens — we do NOT save userId here because we don't
        // have a reliable ID yet. getCurrentUser() uses Bearer token instead.
        await TokenStorage.saveTokens({
          access_token:  data.access_token,
          refresh_token: data.refresh_token,
        });

        setState({isLoading: false, error: null, isLoggedIn: true});
        return true;
      } catch (err: any) {
        const message =
          err?.response?.data?.message ??
          err?.message                 ??
          'Login failed. Please try again.';
        setState({isLoading: false, error: message, isLoggedIn: false});
        return false;
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    await TokenStorage.clearAll();
    setState({isLoading: false, error: null, isLoggedIn: false});
  }, []);

  const clearError = useCallback(() => {
    setState(s => ({...s, error: null}));
  }, []);

  return {
    isLoading:  state.isLoading,
    error:      state.error,
    isLoggedIn: state.isLoggedIn,
    login,
    logout,
    clearError,
  };
}