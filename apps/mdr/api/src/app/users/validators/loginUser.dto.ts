import { IsEmail, IsNotEmpty, Length, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {

  @IsNotEmpty({message: "noEmail"})
  @IsEmail({}, {message: "invalidEmail"})
  email: string;

  @IsNotEmpty({message: "noPassword"})
  @Length(6, 50)
  @MinLength(6, {message: "shortPassword"})
  @MaxLength(50, {message: "longPassword"})
  password: string;

}
