import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { Users } from '@multi/mdr';
import { ok, Result, badRequest, err, ResultError } from '@multi/shared';
import { IAuthService } from '../interfaces/iAuth.interface';
import { SEND_GRID_MAIL_SERVICE } from '../../mail/constants/mail.constants';
import { IMailService } from '../../mail/interfaces/iMailService.service';
import { NEST_LOGGER_SERVICE } from '../../logger/constants/logger.constants';
import { ILoggerService } from '../../logger/interfaces/iLogger.interface';
import { ProcessorService } from '../../payments/services/processor.service';
import * as crypto from 'crypto';
import { Request } from 'express';
import { CRMService } from '../../crm/services/crm.service';

@Injectable()
export class JwtAuthService implements IAuthService {
  constructor(
    @Inject(SEND_GRID_MAIL_SERVICE) private mailSvc: IMailService,
    @Inject(NEST_LOGGER_SERVICE) private loggerSvc: ILoggerService,
    private processorSvc: ProcessorService,
    private usersSvc: UsersService,
    private jwtSvc: JwtService,
    private crmSvc: CRMService
  ) {}

  async validateUser(email: string, password: string): Promise<boolean> {
    const userLookup = await this.usersSvc.findUser(email);
    if (userLookup.ok == false) return false;

    return (
      userLookup.ok &&
      crypto.pbkdf2Sync(password, process.env.JWT_SECRET, 10000, 64, 'SHA1').toString('base64') === userLookup?.value.password
    );
  }

  async register(req: Request, user: Users.NewUser): Promise<Result<Users.User>> {
    this.loggerSvc.log(`🏗️ creating new user...`);

    user.emailToken = crypto.randomBytes(48).toString('hex');
    const userCreation = await this.usersSvc.createNewUser(user);
    if (userCreation.ok == false) return userCreation;

    return ok(userCreation.value);
  }

  async authenticate(email: string): Promise<string> {
    return this.jwtSvc.sign({email: email});
  }

  async initResetPasswordEmail(user: Users.User): Promise<Result<void>> {
    const payload = {
      email: user.email,
      id: user.id,
    };
    let token = this.jwtSvc.sign(payload, {
      secret: process.env.JWT_SECRET + user.password,
      expiresIn: '60m',
    });
    const link = `http://localhost:3333/api/reset-password/${user.id}/${token}`;
    const emailUser = await this.mailSvc.sendResetPasswordEmail(user, link);
    if (!emailUser.ok) return emailUser;

    return ok();
  }

  async isValidToken(user: Users.User, token: string): Promise<boolean> {
    try {
      this.jwtSvc.verify<Users.LoginData>(token, {
        secret: process.env.JWT_SECRET + user.password,
      });
      return true;
    } catch (e) {
      return false;
    }
  }
}
