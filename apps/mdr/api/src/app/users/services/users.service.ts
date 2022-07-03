import { Inject, Injectable } from '@nestjs/common';
import { Result } from '@multi/shared';
import { Users, Customer } from '@multi/mdr';
import { PRISMA_USERS_DATA_SERVICE } from '../constants/users.constants';
import { IUsersDataService } from '../interfaces/iUsersData.service';
import { User } from '.prisma/main-client';
@Injectable()
export class UsersService {
  constructor(@Inject(PRISMA_USERS_DATA_SERVICE) private prismaUsersDataService: IUsersDataService) {}

  async findUser(arg: string | number): Promise<Result<Users.User>> {
    return this.prismaUsersDataService.findUser(arg);
  }

  async isUser(arg: string | number): Promise<boolean> {
    return this.prismaUsersDataService.isUser(arg);
  }

  async createNewUser(user: Users.NewUser): Promise<Result<Users.User>> {
    return this.prismaUsersDataService.createNewUser(user);
  }

  async createNewCustomer(customer: Customer): Promise<Result<void>> {
    return this.prismaUsersDataService.createNewCustomer(customer);
  }

  async verifyNewUser(token: string): Promise<boolean> {
    return this.prismaUsersDataService.verifyNewUser(token);
  }

  async updatePassword(id: number, password: string): Promise<Result<User>> {
    return this.prismaUsersDataService.updatePassword(id, password);
  }

  async updateUser(id: number, userFields: Users.PartialUser): Promise<Result<Users.User>> { //TODO: create a type with no objects, Users.PartialUser
    return this.prismaUsersDataService.updateUser(id, userFields);
  }

  // async updateUserPersonalDetails(userPersonalDetails: Users.PersonalDetails) { //TODO : Promise<Result<Users.User>>
  //   // if (userPersonalDetails.firstName || userPersonalDetails.lastName)
  //   return this.prismaUsersDataService.updateUser(userPersonalDetails.id, userPersonalDetails);
  // }

  async createNewPaymentMethod(customerId: string, paymentMethodId: string, last4: string): Promise<Result<void>> {
    return this.prismaUsersDataService.createNewPaymentMethod(customerId, paymentMethodId, last4);
  }

  async deletePaymentMethod(id: number): Promise<Result<void>> {
    return this.prismaUsersDataService.deleteCustomerPaymentMethod(id);
  }
}
