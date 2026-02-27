/**
 * useAuth — login / logout state for screens.
 * path: src/presentation/hooks/useAuth.ts
 */
import {useState, useCallback} from 'react';
import {LoginUseCase} from '../../application/use-cases/LoginUseCase';
import {AuthRepository} from '../../infrastructure/repositories/AuthRepository';
import {TokenStorage} from '../../shared/config/TokenStorage';
import {AppError} from '../../domain/errors/AppError';

// Wired once — no DI container needed at this scale
const loginUseCase = new LoginUseCase(new AuthRepository());

interface State {
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<State>({isLoading: false, error: null});

  const login = useCallback(
    async (identifier: string, password: string): Promise<string | null> => {
      setState({isLoading: true, error: null});
      try {
        const result = await loginUseCase.execute({identifier, password});
        setState({isLoading: false, error: null});
        return result.user_id;
      } catch (err) {
        const message =
          err instanceof AppError
            ? err.message
            : 'Login failed. Please check your credentials.';
        setState({isLoading: false, error: message});
        return null;
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    await TokenStorage.clearAll();
    setState({isLoading: false, error: null});
  }, []);

  const clearError = useCallback(() => {
    setState(s => ({...s, error: null}));
  }, []);

  return {
    isLoading: state.isLoading,
    error:     state.error,
    login,
    logout,
    clearError,
  };
}