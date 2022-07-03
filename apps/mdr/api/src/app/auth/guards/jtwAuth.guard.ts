import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  handleRequest(err, user, info, context, status)  {
    console.log({ err, user, info});
    return super.handleRequest(err, user, info, context, status);
  }
}
