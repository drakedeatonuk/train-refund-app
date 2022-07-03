import { capitalize } from 'lodash';
import { Users, NewCustomer } from '@multi/mdr';
import { badRequest, err, ok, Result } from '@multi/shared';
import { Inject, Injectable } from '@nestjs/common';
import { DbService } from '../../database/prisma.service';
import { IUsersDataService } from '../interfaces/iUsersData.service';
import * as crypto from 'crypto';
import { NEST_LOGGER_SERVICE } from '../../logger/constants/logger.constants';
import { ILoggerService } from '../../logger/interfaces/iLogger.interface';
import { User } from '.prisma/main-client';

@Injectable()
export class PrismaUsersDataService implements IUsersDataService {
  constructor(private db: DbService, @Inject(NEST_LOGGER_SERVICE) private loggerSvc: ILoggerService) {}

  private allNestedUserFeilds = {
    customer: {
      select: {
        id: true,
        userId: true,
        customerBillingId: true,
        paymentMethods: {
          select: {
            id: true,
            customerId: true,
            paymentMethodId: true,
            maskedCardNumber: true,
          },
        },
      },
    },
    claims: {
      select: {
        id: true,
        userId: true,
        ticketType: true,
        purchaseType: true,
        isReturn: true,
        ticketPrice: true,
        ticketPicId: true,
        ticketRef: true,
        trainDelay: true,
        claimType: true,
        journeyStartStation: true,
        journeyEndStation: true,
        journeyStartDateTime: true,
        journeyEndDateTime: true,
        claimStatus: true,
        dateCreated: true,
        photo: {
          select: {
            id: true,
            userId: true,
            firebaseId: true,
            firebaseUrl: true,
            nativeUrl: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            password: true,
            firstName: true,
            lastName: true,
            consent: true,
            emailToken: true,
            isVerified: true,
            crmContactId: true,
          },
        },
      },
    },
    address: true,
  };

  async findUser(arg: string | number): Promise<Result<Users.User>> {
    const result = (await this.db.user.findFirst({
      include: this.allNestedUserFeilds,
      where: {
        OR: [typeof arg == 'number' ? { id: arg } : { email: arg }],
      },
    })) as Users.User;
    return result ? ok(result) : err(badRequest('User not found'));
  }

  async isUser(arg: string | number): Promise<boolean> {
    const result = await this.db.user.findFirst({
      where: {
        OR: [typeof arg == 'number' ? { id: arg } : { email: arg }],
      },
      include: this.allNestedUserFeilds,
    });
    return result ? true : false;
  }

  async createNewUser(newUser: Users.NewUser): Promise<Result<Users.User>> {
    try {
      return ok(
        await this.db.user.create({
          data: {
            firstName: capitalize(newUser.firstName),
            lastName: capitalize(newUser.lastName),
            email: newUser.email,
            password: crypto.pbkdf2Sync(newUser.password, process.env.JWT_SECRET, 10000, 64, 'SHA1').toString('base64'),
            consent: newUser.consent,
            emailToken: newUser.emailToken,
            isVerified: false,
            address: {
              create: {
                address1: newUser.address.address1,
                address2: newUser.address.address2,
                city: newUser.address.city,
                postcode: newUser.address.postcode,
              },
            },
          },
          include: this.allNestedUserFeilds,
        })
      );
    } catch (e) {
      this.loggerSvc.log('Error creating user ', e);
      return err(badRequest('Error creating user'));
    }
  }

  async verifyNewUser(token: string): Promise<boolean> {
    try {
      const verifiedUser: User = await this.db.user.findFirst({
        where: {
          emailToken: token,
        },
        include: this.allNestedUserFeilds,
      });
      await this.db.user.update({
        where: {
          id: verifiedUser.id,
        },
        data: {
          emailToken: '',
          isVerified: true,
        },
      });
    } catch (e) {
      this.loggerSvc.log(e);
      return false;
    }
    this.loggerSvc.log("✅ User's email verified!");
    return true;
  }

  async updatePassword(id: number, password: string): Promise<Result<User>> {
    try {
      return ok(
        await this.db.user.update({
          where: { id },
          data: {
            password: crypto.pbkdf2Sync(password, process.env.JWT_SECRET, 10000, 64, 'SHA1').toString('base64'),
          },
          include: this.allNestedUserFeilds,
        })
      );
    } catch (e) {
      this.loggerSvc.log(e);
      return err(badRequest('Error updating password'));
    }
  }

  async updateUser(id: number, userFields: Users.PartialUser): Promise<Result<Users.User>> {
    console.log(id);
    console.log(userFields);
    try {
      const user = await this.db.user.update({
        where: { id },
        data: { ...userFields },
        include: this.allNestedUserFeilds,
      });
      console.log(user);
      return ok(user);
    } catch (e) {
      this.loggerSvc.log(e);
      return err(badRequest('Error updating user'));
    }
  }

  async createNewCustomer(customer: NewCustomer): Promise<Result<void>> {
    try {
      await this.db.customer.create({
        data: { ...customer },
      });
      return ok();
    } catch (e) {
      this.loggerSvc.log(e);
      return err(badRequest('Error creating customer'));
    }
  }

  async createNewPaymentMethod(customerId: string, paymentMethodId: string, last4: string): Promise<Result<void>> {
    try {
      await this.db.paymentMethods.create({
        data: {
          customerId: parseInt(customerId),
          paymentMethodId: paymentMethodId,
          maskedCardNumber: last4,
        },
      });
      return ok();
    } catch (e) {
      this.loggerSvc.log(e);
      return err(badRequest('Error creating user payment method'));
    }
  }

  async deleteCustomerPaymentMethod(id: number): Promise<Result<void>> {
    try {
      await this.db.paymentMethods.delete({
        where: { id },
      });
      return ok();
    } catch (e) {
      this.loggerSvc.log(e);
      return err(badRequest('Error deleting stripe payment method'));
    }
  }
}
