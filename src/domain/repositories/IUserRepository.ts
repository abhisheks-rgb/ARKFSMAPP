/**
 * IUserRepository — user data contract.
 * path: src/domain/repositories/IUserRepository.ts
 */
import {User} from '../entities/User';

export interface IUserRepository {
  getUserById(id: string): Promise<User>;
  getCurrentUser(): Promise<User>;
}