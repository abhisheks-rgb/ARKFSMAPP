/**
 * GetUserUseCase — fetches user by ID or current user.
 * path: src/application/use-cases/GetUserUseCase.ts
 */
import {IUseCase} from '../ports/IUseCase';
import {IUserRepository} from '../../domain/repositories/IUserRepository';
import {User} from '../../domain/entities/User';

export interface GetUserInput {
  id?: string;
}

export class GetUserUseCase implements IUseCase<GetUserInput, User> {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(input: GetUserInput): Promise<User> {
    if (input.id) return this.userRepo.getUserById(input.id);
    return this.userRepo.getCurrentUser();
  }
}