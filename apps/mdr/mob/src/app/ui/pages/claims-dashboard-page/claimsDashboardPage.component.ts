import { UserService } from '../../../services/user/user.service';
import { Subscription, Observable } from 'rxjs';
import { capitalize } from 'lodash';
import { Claims, Users } from '@multi/mdr';
import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ClaimService } from '../../../services/claim/claim.service';
import { Router } from '@angular/router';
import { assets } from '@multi/mdr';
@Component({
  selector: 'app-claims-dashboard-page',
  templateUrl: './claimsDashboardPage.component.html',
})
export class ClaimsDashboardPageComponent {
  assets = assets;
  capitalize: (str: string) => string = capitalize;
  chipColors = {
    pending: 'tertiary',
    approved: 'p',
    declined: 'ld',
  };

  constructor(private claimSvc: ClaimService, private router: Router, private userSvc: UserService) {
  }

  openClaim(claim: Claims.Claim) {
    this.claimSvc.claimOpened = claim;
    this.router.navigateByUrl('/claim');
  }

  selectChipColor(claimStatus: string) {
    return this.chipColors[claimStatus];
  }

}
