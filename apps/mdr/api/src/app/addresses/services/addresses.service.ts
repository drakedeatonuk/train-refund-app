import { Addresses } from '@multi/mdr';
import { Result } from '@multi/shared';
import { Inject, Injectable } from '@nestjs/common';
import { PRISMA_ADDRESSES_DATA_SERVICE } from '../constants/addresses.constants';
import { IAddressesDataService } from '../interfaces/iAddressesData.service';

@Injectable()
export class AddressesService {
  constructor(@Inject(PRISMA_ADDRESSES_DATA_SERVICE) private prismaAddressesDataSvc: IAddressesDataService) {}

  async updateAddress(id: number, addressFields: Addresses.PartialAddress): Promise<Result<Addresses.Address>> {
    return this.prismaAddressesDataSvc.updateAddress(id, addressFields);
  }
}
