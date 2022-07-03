import { badRequest, err, ok, Result } from '@multi/shared';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { IProcessorDataService } from '../interfaces/iProcessorData.service';

@Injectable()
export class StripeProcessorDataService implements IProcessorDataService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_S_TEST_KEY, { apiVersion: '2020-08-27' });
  }

  public async createStripeCustomer(name: string, email: string): Promise<Result<Stripe.Customer>> {
    try {
      const customer = await this.stripe.customers.create({
        name,
        email,
      });
      return ok(customer);
    } catch (e) {
      return err(badRequest('stripe registration integration failed'));
    }
  }

  public async getStripeSetupIntent(stripeCustomerId: string): Promise<Result<Stripe.SetupIntent>> {
    try {
      return ok(
        await this.stripe.setupIntents.create({
          customer: stripeCustomerId,
          payment_method_types: ['card'],
        })
      );
    } catch (e) {
      return err(badRequest('failed to connect to stripe'));
    }
  }

  public async chargeStripeCustomer(amount: number, paymentMethodId: string, customerId: string): Promise<Result<Stripe.PaymentIntent>> {
    try {
      const charge = await this.stripe.paymentIntents.create({
        amount,
        customer: customerId,
        payment_method: paymentMethodId,
        currency: process.env.STRIPE_CURRENCY,
        confirm: true,
      });
      return ok(charge);
    } catch (e) {
      return err(badRequest('stripe payment integration failed'));
    }
  }

  public async getStripePaymentMethodData(paymentMethodId: string): Promise<Result<Stripe.PaymentMethod>> {
    try {
      const paymentData = await this.stripe.paymentMethods.retrieve(paymentMethodId);
      return ok(paymentData);
    } catch (e) {
      return err(badRequest('stripe data request failed'));
    }
  }

  public async deleteStripePaymentMethod(paymentMethodId: string): Promise<Result<void>> {
    console.log('in StripeProcessorDataService.deleteStripePaymentMethod');
    try {
      await this.stripe.paymentMethods.detach(paymentMethodId);
      return ok();
    } catch (e) {
      return err(badRequest('stripe data deletion request failed'));
    }
  }
}
