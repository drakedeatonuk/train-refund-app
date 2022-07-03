export namespace Addresses {

  export interface Address {
    id?: number;
    userId: number;
    address1: string;
    address2: string;
    city: string;
    postcode: string;
  }

  export type PartialAddress = Partial<Address>;

}
