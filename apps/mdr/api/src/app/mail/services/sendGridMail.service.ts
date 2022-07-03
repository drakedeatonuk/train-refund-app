import { Result, ok, err, badRequest } from '@multi/shared';
import { Users, Claims } from '@multi/mdr';
import { Inject, Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
import { Request } from 'express';
import { NEST_LOGGER_SERVICE } from '../../logger/constants/logger.constants';
import { ILoggerService } from '../../logger/interfaces/iLogger.interface';
import { IMailService } from '../interfaces/iMailService.service';

@Injectable()
export class SendGridMailService implements IMailService {
  constructor(@Inject(NEST_LOGGER_SERVICE) private loggerSvc: ILoggerService) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendVerificationEmail(req: Request, user: Users.NewUser): Promise<Result<void>> {
    let emailLink = req.protocol + '://' + req.hostname + ':3333/api/verify-email?token=' + user.emailToken;

    const email = {
      from: process.env.SENDGRID_SENDER,
      to: user.email,
      subject: 'My Delay Repay - email verification',
      text: `
          Thanks for registering!
          Please copy & paste the address below to verify your account:
          ${emailLink}`,
      html:
        "<h1>Thanks for registering!</h1><p> Please click the link below to verify your account: </p><a href='" +
        emailLink +
        "'>Verify your account</a>",
    };
    sgMail
      .send(email)
      .then(() => this.loggerSvc.log(`📬 Verification email sent`))
      .catch(() => {
        return err(badRequest('Error sending verification email'));
      });
    return ok();
  }

  async sendResetPasswordEmail(user: Users.User, link: string): Promise<Result<void>> {
    console.log('in sendResetPasswordEmail');
    const email = {
      from: process.env.SENDGRID_SENDER,
      to: user.email,
      subject: 'My Delay Repay - reset password',
      text: `
        Greetings!
        To reset your password, please copy and paste the link below into your browser:
        ${link}`,
      html:
        "<h1>Greetings!</h1><p> To reset your password, plese click on the link below: </p><a href='" + link + "'>Verify your account</a>",
    };
    sgMail
      .send(email)
      .then(() => this.loggerSvc.log(`📬 Reset password email sent`))
      .catch(() => {
        return err(badRequest('Error sending reset password email'));
      });
    return ok();
  }

  async sendClaimSubmissionEmail(user: Users.User, claim: Claims.Claim): Promise<Result<void>> {
    const email = {
      from: process.env.SENDGRID_SENDER,
      to: user.email,
      subject: 'My Delay Repay - claim submission',
      text: `
        Greetings ${user.firstName}!
        We've successfully received your claim request and will start the process of securing your refund for you.
        Please check back on the My Delay Repay app for updates on your claim.`,
      html:
        `<h1>
          Greetings ${user.firstName}!
        </h1>
        <p>
          We've successfully received your claim request and will start the process of securing your refund for you.
          Please check back on the My Delay Repay app for updates on your claim.
        </p>`
    };
    sgMail
      .send(email)
      .then(() => this.loggerSvc.log(`📬 New claim email sent`))
      .catch(() => {
        return err(badRequest('Error sending recieved claim email'));
      });
    return ok();
  }
}
