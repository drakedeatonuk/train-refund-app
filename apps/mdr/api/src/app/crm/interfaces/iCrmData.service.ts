import { Claims, Users } from '@multi/mdr';
import { Result } from '@multi/shared';
import { Hubspot } from '../types/crm.types';

export interface ICRMDataService {
  postContact(newContact: Hubspot.NewContact): Promise<Result<Hubspot.Contact>>;
  findContact(param: Hubspot.ContactSearchParam): Promise<Result<Hubspot.Contact>>;
  updateContact(crmContactId: string, contactFields: Hubspot.PartialContact): Promise<Result<Hubspot.Contact>>;
  postClaimTicket(claim: Claims.Claim): Promise<Result<Hubspot.Ticket>>;
  findTicket(ticketId: string): Promise<Result<Hubspot.Ticket>>;
  prepNewContactData(user: Users.User): Promise<Hubspot.NewContact>;
  postNote(note: Hubspot.NewNote, associationType: Hubspot.AssociationTypes,
    toObjectType: Hubspot.ToObjectTypes, objectId: string
  ): Promise<Result<void>>;
}
