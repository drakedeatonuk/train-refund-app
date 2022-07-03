import { User } from '.prisma/main-client';
import { Customer, Users } from '@multi/mdr';
import { Result } from '@multi/shared';

export interface IUsersDataService {
  findUser(arg: string | number): Promise<Result<Users.User>>;
  isUser(arg: string | number): Promise<boolean>;
  createNewUser(newUser: Users.NewUser): Promise<Result<Users.User>>;
  verifyNewUser(token: string): Promise<boolean>;
  updatePassword(id: number, password: string): Promise<Result<User>>;
  updateUser(id: number, userFields: Users.PartialUser): Promise<Result<Users.User>>;
  createNewCustomer(customer: Customer): Promise<Result<void>>;
  createNewPaymentMethod(customerId: string, paymentMethodId: string, last4: string): Promise<Result<void>>;
  deleteCustomerPaymentMethod(id: number): Promise<Result<void>>;
}
