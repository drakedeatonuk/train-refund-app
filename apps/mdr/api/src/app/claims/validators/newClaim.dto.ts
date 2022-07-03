import { ClaimStatus, ClaimType, PurchaseType, TicketType } from '.prisma/main-client';
import { IsBooleanString, IsDate, IsDateString, IsEnum, IsNumber, IsNumberString, IsOptional, IsUrl, Matches, MaxLength, MinLength, ValidateIf, IsNotEmpty, ValidateNested, IsDefined, IsNotEmptyObject, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { NewPhotoDto } from '../../photos/validators/newPhoto.dto';
import { Claims } from '@multi/mdr';

export class NewClaimDto {

  @IsNotEmpty({ message: 'userId: isEmpty' })
  @IsNumber({}, { message: 'userId: notNumber' })
  userId: number;

  @IsEnum(TicketType, { message: 'ticketType: invalidTicketTypeValue' })
  ticketType: TicketType;

  @IsEnum({ empty: null, ...PurchaseType }, { message: 'purchaseType: invalidPurchaseTypeValue' })
  purchaseType: PurchaseType;

  @IsNotEmpty({ message: 'isReturn: isEmpty' })
  @IsBooleanString({ message: 'isReturn: notBoolean' })
  isReturn: boolean;

  @IsNotEmpty({ message: 'ticketPrice: isEmpty' })
  @Matches(/^[0-9]*$|^[0-9]*[.][0-9]{1,2}/, { message: 'ticketPrice: invalidCurrency' })
  @MaxLength(10, { message: 'longPrice' })
  ticketPrice: number;

  @MinLength(8, { message: 'ticketRef: shortRef' })
  @MaxLength(11, { message: 'ticketRef: longRef' })
  ticketRef: string;

  @ValidateIf((claim: Claims.Claim) => claim.claimType == ClaimType.cancelledTrain && claim.trainDelay == "")
  @IsNumberString({}, { message: 'trainDelay: notNumber' })
  @MinLength(2, { message: 'trainDelay: shortRef' })
  @MaxLength(3, { message: 'trainDelay: longRef' })
  trainDelay: string;

  @IsEnum(ClaimType, { message: 'claimType: invalidClaimTypeValue' })
  claimType: ClaimType;

  @MinLength(3, { message: 'journeyStartStation: shortRef' })
  @MaxLength(3, { message: 'journeyStartStation: longRef' })
  @Matches(/^[A-Z]{3}$/, { message: 'journeyStartStation: invalidValue' })
  journeyStartStation: string;

  @MinLength(3, { message: 'journeyEndStation: shortRef' })
  @MaxLength(3, { message: 'journeyEndStation: longRef' })
  @Matches(/^[A-Z]{3}$/, { message: 'journeyEndStation: invalidValue' })
  journeyEndStation: string;

  @IsNotEmpty({ message: 'journeyStartDateTime: isEmpty' })
  @IsDateString({message: 'journeyStartDateTime: notDate'})
  journeyStartDateTime: Date;

  @IsNotEmpty({ message: 'journeyEndDateTime: isEmpty' })
  @IsDateString({message: 'journeyEndDateTime: notDate'})
  journeyEndDateTime: Date;

  @IsEnum(ClaimStatus, { message: 'claimStatus: invalidValue' })
  claimStatus: ClaimStatus;

  @IsNotEmpty({ message: 'dateCreated: notString' })
  @IsDateString({message: 'dateCreated: notDate'})
  dateCreated: Date;

  @IsDefined({message: 'photo: notDefined'})
  @IsNotEmptyObject({nullable: false}, {message: 'photo: isEmptyObject'})
  @IsObject({message: 'photo: isNotObject'})
  @ValidateNested({ each: true })
  @Type(() => NewPhotoDto)
  photo: NewPhotoDto;
}
