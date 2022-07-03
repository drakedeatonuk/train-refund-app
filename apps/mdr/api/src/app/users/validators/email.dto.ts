import { IsEmail, IsNotEmpty } from "class-validator";

export class EmailDto {

  @IsNotEmpty({message: "noEmail"})
  @IsEmail({}, {message: "invalidEmail"})
  email: string;

}
