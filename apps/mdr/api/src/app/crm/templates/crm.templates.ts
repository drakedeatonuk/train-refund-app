import { capitalize } from 'lodash';
import { Claims, stationShortcodes } from "@multi/mdr";
import { Hubspot } from '../types/crm.types';

export function generateClaimTicketNote(claim: Claims.Claim): Hubspot.NewNote {
  return {
    'hs_timestamp': Date.parse(new Date().toString()).toString(),
    'hs_note_body': `
      <body>
        <h3>
          Claim #${claim.id}
        </h3>
        <hr>
        <p>
          The following claim request has been made by <strong>${capitalize(claim.user.firstName) + " " + capitalize(claim.user.lastName)}</strong>.
        </p>
        <h4>
          Claim Breakdown
        </h4>
        <table>
          <tr>
            <th style="text-align:left;">
              Field
            </th>
            <th style="text-align:left;">
              Value
            </th>
          </tr>
          <tr>
            <td>Return</td>
            <td>${claim.isReturn}</td>
          </tr>
          <tr>
            <td>Ticket Price</td>
            <td>${claim.ticketPrice}</td>
          </tr>
          <tr>
            <td>Ticket Reference</td>
            <td>${claim.ticketRef}</td>
          </tr>
          <tr>
            <td>Ticket Picture</td>
            <td><a href="${claim.photo.firebaseUrl}">${claim.photo.firebaseUrl}</td>
          </tr>
          <tr>
            <td>Purchase Type</td>
            <td>${claim.purchaseType}</td>
          </tr>
          <tr>
            <td>Ticket Type</td>
            <td>${claim.ticketType}</td>
          </tr>
          <tr>
            <td>Claim Type</td>
            <td>${claim.claimType}</td>
          </tr>
          <tr>
            <td>Claim Status</td>
            <td>${claim.claimStatus}</td>
          </tr>
          <tr>
            <td>Train Delay</td>
            <td>${claim.trainDelay}</td>
          </tr>
          <tr>
            <td>Journey Start Station</td>
            <td>${stationShortcodes[claim.journeyStartStation]} (${claim.journeyStartStation})</td>
          </tr>
          <tr>
            <td>Journey End Station</td>
            <td>${stationShortcodes[claim.journeyEndStation]} ${claim.journeyEndStation}</td>
          </tr>
          <tr>
            <td>Journey Start Datetime</td>
            <td>${claim.journeyStartDateTime}</td>
          </tr>
          <tr>
            <td>Journey End Datetime</td>
            <td>${claim.journeyEndDateTime}</td>
          </tr>
        </table>
        <hr>
      </body>
    `
  };
}

export function generateUpdateContactNote(oldContactData: Hubspot.Contact, newContactData: Hubspot.Contact): Hubspot.NewNote {
  const oldData = JSON.stringify(oldContactData.properties, null, 2)
    .replace(/\n/g, "<br>").replace(/[ ]/g, "&nbsp;");
  const newData = JSON.stringify(newContactData.properties, null, 2)
    .replace(/\n/g, "<br>").replace(/[ ]/g, "&nbsp;");

  return {
    'hs_timestamp': Date.parse(new Date().toString()).toString(),
    'hs_note_body': `
        <h3>
          Contact Update
        </h3>
        <hr>
        <p>
          An existing Hubspot contact has created an MDR account.
        </p>
        <hr>
        <br>
        <h4>
          New account details (some fields ommitted):
        </h4>
        <p>
          ${newData}
        </p>
        <hr>
        <h4>
          Old account details:
        </h4>
        <p>
          ${oldData}
        </p>
        <hr>
    `
  }
}

