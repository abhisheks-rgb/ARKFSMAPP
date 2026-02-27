/**
 * useUserProfile — fetches user profile and manages loading/error state.
 * path: src/presentation/hooks/useUserProfile.ts
 */
import {useState, useEffect, useCallback} from 'react';
import {GetUserUseCase} from '../../application/use-cases/GetUserUseCase';
import {User} from '../../domain/entities/User';
import {AppError} from '../../domain/errors/AppError';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';

const getUserUseCase = new GetUserUseCase(new UserRepository());

interface State {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export function useUserProfile(userId?: string) {
  const [state, setState] = useState<State>({
    user: null, isLoading: true, error: null,
  });

  const fetchUser = useCallback(async () => {
    setState(s => ({...s, isLoading: true, error: null}));
    try {
      const user = await getUserUseCase.execute({id: userId});
      setState({user, isLoading: false, error: null});
    } catch (err) {
      const message =
        err instanceof AppError ? err.message : 'Failed to load profile';
      setState(s => ({...s, isLoading: false, error: message}));
    }
  }, [userId]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  return {
    user:      state.user,
    isLoading: state.isLoading,
    error:     state.error,
    refetch:   fetchUser,
  };
}