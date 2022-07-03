import { Addresses } from "@multi/mdr";
import { Result } from "@multi/shared";

export interface IAddressesDataService {
  updateAddress(id: number, addressFields: Addresses.PartialAddress): Promise<Result<Addresses.Address>>;
};
