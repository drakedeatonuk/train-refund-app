import { Injectable } from '@angular/core';
import { Result, badRequest, err, ok } from '@multi/shared';
import { Users } from '@multi/mdr';
import { Observable, firstValueFrom } from 'rxjs';
import { StripeElements, StripeElementsOptions, SetupIntent, StripeError } from '@stripe/stripe-js';
import Stripe from 'stripe';
import { StripeService } from 'ngx-stripe';
import { UserService } from './../user/user.service';
import { HttpService } from '../../core/http/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ProcessorService {
  constructor(private httpSvc: HttpService, private stripeSvc: StripeService, private userSvc: UserService) {}

  async initSetupIntent(): Promise<Result<SetupIntent>> {
    return this.httpSvc.post<Result<SetupIntent>>('/api/setup-intent', {
      body: { userId: this.userSvc.store.user.id }
    });
  }

  async createCustomer(): Promise<Result<Users.User>> {
    return await this.httpSvc.post<Result<Users.User>>('/api/create-customer', {
      body: { userId: this.userSvc.store.user.id }
    });
  }

  async getSetupIntent(): Promise<Result<Stripe.SetupIntent>> {
    return this.httpSvc.get<Result<Stripe.SetupIntent>>(`/api/setup-intent/${this.userSvc.store.user.id}/`);
  }

  async savePaymentMethodDetails(paymentMethodId: string): Promise<Result<void>> {
    return this.httpSvc.put<Result<void>>(`/api/customer/save/payment-method`, {
      body: {
        customerId: this.userSvc.store.user.customer.id,
        paymentMethodId: paymentMethodId,
      }
    });
  }

  async deleteCurrentPaymentMethod(): Promise<Result<void>> {
    return this.httpSvc.post<Result<void>>(`/api/customer/delete/payment-method`, {
      body: {
        id: this.userSvc.store.user.customer.paymentMethods[0].id,
        paymentMethodId: this.userSvc.store.user.customer.paymentMethods[0].paymentMethodId,
        customerBillingId: this.userSvc.store.user.customer.customerBillingId,
      }
    })
  }

  async sendStripeSetupIntent(elements: StripeElements): Promise<Result<{ setupIntent?: SetupIntent; error?: StripeError }>> {
    try {
      const setupIntentRes = await firstValueFrom(
        this.stripeSvc.confirmSetup({
          elements: elements,
          redirect: 'if_required',
        })
      );
      if (setupIntentRes.setupIntent.status !== 'succeeded') return err(badRequest('Error sending card details to stripe'));
      return ok(setupIntentRes);
    } catch (e) {
      console.log(e);
      return err(badRequest('Error sending card details to stripe'));
    }
  }

  async generateElements(options: StripeElementsOptions): Promise<Observable<StripeElements>> {
    return this.stripeSvc.elements(options);
  }
}
