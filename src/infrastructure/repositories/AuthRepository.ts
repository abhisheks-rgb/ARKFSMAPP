/**
 * AuthRepository — concrete login/logout via HttpClient.
 * path: src/infrastructure/repositories/AuthRepository.ts
 */
import {IAuthRepository, LoginInput, AuthTokens} from '../../domain/repositories/IAuthRepository';
import {httpClient} from '../network/HttpClient';
import {API_CONFIG} from '../../shared/config/ApiConfig';

interface LoginApiResponse {
  error: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
  username: string | null;
  session_id: string | null;
}

export class AuthRepository implements IAuthRepository {
  async login(input: LoginInput): Promise<AuthTokens> {
    const res = await httpClient.post<LoginApiResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      input,
    );
    return {
      access_token:  res.access_token,
      refresh_token: res.refresh_token,
      username:      res.username,
      session_id:    res.session_id,
    };
  }

  async logout(): Promise<void> {
    try {
      await httpClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Best-effort — tokens are cleared locally regardless
    }
  }
}