import { User as PrismaUser } from '.prisma/main-client';
import { Claims, Customer } from '@multi/mdr';
import { RecursivePartial } from '@multi/shared';
import { Addresses } from './addresses';

export namespace Users {
  export interface User {
    id?: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    consent: boolean;
    emailToken?: string;
    isVerified?: boolean;
    customer: Customer;
    claims: Claims.Claim[];
    address: Addresses.Address;
    crmContactId?: number | null;
  }

  export type NewUser = RecursivePartial<
    Pick<User, 'email' | 'firstName' | 'lastName' | 'password' | 'consent' | 'emailToken' | 'address' | 'crmContactId'>
  >;

  export type BaseUser = Omit<User, 'address' | 'claims' | 'customer'>;

  export type LoginUser = Pick<User, 'email' | 'password'>;

  export type PersonalDetails = RecursivePartial<Pick<User, 'email' | 'firstName' | 'lastName' | 'address'>>;

  export type PartialUser = RecursivePartial<User>;

  export interface LoginData {
    jwToken: string;
    user: User;
  }
}
