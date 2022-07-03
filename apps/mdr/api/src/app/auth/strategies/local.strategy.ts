import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthService } from '../interfaces/iAuth.interface';
import { JWT_AUTH_SERVICE } from '../constants/auth.constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(JWT_AUTH_SERVICE) private authSvc: IAuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<boolean> {
    const isValidUser = await this.authSvc.validateUser(email, password);
    if (!isValidUser) throw new UnauthorizedException();
    return true;
  }
}
