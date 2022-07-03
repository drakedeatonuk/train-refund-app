import { capitalize } from 'lodash';
import { ICRMDataService } from './../interfaces/iCrmData.service';
import { Client } from "@hubspot/api-client";
import { Claims, Users } from '@multi/mdr';
import { ok, Result, err, badRequest, print } from '@multi/shared';
import { PublicObjectSearchRequest, SimplePublicObjectInput } from '@hubspot/api-client/lib/codegen/crm/contacts';
import { ILoggerService } from '../../logger/interfaces/iLogger.interface';
import { NEST_LOGGER_SERVICE } from '../../logger/constants/logger.constants';
import { Inject, Injectable } from '@nestjs/common';
import { Hubspot } from '../types/crm.types';
import { generateClaimTicketNote } from '../templates/crm.templates';
import { delay } from '@multi/shared';

@Injectable()
export class HubspotCrmDataService implements ICRMDataService {

  private hubspotSvc: Client;

  constructor(@Inject(NEST_LOGGER_SERVICE) private loggerSvc: ILoggerService,){
    this.hubspotSvc = new Client({ apiKey: process.env.HUBSPOT_API_KEY });
  }

  public async postContact(newContact: Hubspot.NewContact): Promise<Result<Hubspot.Contact>> {
    try {
      const contact: SimplePublicObjectInput = {
          properties: newContact,
      };
      return ok(await this.hubspotSvc.crm.contacts.basicApi.create(contact) as Hubspot.Contact);
    } catch (e) {
      this.loggerSvc.log('Error creating contact', e);
      return err(badRequest('Error creating contact'));
    };
  }

  async postNote(note: Hubspot.NewNote, associationType: Hubspot.AssociationTypes, toObjectType: Hubspot.ToObjectTypes, objectId: string): Promise<Result<void>> {
    try {
      const noteMaker = await this.hubspotSvc.crm.objects.notes.basicApi.create({properties: note});
      const noteAssociator = await this.hubspotSvc.crm.objects.notes.associationsApi.create(noteMaker.id, toObjectType, objectId, associationType);
      return ok();
    } catch (e) {
      this.loggerSvc.log(`Error adding ${associationType}`, e);
      return err(badRequest('Adding note failed'));
    }
  }

  public async findContact(param: Hubspot.ContactSearchParam): Promise<Result<Hubspot.Contact>> {
    const contactSearchQuery: PublicObjectSearchRequest = {
      filterGroups: [{
        filters: [{
          propertyName: Hubspot.ContactSearchDict[Object.keys(param)[0]],
          operator:"EQ",
          value: Object.values(param)[0],
        }],
      }],
      sorts: ["email"],
      properties: ["firstname", "lastname", "email", "address", "lastmodifieddate", "hs_object_id", "createdate", "jobtitle", "mdruserid", "hs_all_contact_vids", "hs_email_domain", 'hs_is_contact', 'hs_is_unworked', 'hs_pipeline'],
      limit: 2,
      after: 0,
    };
    try {
      const contactSearch = await this.hubspotSvc.crm.contacts.searchApi.doSearch(contactSearchQuery);
      if (contactSearch.results.length == 0) return err(badRequest('No contacts found'));
      if (contactSearch.results.length > 1) return err(badRequest('Too many contacts found'));

      return ok(contactSearch.results[0] as Hubspot.Contact)
    } catch (e) {
      this.loggerSvc.log('Error finding contact', e);
      return err(badRequest('Error finding ticket'));
    };
  }

  public async updateContact(crmContactId: string, contactFields: Hubspot.PartialContact): Promise<Result<Hubspot.Contact>> {
    try {
    const data: SimplePublicObjectInput = {
        properties: contactFields,
    };
    return ok(await this.hubspotSvc.crm.contacts.basicApi.update(crmContactId, data) as Hubspot.Contact);
    } catch (e) {
      this.loggerSvc.log('Error updating contact', e);
      return err(badRequest('Error updating contact'));
    };
  }

  public async findTicket(ticketId: string): Promise<Result<Hubspot.Ticket>> {
    const ticketSearchQuery: PublicObjectSearchRequest = {
      filterGroups: [{
        filters: [{
          propertyName: 'hs_ticket_id',
          operator:"EQ",
          value: ticketId,
        }],
      }],
      sorts: ["createdate"],
      properties: ['subject', 'content', 'mdrclaimid', 'hs_pipeline_stage', 'hs_ticket_category', 'createdate', 'hs_all_owner_id', 'hs_lastmodifieddate', 'hs_object_id', 'hs_pipeline', 'hs_ticket_id', 'hs_ticket_priority', 'hs_user_ids_of_all_owner', 'hubspot_owner_assigneddate', 'hubspot_owner_id'],
      limit: 2,
      after: 0,
    };
    try {
      const ticketSearch = await this.hubspotSvc.crm.tickets.searchApi.doSearch(ticketSearchQuery);
      if (ticketSearch.results.length == 0) return err(badRequest('No tickets found'));
      if (ticketSearch.results.length > 1) return err(badRequest('Too many tickets found'));

      return ok(ticketSearch.results[0] as Hubspot.Ticket)
    } catch (e) {
    this.loggerSvc.log('Error finding ticket', e);
    return err(badRequest('Error finding ticket'));
    };
  }

  public async postClaimTicket(claim: Claims.Claim): Promise<Result<Hubspot.Ticket>> {
    try {
    const contact = await this.findContact({mdrUserId: claim.userId});
    if (contact.ok == false) return contact;

    const data: SimplePublicObjectInput = {
        properties: {
          'hubspot_owner_id': process.env.HUBSPOT_ACCOUNT_ID,
          'hs_ticket_category': 'CLAIM',
          "hs_pipeline": "0",
          "hs_pipeline_stage": "1",
          "hs_ticket_priority": 'HIGH',
          'mdrclaimid': claim.id.toString(),
          'subject': `Claim #${claim.id}`,
          'content': `${capitalize(claim.claimType)} claim from ${capitalize(claim.user.firstName) + " " + capitalize(claim.user.lastName)}`,
        }
    };
    const ticketMaker = await this.hubspotSvc.crm.tickets.basicApi.create(data) as Hubspot.Ticket;
    const ticketAssociator = await this.hubspotSvc.crm.tickets.associationsApi.create(ticketMaker.id, 'contact', contact.value.id, 'ticket_to_contact');
    const ticketNoter = await this.postNote(generateClaimTicketNote(claim), 'note_to_ticket', 'ticket', ticketMaker.id)

    return ok(ticketMaker);

    } catch (e) {
      this.loggerSvc.log('Error creating claim ticket');
      this.loggerSvc.log(e);
      return err(badRequest('error creating claim ticket'));
    };
  }

  public async prepNewContactData(user: Users.User): Promise<Hubspot.NewContact> {
    return { //TODO: Add worldpay customer ID once integration has been built
      mdruserid: user.id.toString(),
      email: user.email,
      firstname: user.firstName,
      lastname: user.lastName,
      address:`${[user.address.address1, user.address.address2, user.address.city, user.address.postcode].filter(i => i).join(', ')}`
    };
  }

}

