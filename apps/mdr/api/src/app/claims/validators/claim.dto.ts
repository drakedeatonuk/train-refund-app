import { ClaimStatus, ClaimType, PurchaseType, TicketType } from '.prisma/main-client';
import { Claims } from '@multi/mdr';
import { IsBoolean, IsBooleanString, IsDate, IsDateString, IsEnum, IsNumber, IsNumberString, IsOptional, IsUrl, Matches, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class ClaimDto {

  @IsOptional()
  @IsNumberString({}, {message: "id: notNumber"})
  id: number;

  @IsOptional()
  @IsNumberString({}, {message: "customerId: notNumber"})
  userId: number;

  @IsOptional()
  @IsEnum(TicketType, {message: "ticketType: invalidTyicketTypeValue"})
  ticketType: TicketType;

  @IsOptional()
  @IsEnum({empty: '', ...PurchaseType}, {message: "purchaseType: invalidPurchaseTypeValue"})
  purchaseType: PurchaseType;

  @IsOptional()
  @IsBooleanString({ message: 'isReturn: notBoolean' })
  isReturn: boolean;

  @IsOptional()
  @Matches(/^[0-9]*$|^[0-9]*[.][0-9]{1,2}/, {message: "ticketPrice: invalidCurrency"})
  @MaxLength(10, {message: "longPrice"})
  ticketPrice: number;

  @IsOptional()
  @MinLength(8, {message: "ticketRef: shortRef"})
  @MaxLength(11, {message: "ticketRef: longRef"})
  ticketRef: string

  @ValidateIf((claim: Claims.Claim) => claim.claimType == ClaimType.cancelledTrain && claim.trainDelay == "")
  @IsNumber({}, {message: "trainDelay: notNumber"})
  @MinLength(2, {message: "trainDelay: shortRef"})
  @MaxLength(3, {message: "trainDelay: longRef"})
  trainDelay: string;

  @IsOptional()
  @IsEnum(ClaimType, {message: "claimType: invalidClaimTypeValue"})
  claimType: ClaimType;

  @IsOptional()
  @MinLength(3, {message: "journeyStartStation: shortRef"})
  @MaxLength(3, {message: "journeyStartStation: longRef"})
  @Matches(/^[A-Z]{3}$/, {message: "journeyStartStation: invalidValue"})
  journeyStartStation: string;

  @IsOptional()
  @MinLength(3, {message: "journeyEndStation: shortRef"})
  @MaxLength(3, {message: "journeyEndStation: longRef"})
  @Matches(/^[A-Z]{3}$/, {message: "journeyEndStation: invalidValue"})
  journeyEndStation: string;

  @IsOptional()
  @IsDateString({message: 'journeyStartDateTime: notDate'})
  journeyStartDateTime: Date;

  @IsOptional()
  @IsDateString({message: 'journeyEndDateTime: notDate'})
  journeyEndDateTime: Date;

  @IsOptional()
  @IsEnum(ClaimStatus, {message: "claimStatus: invalidValue"})
  claimStatus: ClaimStatus;

  @IsOptional()
  @IsDateString({message: 'dateCreated: notDate'})
  dateCreated: Date;

}



