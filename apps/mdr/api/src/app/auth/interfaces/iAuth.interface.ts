import { Users } from '@multi/mdr';
import { Result } from '@multi/shared';
import { Request } from 'express';

export interface IAuthService {
  validateUser(email: string, password: string): Promise<boolean>;
  register(req: Request, user: Users.NewUser): Promise<Result<Users.User>>;
  authenticate(email: string): Promise<string>;
  initResetPasswordEmail(user: Users.User): Promise<Result<void>>;
  isValidToken(user: Users.User, token: string): Promise<boolean>;
}
