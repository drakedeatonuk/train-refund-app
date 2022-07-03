import { UserService } from './../user/user.service';
import { Claims, stationNames, stationShortcodes } from '@multi/mdr';
import { BAD_CONNECTION, Result, simpleDateUK, simpleTimeUK } from '@multi/shared';
import { Injectable } from '@angular/core';
import { HttpService } from '../../core/http/services/http.service';
import { concat } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class ClaimService {
  claimOpened: Claims.Claim;
  simpleDate = simpleDateUK;
  simpleTime = simpleTimeUK;

  constructor(private httpSvc: HttpService, private userSvc: UserService) {}

  async submitNewClaim(claim: Claims.NewClaim): Promise<Result<Claims.NewClaim>> {
    console.log("TEST3.1", "in submitNewClaim...");
    const claimMaker = await this.httpSvc.postOrStore<Claims.Claim>(`/api/claim/${this.userSvc.store.user.id}`, { body: claim });
    if (claimMaker.ok == false)
      // the below error is only triggered by connectivity issues.
      // http.offline.service enables us to save these requests and send them later
      if (claimMaker.error.message == BAD_CONNECTION) return this.updateClaimsStore(claim), claimMaker;
      else return claimMaker;

    return this.updateClaimsStore(claimMaker.value), claimMaker;
  }

  private async updateClaimsStore(claim: Claims.Claim | Claims.NewClaim): Promise<Result<void>> {
    console.log("TEST3.9", "in updateClaimsStore...");
    const newClaimsArr = concat(this.userSvc.store.user.claims, claim);
    return this.userSvc.store.storeUserData(newClaimsArr, 'claims');
  }

  public shortCodeToStation(value: string): string {
    return stationShortcodes[value];
  }

  public stationToShortCode(value: string): string {
    return stationNames[value];
  }
}
