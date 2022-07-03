import { Addresses, Claims, Users } from '@multi/mdr';
import { Result } from '@multi/shared';
import { Inject, Injectable } from '@nestjs/common';
import { HUBSPOT_CRM_DATA_SERVICE } from '../constants/crm.constants';
import { ICRMDataService } from '../interfaces/iCrmData.service';
import { generateUpdateContactNote } from '../templates/crm.templates';
import { Hubspot } from '../types/crm.types';
import { HubspotCrmDataService } from './hubspotCrmData.service';

@Injectable()
export class CRMService {
  constructor(@Inject(HUBSPOT_CRM_DATA_SERVICE) private crmDataService: ICRMDataService) {}

  public async postNewContact(newContact: Hubspot.NewContact): Promise<Result<Hubspot.Contact>> {
    return this.crmDataService.postContact(newContact);
  }

  public async prepNewContactData(user: Users.User): Promise<Hubspot.NewContact> {
    return this.crmDataService.prepNewContactData(user);
  }

  public async findContact(param: Hubspot.ContactSearchParam): Promise<Result<Hubspot.Contact>> {
    return this.crmDataService.findContact(param);
  }

  public async createOrUpdateContact(user: Users.User): Promise<Result<Hubspot.Contact>> {
    const contactData = await this.prepNewContactData(user);

    const contactFinder = await this.findContact({ email: user.email });
    if (contactFinder.ok == false)
      return await this.postNewContact(contactData);

    else if (contactFinder.ok == true) {
      const contactUpdator = await this.updateContact(contactFinder.value.id, contactData);
      if (contactUpdator.ok == false) return contactUpdator;

      const updateContactNote: Hubspot.NewNote = generateUpdateContactNote(contactFinder.value, contactUpdator.value);

      const contactNoter = await this.postNote(updateContactNote, 'note_to_contact', 'contact', contactFinder.value.id);
      if (contactNoter.ok == false) return contactUpdator;
      else return contactUpdator;
    };
  }

  public async prepUpdateContactData(fields: Users.PartialUser & Addresses.PartialAddress): Promise<Hubspot.PartialContact> {
    return {
      // for User.PartialUser fields
      ...(fields?.email && {email: fields.email}),
      ...(fields?.lastName && { lastname: fields.lastName }),
      ...(fields?.firstName && { firstname: fields.firstName }),

      // for Addresses.PartialAddress fields
      ...(fields?.address1 && {address: `${[fields.address1, fields.address2, fields.city, fields.postcode].filter(i => i).join(', ')}`}),
    }
  }

  public async updateContact(crmContactId: string, contactFields: Hubspot.PartialContact): Promise<Result<Hubspot.Contact>> {
    return this.crmDataService.updateContact(crmContactId, contactFields);
  }

  public async findTicket(ticketId: string): Promise<Result<Hubspot.Ticket>> {
    return this.crmDataService.findTicket(ticketId);
  }

  public async postClaimTicket(claim: Claims.Claim): Promise<Result<Hubspot.Ticket>> {
    return this.crmDataService.postClaimTicket(claim);
  }

  public async postNote(note: Hubspot.NewNote, associationType: Hubspot.AssociationTypes,
    toObjectType: Hubspot.ToObjectTypes, objectId: string
  ): Promise<Result<void>> {
    return this.crmDataService.postNote(note, associationType, toObjectType, objectId);
  }
}
