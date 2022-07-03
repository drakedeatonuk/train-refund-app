import { Equals, IsEmail, IsNotEmpty, IsOptional, Length, Matches, MaxLength } from "class-validator";

export class PartialUserDto {

  @IsOptional()
  @IsNotEmpty({message: "noFirstName"})
  @Length(1, 40, {message: "invalidFirstNameLength"})
  @Matches(/^[a-zA-Z]*$/, {message: "invalidFirstNameChars"})
  firstName: string;

  @IsOptional()
  @IsNotEmpty({message: "noLastName"})
  @Length(1, 40, {message: "invalidLastNameLength"})
  @Matches(/^[a-zA-Z]*$/, {message: "invalidLastNameChars"})
  lastName: string;

  @IsOptional()
  @IsNotEmpty({message: "noEmail"})
  @IsEmail({}, {message: "invalidEmail"})
  email: string;

  @Equals(undefined) // passwords shouldn't be updated through this Dto
  password: string;

  @IsOptional()
  @Equals(true, {message: "noConsent"})
  consent: boolean;

}
