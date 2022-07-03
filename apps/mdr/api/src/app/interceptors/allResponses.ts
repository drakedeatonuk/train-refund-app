import { map } from 'rxjs/operators';
import { CallHandler, NestInterceptor, ExecutionContext, Injectable, Inject } from '@nestjs/common';
import { isResultError } from '@multi/shared';

@Injectable()
export class InterceptResults implements NestInterceptor {

  public intercept(_context: ExecutionContext, next: CallHandler) {
    // Intercept the response...
    return next.handle().pipe(
      map(res => {
        console.log(res);
        // Check if response is a Result<T>
        if ('ok' in res) {
          // Check if Result is an error, i.e. !ok
          // Then serialise it, which adds the stack trace into the `error`
          if (!res.ok && isResultError(res.error)) res.error = res.error.serialise();
        }
        return res;
      })
    );
  }
}
