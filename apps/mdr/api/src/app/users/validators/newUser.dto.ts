import { NewAddressDto } from '../../addresses/validators/newAddress.dto';
import { Equals, IsDefined, isDefined, IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, Length, Matches, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { EmailTaken } from './emailCheck';

export class NewUserDto {

  @IsDefined()
  @IsNotEmpty({message: "noFirstName"})
  @Length(1, 40, {message: "invalidFirstNameLength"})
  @Matches(/^[a-zA-Z]*$/, {message: "invalidFirstNameChars"})
  firstName: string;

  @IsDefined()
  @IsNotEmpty({message: "noLastName"})
  @Length(1, 40, {message: "invalidLastNameLength"})
  @Matches(/^[a-zA-Z]*$/, {message: "invalidLastNameChars"})
  lastName: string;

  @EmailTaken({message: "emailTaken"})
  @IsNotEmpty({message: "noEmail"})
  @IsEmail({}, {message: "invalidEmail"})
  email: string;

  @IsDefined()
  @IsNotEmpty({message: "noPassword"})
  @MinLength(6, {message: "shortPassword"})
  @MaxLength(50, {message: "longPassword"})
  password: string;

  @Equals(true, {message: "noConsent"})
  consent: boolean;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested() //@Equals(NewUserDto)
  address: NewAddressDto
}
