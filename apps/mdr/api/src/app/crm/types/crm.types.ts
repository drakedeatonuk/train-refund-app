import { SimplePublicObject } from '@hubspot/api-client/lib/codegen/crm/contacts';
import { RecursivePartial } from '@multi/shared';

export namespace Hubspot {

  export type Contact = { // extends SimplePublicObject
    id: string;
    properties: {
      email: string,
      address: string;
      createdate: string;
      firstname: string;
      lastname: string;
      jobtitle: string;
      mdruserid: string;
      lastmodifieddate: string;
      'hs_all_contact_vids': string;
      'hs_email_domain': string;
      'hs_is_contact': string;
      'hs_is_unworked': string;
      'hs_object_id': string;
      'hs_pipeline': string;
    };
    createdAt: Date;
    updatedAt: Date;
    archived: false;
  };

  export type NewContact = {
    email: Contact['properties']['email'],
    address: Contact['properties']['address'],
    firstname: Contact['properties']['firstname'],
    lastname: Contact['properties']['lastname'],
    mdruserid: Contact['properties']['mdruserid'],
  }

  export type PartialContact = RecursivePartial<Contact['properties']>;

  export type ContactSearchParam = {'crmContactId': number} | {'mdrUserId': number} | {'email': string}

  export enum ContactSearchDict {
    'crmContactId' = "hs_object_id",
    'mdrUserId' = "mdruserid",
    'email' = "email",
  }

  export type ContactSearchRes = Contact['properties'];

  export type Ticket = {
  id: string,
  properties: {
      subject: string; // title
      content: string; //description
      mdrclaimid: string;
      hs_pipeline_stage: string; // 0 | 1 | 2 | 3 | 4
      hs_ticket_category: string; //'CLAIM'
      createdate: string;
      hs_all_owner_ids: string;
      hs_lastmodifieddate: string;
      hs_object_id: string;
      hs_pipeline: string;
      hs_ticket_id: string;
      hs_ticket_priority: string; //'HIGH'
      hs_user_ids_of_all_owners: string;
      hubspot_owner_assigneddate: string;
      hubspot_owner_id: string; //'379627225'
    };
    createdAt: Date;
    updatedAt: Date;
    archived: boolean;
  }

  export type NewNote = {
    'hs_timestamp': string;
    'hs_note_body': string;
  }

  export type AssociationTypes = 'contact_to_company' | 'company_to_contact' | 'deal_to_contact' |
    'contact_to_deal' | 'deal_to_company' | 'company_to_deal' | 'company_to_engagement' |
    'engagement_to_company' | 'contact_to_engagement' | 'engagement_to_contact' | 'deal_to_engagement' |
    'engagement_to_deal' | 'parent_company_to_child_company' | 'child_company_to_parent_company' |
    'contact_to_ticket' | 'ticket_to_contact' | 'ticket_to_engagement' | 'engagement_to_ticket' |
    'deal_to_line_item' | 'line item_to_deal' | 'company_to_ticket' | 'ticket_to_company' |
    'deal_to_ticket' | 'ticket_to_deal' | 'note_to_contact' | 'note_to_ticket';

  export type ToObjectTypes = 'contact' | 'ticket';
}

