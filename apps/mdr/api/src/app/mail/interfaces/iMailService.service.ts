import { Users, Claims } from '@multi/mdr';
import { Result } from '@multi/shared';
import { Request } from 'express';

export interface IMailService {
  sendVerificationEmail(req: Request, user: Users.NewUser): Promise<Result<void>>;
  sendResetPasswordEmail(user: Users.User, link: string): Promise<Result<void>>;
  sendClaimSubmissionEmail(user: Users.User, claim: Claims.Claim): Promise<Result<void>>;
}
