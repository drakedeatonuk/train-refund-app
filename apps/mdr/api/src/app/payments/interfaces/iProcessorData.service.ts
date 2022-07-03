import { Result } from '@multi/shared';
import Stripe from 'stripe';

export interface IProcessorDataService {
  createStripeCustomer(name: string, email: string): Promise<Result<Stripe.Customer>>;
  chargeStripeCustomer(amount: number, paymentMethodId: string, customerId: string): Promise<Result<Stripe.PaymentIntent>>;
  getStripePaymentMethodData(paymentMethodId: string): Promise<Result<Stripe.PaymentMethod>>;
  deleteStripePaymentMethod(paymentMethodId: string): Promise<Result<void>>;
  getStripeSetupIntent(stripeCustomerId: string): Promise<Result<Stripe.SetupIntent>>;
}
