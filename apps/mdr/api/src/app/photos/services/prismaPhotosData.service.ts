import { Photo } from '.prisma/main-client';
import { badRequest, ok, Result, err } from "@multi/shared";
import { Inject, Injectable } from '@nestjs/common';
import { DbService } from '../../database/prisma.service';
import { NEST_LOGGER_SERVICE } from '../../logger/constants/logger.constants';
import { ILoggerService } from '../../logger/interfaces/iLogger.interface';
import { IPhotosDataService } from "../interfaces/iPhotosData.service";

@Injectable()
export class PrismaPhotosDataService implements IPhotosDataService {

  constructor(private db: DbService, @Inject(NEST_LOGGER_SERVICE) private loggerSvc: ILoggerService) {}

  async updateClaimPhotoFirebaseUrl(firebaseId: string, firebaseUrl: string): Promise<Result<Photo>> {
    try {
      return ok(await this.db.photo.update({
        where: {
          firebaseId: firebaseId,
        },
        data: {
          firebaseUrl: firebaseUrl,
        },
      }));
    } catch (e) {
      this.loggerSvc.log('Error creating claim');
      return err(badRequest('Error creating claim'));
    }
  }

}
