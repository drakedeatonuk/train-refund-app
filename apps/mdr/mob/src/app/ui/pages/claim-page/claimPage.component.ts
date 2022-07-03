import { Component, OnInit } from '@angular/core';
import { ClaimService } from '../../../services/claim/claim.service';
import { Claims } from '@multi/mdr';
import { capitalize } from 'lodash';

@Component({
  selector: 'app-claim-page',
  templateUrl: './claimPage.component.html',
})
export class ClaimPageComponent implements OnInit {
  claim: Claims.Claim;
  capitalize: (str: string) => string = capitalize;

  constructor(public claimSvc: ClaimService) {}

  ngOnInit(): void {
    this.claim = this.claimSvc.claimOpened;
  }
}
