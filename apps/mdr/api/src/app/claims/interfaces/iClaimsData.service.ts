import { Result } from '@multi/shared';
import { Claims } from '@multi/mdr';

export interface IClaimsDataService {

  findClaims(userId: number): Promise<Result<Claims.Claim[]>>;
  createNewClaim(userId: number, newClaim: Claims.NewClaim): Promise<Result<Claims.Claim>>;
  updateClaim(claimId: number, claimFields: Claims.PartialClaim): Promise<Result<Claims.Claim>>;

}
