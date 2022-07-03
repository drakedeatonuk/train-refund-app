import { Users } from '@multi/mdr';
import { ok, Result } from '@multi/shared';
import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { STRIPE_PROCESSOR_SERVICE } from '../constants/payments.constants';
import { IProcessorDataService } from '../interfaces/iProcessorData.service';
import { StripeProcessorDataService } from './stripeProcessorData.service';

@Injectable()
export class ProcessorService {
  constructor(@Inject(STRIPE_PROCESSOR_SERVICE) private stripeSvc: IProcessorDataService) {}

  async createCustomer(user: Users.User): Promise<Result<{ stripeCustomerId: string }>> {
    const name = `${user.firstName} ${user.lastName}`;
    const customerMaker = await this.stripeSvc.createStripeCustomer(name, user.email);
    if (customerMaker.ok == false) return customerMaker;

    return ok({
      stripeCustomerId: customerMaker.value.id,
    });
  }

  async getSetupIntent(stripeCustomerId: string): Promise<Result<Stripe.SetupIntent>> {
    return this.stripeSvc.getStripeSetupIntent(stripeCustomerId);
  }

  async chargeCustomer(amount: number, paymentMethodId: string, customerId: string): Promise<Result<Stripe.PaymentIntent>> {
    return this.stripeSvc.chargeStripeCustomer(amount, paymentMethodId, customerId);
  }

  async getPaymentMethodData(paymentMethodId: string): Promise<Result<Stripe.PaymentMethod>> {
    return this.stripeSvc.getStripePaymentMethodData(paymentMethodId);
  }

  async deletePaymentMethod(paymentMethodId: string, customerBillingId: string): Promise<Result<void>> {
    return this.stripeSvc.deleteStripePaymentMethod(paymentMethodId);
  }
}
