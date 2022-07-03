import { Users } from '@multi/mdr';
import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class StaticService {
  async renderErrorTemplate(
    user: Users.User | null,
    err: 'updateFailed' | 'noUser' | 'invalidToken' | 'miscError',
    res: Response
  ): Promise<void> {
    return res.render('reset-password-error', {
      email: user ? user.email : null,
      err: err,
    });
  }

  async renderResetPasswordTemplate(user: Users.User, token: string, res: Response): Promise<void> {
    return res.render('reset-password', {
      email: user.email,
      link: `http://localhost:3333/api/reset-password/${user.id}/${token}`,
    });
  }
}
