import { Claims, Users } from '@multi/mdr';
import { Result } from '@multi/shared';
import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { SEND_GRID_MAIL_SERVICE } from '../constants/mail.constants';
import { IMailService } from '../interfaces/iMailService.service';

@Injectable()
export class MailService {
  constructor(@Inject(SEND_GRID_MAIL_SERVICE) private sendGridEmailDataSvc: IMailService) {}

  sendClaimSubmissionEmail(user: Users.User, claim: Claims.Claim): Promise<Result<void>> {
    return this.sendGridEmailDataSvc.sendClaimSubmissionEmail(user, claim);
  }

  sendVerificationEmail(req: Request, user: Users.User) {
    return this.sendGridEmailDataSvc.sendVerificationEmail(req, user);
  }
}
