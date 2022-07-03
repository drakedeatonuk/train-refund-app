import { Addresses } from '@multi/mdr';
import { badRequest, err, ok, Result } from '@multi/shared';
import { Inject } from '@nestjs/common';
import { DbService } from '../../database/prisma.service';
import { NEST_LOGGER_SERVICE } from '../../logger/constants/logger.constants';
import { ILoggerService } from '../../logger/interfaces/iLogger.interface';
import { IAddressesDataService } from '../interfaces/iAddressesData.service';

export class PrismaAddressesDataService implements IAddressesDataService {
  constructor(private db: DbService, @Inject(NEST_LOGGER_SERVICE) private loggerSvc: ILoggerService) {}

  async updateAddress(id: number, addressFields: Addresses.PartialAddress): Promise<Result<Addresses.Address>> {
    try {
      const address: Addresses.Address = await this.db.address.update({
        where: { id },
        data: { ...addressFields },
      });
      return ok(address);
    } catch (e) {
      this.loggerSvc.log(e);
      return err(badRequest('Error updating address'));
    }
  }
}
