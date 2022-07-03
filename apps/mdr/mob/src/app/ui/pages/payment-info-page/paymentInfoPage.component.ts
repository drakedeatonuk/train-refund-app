import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-payment-info-page',
  templateUrl: './paymentInfoPage.component.html',
})
export class PaymentInfoPageComponent implements OnInit {
  maskedCardNumber: string | null;

  constructor(private userSvc: UserService) {}

  ngOnInit(): void {
    this.userSvc.store.user$.subscribe(user => (this.maskedCardNumber = user.customer.paymentMethods?.[0]?.maskedCardNumber));
  }
}
