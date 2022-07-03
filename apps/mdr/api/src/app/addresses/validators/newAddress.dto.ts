import { IsInt, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class NewAddressDto {

  @IsInt()
  userId: number;

  @IsString({message: "notString"})
  @MaxLength(100)
  address1: string;

  @IsOptional()
  @IsString({message: "notString"})
  @MaxLength(100)
  address2: string;

  @IsString({message: "notString"})
  @Matches(/^[a-z- A-Z]*$/, {message: "invalidValue"})
  @MinLength(2, {message: "tooShort"})
  @MaxLength(60, {message: "tooLong"})
  city: string;

  @MinLength(6)
  @MaxLength(12)
  @Matches(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/, {message: "invalidValue"})
  postcode: string;

}
