import { Injectable, Logger } from '@nestjs/common';
import { ILoggerService } from '../interfaces/iLogger.interface';

@Injectable()
export class NestLoggerService implements ILoggerService {

  constructor() { }

  log(...args: string[]) {
    Logger.log(args);
  }
}
