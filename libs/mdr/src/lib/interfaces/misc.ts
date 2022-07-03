import { ConnectionStatus } from '@capacitor/network';
import { Photo } from '@capacitor/camera';

export interface JwToken {
  access_token: string;
}

export interface Customer {
  id?: number;
  userId: number;
  customerBillingId: string;
  paymentMethods?: PaymentMethod[];
}

export interface NewCustomer {
  userId: number;
  customerBillingId: string;
}

export interface PaymentMethod {
  id?: number;
  customerId: number;
  paymentMethodId: string;
  maskedCardNumber: string;
}

export interface SetupIntent {
  setupIntent: string;
  ephemeralKey: string;
  customer: string;
}
