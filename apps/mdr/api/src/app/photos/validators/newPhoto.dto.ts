import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class NewPhotoDto {

  @IsNumber({}, { message: 'userId: notNumber' })
  userId: number;

  @IsString({ message: 'firebaseId: notString' })
  @MinLength(36, { message: 'firebaseId: shortRef' })
  @MaxLength(36, { message: 'firebaseId: longRef' })
  firebaseId: string;

  @IsOptional()
  @IsString({ message: 'firebaseUrl: notString' })
  firebaseUrl: string | null;

  @IsString({ message: 'nativeUrl: notString' })
  @IsNotEmpty({ message: 'nativeUrl: isEmpty' })
  nativeUrl: string;
};
