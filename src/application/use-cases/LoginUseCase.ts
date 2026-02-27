/**
 * LoginUseCase — validates input, calls repo, persists tokens.
 * path: src/application/use-cases/LoginUseCase.ts
 */
import {IUseCase} from '../ports/IUseCase';
import {IAuthRepository} from '../../domain/repositories/IAuthRepository';
import {AuthTokens} from '../../domain/repositories/IAuthRepository';
import {TokenStorage} from '../../shared/config/TokenStorage';
import {AppError} from '../../domain/errors/AppError';

export interface LoginInput {
  /** Can be username, email, or phone */
  identifier: string;
  password: string;
  device_id?: string;
  device_token?: string;
}

export type LoginOutput = AuthTokens & {user_id: string};

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
    const segment = token.split('.')[1];
    const json = decodeURIComponent(
      base64Decode(segment)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(json).id as string;
  } catch {
    throw AppError.unknown('Could not decode token');
  }
}

export class LoginUseCase implements IUseCase<LoginInput, LoginOutput> {
  constructor(private readonly authRepo: IAuthRepository) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    if (!input.identifier?.trim()) throw AppError.validation('Username, email or phone is required');
    if (!input.password?.trim())   throw AppError.validation('Password is required');
    if (input.password.length < 6) throw AppError.validation('Password must be at least 6 characters');

    const tokens = await this.authRepo.login({
      user_name:     input.identifier.trim(),
      user_password: input.password,
      device_id:     input.device_id    ?? 'react_native_app',
      device_token:  input.device_token ?? '',
    });

    const user_id = decodeJwtUserId(tokens.access_token);

    await TokenStorage.saveTokens({
      access_token:  tokens.access_token,
      refresh_token: tokens.refresh_token,
      user_id,
    });

    return {...tokens, user_id};
  }
}