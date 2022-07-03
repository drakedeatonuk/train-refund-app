import { err, ResultError, badRequest } from '@multi/shared';
import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, Inject  } from '@nestjs/common';
import { Response } from 'express';

@Catch() //BadRequestException
export class AllExceptionsFilter implements ExceptionFilter {

  public catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    console.log(response);
    console.error(exception);
    if (exception instanceof ResultError) {
      return response.status(500).json(exception.serialise()) //response.status(500).json();
    } else if (exception instanceof BadRequestException) {
      return response.status(500).json({
        name: exception.name,
        message: exception.getResponse()['message'],
        stack: exception.stack,
      })
    } else if (exception instanceof Error) {
      return response.status(500).json({
        name: exception.name,
        message: exception.message,
        stack: exception.stack,
      });
    } else {
      console.error(exception);
    }
  }
}
