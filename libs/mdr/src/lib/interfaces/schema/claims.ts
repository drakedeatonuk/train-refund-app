import { TicketType, PurchaseType, ClaimType, ClaimStatus, Photo, User } from '.prisma/main-client';
import { RecursivePartial } from '@multi/shared';
import { Photos } from './photos';
export namespace Claims {

  export interface Claim {
    id?: number;
    userId?: number;
    ticketType: TicketType;
    purchaseType?: PurchaseType;
    isReturn: boolean;
    ticketPrice: number;
    ticketPicId: number;
    ticketRef: string;
    trainDelay: string;
    claimType: ClaimType;
    journeyStartStation: string;
    journeyEndStation: string;
    journeyStartDateTime: Date;
    journeyEndDateTime: Date;
    claimStatus: ClaimStatus;
    dateCreated: Date;
    crmTicketId?: number;
    photo: Photo;
    user: User
  }

  export type NewClaim = Omit<Claim, 'id' | 'ticketPicId' | 'user' | 'photo' | 'crmTicketId'>
    & { photo: Photos.NewPhoto; };

  export type AnyClaim = Claim | NewClaim;

  export type PartialClaim = Partial<Omit<Claim, 'user' | 'photo'>>;

}
