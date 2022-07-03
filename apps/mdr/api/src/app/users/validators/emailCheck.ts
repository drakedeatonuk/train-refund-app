import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UsersService } from '../services/users.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class EmailTakenConstraint implements ValidatorConstraintInterface {
  constructor(private usersSvc: UsersService) {}

  async validate(email: string): Promise<boolean> {
    const userLookup = await this.usersSvc.findUser(email);
    console.log(userLookup.ok);
    return !userLookup.ok;
  }
}

export function EmailTaken(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: EmailTakenConstraint,
    });
  };
}
