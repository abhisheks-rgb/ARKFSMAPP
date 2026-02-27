/**
 * IAuthRepository — authentication contract.
 * path: src/domain/repositories/IAuthRepository.ts
 */
export interface LoginInput {
  user_name: string;
  user_password: string;
  device_id: string;
  device_token: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  username: string | null;
  session_id: string | null;
}

export interface IAuthRepository {
  login(input: LoginInput): Promise<AuthTokens>;
  logout(): Promise<void>;
}