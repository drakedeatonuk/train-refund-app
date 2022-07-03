import { Claim } from '.prisma/main-client';
import { Claims } from '@multi/mdr';
import { Result, badRequest, err, ok } from '@multi/shared';
import { Inject, Injectable } from '@nestjs/common';
import { DbService } from '../../database/prisma.service';
import { NEST_LOGGER_SERVICE } from '../../logger/constants/logger.constants';
import { ILoggerService } from '../../logger/interfaces/iLogger.interface';
import { IClaimsDataService } from '../interfaces/iClaimsData.service';

@Injectable()
export class PrismaClaimsDataService implements IClaimsDataService {
  constructor(private db: DbService, @Inject(NEST_LOGGER_SERVICE) private loggerSvc: ILoggerService) {}

  allNestedClaimsFeilds = {
    photo: {
      select: {
        id: true,
        userId: true,
        firebaseId: true,
        firebaseUrl: true,
        nativeUrl: true,
      },
    },
    user: {
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        consent: true,
        emailToken: true,
        isVerified: true,
        crmContactId: true,
      },
    },
  };

  async findClaims(userId: number): Promise<Result<Claims.Claim[]>> {
    const result = await this.db.claim.findMany({
      include: this.allNestedClaimsFeilds,
      where: {
        userId: userId,
      },
    });
    return result ? ok(result) : err(badRequest('Claims not found'));
  }

  async createNewClaim(userId: number, newClaim: Claims.NewClaim): Promise<Result<Claims.Claim>> {
    try {
      const claim = await this.db.claim.create({
        data: {
          isReturn: !!!newClaim.isReturn,
          ticketPrice: newClaim.ticketPrice * 100, //converting to pence
          ticketRef: newClaim.ticketRef,
          trainDelay: newClaim.trainDelay,
          ticketType: newClaim.ticketType,
          purchaseType: newClaim.purchaseType,
          claimType: newClaim.claimType,
          journeyStartStation: newClaim.journeyStartStation,
          journeyEndStation: newClaim.journeyEndStation,
          journeyStartDateTime: newClaim.journeyStartDateTime,
          journeyEndDateTime: newClaim.journeyEndDateTime,
          claimStatus: newClaim.claimStatus,
          dateCreated: new Date(),
          photo: {
            create: {
              userId: userId,
              firebaseId: newClaim.photo.firebaseId,
              firebaseUrl: newClaim.photo?.firebaseUrl ?? '',
              nativeUrl: newClaim.photo.nativeUrl,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
        include: {
          photo: true,
          user: true,
        },
      });
      return ok(claim);
    } catch (e) {
      this.loggerSvc.log('Error creating claim ', e);
      return err(badRequest('Error creating claim'));
    }
  }

  public async updateClaim(id: number, claimFields: Claims.PartialClaim): Promise<Result<Claims.Claim>> {
    try {
      const claim = await this.db.claim.update({
        where: { id },
        data: {
          ...claimFields
        },
        include: this.allNestedClaimsFeilds,
      });
      return ok(claim);
    } catch (e) {
      this.loggerSvc.log(e);
      return err(badRequest('Error updating claim'));
    }
  }
}
