import { Claim } from '.prisma/main-client';
import { Claims } from '@multi/mdr';
import { Result } from '@multi/shared';
import { Inject, Injectable } from '@nestjs/common';
import { PRISMA_CLAIMS_DATA_SERVICE } from '../constants/claims.constants';
import { IClaimsDataService } from '../interfaces/iClaimsData.service';

@Injectable()
export class ClaimsService {
  constructor(@Inject(PRISMA_CLAIMS_DATA_SERVICE) private prismaClaimsDataSvc: IClaimsDataService) {}

  async findClaims(userId: number): Promise<Result<Claims.Claim[]>> {
    return this.prismaClaimsDataSvc.findClaims(userId);
  }

  async createNewClaim(userId: number, newClaim: Claims.NewClaim): Promise<Result<Claims.Claim>> {
    return this.prismaClaimsDataSvc.createNewClaim(userId, newClaim);
  }

  async updateClaim(claimId: number, claimFields: Claims.PartialClaim): Promise<Result<Claims.Claim>> {
    return this.prismaClaimsDataSvc.updateClaim(claimId, claimFields);
  }

}
