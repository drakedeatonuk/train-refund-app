import { IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class PhotoUpdateDto {

  @IsOptional()
  @IsNumberString({}, { message: 'userId: notNumber' })
  userId: number;

  @IsOptional()
  @IsString({ message: 'firebaseId: notString' })
  @MinLength(36, { message: 'journeyEndStation: shortRef' })
  @MaxLength(36, { message: 'journeyEndStation: longRef' })
  firebaseId: string;

  @IsString({ message: 'firebaseUrl: notString' })
  firebaseUrl: string;

  @IsOptional()
  @IsString({ message: 'nativeUrl: notString' })
  @IsNotEmpty({ message: 'nativeUrl: isEmpty' })
  nativeUrl: string;
};
