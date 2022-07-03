import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {

  handleRequest(err, user, info, context, status)  {
    if (err) {
      console.log({ err, user, info, context, status});
      return super.handleRequest(err, user, info, context, status);
    }
  }

}
