import { PhotoUpdateDto } from './photos/validators/photoUpdate.dto';
import { AllExceptionsFilter } from './interceptors/allExceptions';
import { ProcessorService } from './payments/services/processor.service';
import { JWT_AUTH_SERVICE } from './auth/constants/auth.constants';
import { LocalAuthGuard } from './auth/guards/localAuth.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request as Req,
  UseGuards,
  Res,
  ParseIntPipe,
  Inject,
  UseFilters,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './auth/guards/jtwAuth.guard';
import { NewUserDto } from './users/validators/newUser.dto';
import { LoginUserDto } from './users/validators/loginUser.dto';
import { Addresses, Users } from '@multi/mdr';
import { StaticService } from './static/static.service';
import { Claims } from '@multi/mdr';
import { badRequest, err, ok, Result } from '@multi/shared';
import { IAuthService } from './auth/interfaces/iAuth.interface';
import { UsersService } from './users/services/users.service';
import { NEST_LOGGER_SERVICE } from './logger/constants/logger.constants';
import { ILoggerService } from './logger/interfaces/iLogger.interface';
import Stripe from 'stripe';
import { ClaimsService } from './claims/services/claims.service';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MailService } from './mail/services/mail.service';
import { AddressesService } from './addresses/services/addresses.service';
import { NewClaimDto } from './claims/validators/newClaim.dto';
import { AddressDto } from './addresses/validators/address.dto';
import { PartialUserDto } from './users/validators/partialUser.dto';
import { EmailDto } from './users/validators/email.dto';
import { User, Photo } from '.prisma/main-client';
import { PhotosService } from './photos/services/photos.service';
import { CRMService } from './crm/services/crm.service';

const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});

@Controller()
@UseFilters(new AllExceptionsFilter())
export class AppController {
  constructor(
    @Inject(JWT_AUTH_SERVICE) private authSvc: IAuthService,
    @Inject(NEST_LOGGER_SERVICE) private loggerSvc: ILoggerService,
    private usersSvc: UsersService,
    private staticSvc: StaticService,
    private processorSvc: ProcessorService,
    private claimsSvc: ClaimsService,
    private mailSvc: MailService,
    private addressesSvc: AddressesService,
    private photosSvc: PhotosService,
    private crmSvc: CRMService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() user: LoginUserDto): Promise<Result<Users.LoginData>> {
    const userLookup = await this.usersSvc.findUser(user.email);
    if (userLookup.ok == false) return userLookup;
    if (userLookup.value.isVerified === false) return err(badRequest('unverifiedEmail'));
    return ok({
      jwToken: await this.authSvc.authenticate(user.email),
      user: userLookup.value
    });
  }

  @Post('register')
  async register(
    @Req() req: Request, //TODO: what
    @Body() user: NewUserDto
    //@Res() res: Response
  ): Promise<Result<Users.LoginData>> {
    const isUser = await this.usersSvc.isUser(user.email);
    if (isUser) return err(badRequest('User already exists'));

    const registrator = await this.authSvc.register(req, user);
    if (registrator.ok == false) return registrator;

    const jwToken = await this.authSvc.authenticate(registrator.value.email);

    const newContact = await this.crmSvc.createOrUpdateContact(registrator.value);
    if (newContact.ok == false) return newContact;

    const userUpdater = await this.usersSvc.updateUser(registrator.value.id, { crmContactId: parseInt(newContact.value.id) });
    if (userUpdater.ok == false) return userUpdater;

    const emailUser = await this.mailSvc.sendVerificationEmail(req, registrator.value);
    if (emailUser.ok == false) return emailUser;

    // const userLookup = await this.usersSvc.findUser(user.email);
    // if (userLookup.ok == false) return userLookup;

    // const stripeCustomerMaker = await this.processorSvc.createStripeCustomer(user);
    // if (stripeCustomerMaker.ok == false) return stripeCustomerMaker;

    // const customerMaker = await this.usersSvc.createNewCustomer({
    //   userId: userLookup.value.id,
    //   customerBillingId: stripeCustomerMaker.value.stripeCustomerId,
    // });
    // if (customerMaker.ok == false) return customerMaker;

    // const userReLookup = await this.usersSvc.findUser(user.email);
    // if (userReLookup.ok == false) return userReLookup;

    return ok({
      jwToken: jwToken,
      user: userUpdater.value,
    });
  }

  @Get('verify-email')
  async verifyEmail(@Query() { token }, @Res() res: Response): Promise<void> {
    return res.render('email-verified', {
      isVerified: await this.usersSvc.verifyNewUser(token),
    });
  }

  @Post('forgot-password')
  async sendResetPasswordEmail(@Body() { email }): Promise<Result<void>> {
    let userLookup = await this.usersSvc.findUser(email);
    if (userLookup.ok == false) return userLookup;

    const emailUser = await this.authSvc.initResetPasswordEmail(userLookup.value);
    if (!emailUser.ok) return emailUser;

    return ok();
  }

  @Get('reset-password/:id/:token')
  async sendResetPasswordPage(@Param('id', ParseIntPipe) id: number, @Param('token') token: string, @Res() res: Response): Promise<void> {
    let userLookup = await this.usersSvc.findUser(id);
    if (!userLookup.ok) return this.staticSvc.renderErrorTemplate(null, 'miscError', res);

    if (!(await this.authSvc.isValidToken(userLookup.value, token)))
      return this.staticSvc.renderErrorTemplate(userLookup.value, 'invalidToken', res);

    res.render('reset-password', {
      email: userLookup.value.email,
      link: `http://localhost:3333/api/reset-password/${userLookup.value.id}/${token}`,
    });
  }

  @Post('reset-password/:id/:token')
  async resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Param('token') token: string,
    @Body() { password },
    @Res() res: Response
  ): Promise<void> {
    const userLookup = await this.usersSvc.findUser(id);
    if (!userLookup.ok) return this.staticSvc.renderErrorTemplate(null, 'noUser', res);

    const isValidToken = await this.authSvc.isValidToken(userLookup.value, token);
    if (!isValidToken) return this.staticSvc.renderErrorTemplate(userLookup.value, 'invalidToken', res);

    const passwordUpdater = await this.usersSvc.updatePassword(userLookup.value.id, password);
    if (!passwordUpdater.ok) return this.staticSvc.renderErrorTemplate(userLookup.value, 'updateFailed', res);

    this.loggerSvc.log(`🔐 Password reset`);
    return res.render('reset-password-successful', {
      email: userLookup.value.email,
    });
  }

  @Post('user/verification-email')
  async sendVerificationEmail(@Req() req: Request, @Body() body: EmailDto): Promise<Result<void>> {
    const userLookup = await this.usersSvc.findUser(body.email);
    if (userLookup.ok == false) return;

    this.mailSvc.sendVerificationEmail(req, userLookup.value);

    return ok();
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  async findUserById(@Param('id', ParseIntPipe) id: number): Promise<Result<Users.User>> {
    const userLookup = await this.usersSvc.findUser(id);
    if (userLookup.ok == false) return userLookup;

    return userLookup;
  }

  @UseGuards(JwtAuthGuard)
  @Put('user/:id')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() userFields: PartialUserDto): Promise<Result<Users.User>> {
    const userUpdator = await this.usersSvc.updateUser(id, userFields);
    if (userUpdator.ok == false) return userUpdator;

    const contactFields = await this.crmSvc.prepUpdateContactData(userFields);
    const contactUpdator = await this.crmSvc.updateContact(userUpdator.value.crmContactId.toString(), contactFields);
    if (contactUpdator.ok == false) return contactUpdator;

    return userUpdator;
  }

  @UseGuards(JwtAuthGuard)
  @Put('address/:id')
  async updateAddress(@Param('id', ParseIntPipe) id: number, @Body() addressFields: AddressDto): Promise<Result<Addresses.Address>> {
    const addressUpdator = await this.addressesSvc.updateAddress(id, addressFields);
    if (addressUpdator.ok == false) return addressUpdator;

    const userLookup = await this.usersSvc.findUser(addressUpdator.value.userId);
    if (userLookup.ok == false) return userLookup;

    const contactFields = await this.crmSvc.prepUpdateContactData(addressFields);
    const contactUpdator = await this.crmSvc.updateContact(userLookup.value.crmContactId.toString(), contactFields);
    if (contactUpdator.ok == false) return contactUpdator;

    return addressUpdator;
  }

  @UseGuards(JwtAuthGuard)
  @Get('setup-intent/:id')
  async getSetupIntent(@Param('id', ParseIntPipe) id: number): Promise<Result<Stripe.SetupIntent>> {
    let userLookup = await this.usersSvc.findUser(id);
    if (userLookup.ok == false) return userLookup;
    if (!userLookup.value?.customer?.customerBillingId) return err(badRequest("missing customer's stripe id"));

    const intentGetter = await this.processorSvc.getSetupIntent(userLookup.value.customer.customerBillingId);
    if (intentGetter.ok == false) return intentGetter;

    return intentGetter;
  }

  @UseGuards(JwtAuthGuard)
  @Post('customer/save/payment-method')
  async saveCustomerPaymentMethod(@Body() { customerId, paymentMethodId }): Promise<Result<void>> {
    const paymentGetter = await this.processorSvc.getPaymentMethodData(paymentMethodId);
    if (paymentGetter.ok == false) return paymentGetter;

    const paymentMethodMaker = await this.usersSvc.createNewPaymentMethod(customerId, paymentMethodId, paymentGetter.value.card.last4);
    if (paymentMethodMaker.ok == false) return paymentMethodMaker;

    return paymentMethodMaker;
  }

  @UseGuards(JwtAuthGuard)
  @Post('customer/delete/payment-method')
  async deleteCustomerPaymentMethod(@Body() { id, paymentMethodId, customerBillingId }): Promise<Result<void>> {
    const processorPaymentMethodDeleter = await this.processorSvc.deletePaymentMethod(paymentMethodId, customerBillingId);
    if (processorPaymentMethodDeleter.ok == false) return processorPaymentMethodDeleter;

    const userPaymentMethodDeleter = await this.usersSvc.deletePaymentMethod(parseInt(id));
    if (userPaymentMethodDeleter.ok == false) return userPaymentMethodDeleter;

    return userPaymentMethodDeleter;
  }

  @UseGuards(JwtAuthGuard)
  @Post('claim/:userId')
  async submitClaim(@Param('userId', ParseIntPipe) userId: number, @Body() claim: NewClaimDto): Promise<Result<Claims.Claim>> {
    const claimMaker = await this.claimsSvc.createNewClaim(userId, claim);
    if (claimMaker.ok == false) return claimMaker;

    //TODO Once WorldPay is added: this.processorSvc.createClaimInvoice(customerId, claim);

    const ticketMaker = await this.crmSvc.postClaimTicket(claimMaker.value);
    if (ticketMaker.ok == false) return ticketMaker;

    const claimUpdator = await this.claimsSvc.updateClaim(claimMaker.value.id, {crmTicketId: parseInt(ticketMaker.value.id)});
    if (claimUpdator.ok == false) return claimUpdator;

    const userLookup = await this.usersSvc.findUser(userId);
    if (userLookup.ok == false) return userLookup;

    const emailUser = await this.mailSvc.sendClaimSubmissionEmail(userLookup.value, claimMaker.value);
    if (emailUser.ok == false) return emailUser;

    return claimMaker;
  }

  @UseGuards(JwtAuthGuard)
  @Put('claim/photo/:userId')
  async updateClaimPhoto(@Param('userId', ParseIntPipe) userId: number, @Body() photoFields: PhotoUpdateDto): Promise<Result<Photo>> {
    return this.photosSvc.updateClaimPhotoFirebaseUrl(photoFields.firebaseId, photoFields.firebaseUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Post('trains')
  async findTrains(@Body() body) {
    //TODO
  }

  @UseGuards(JwtAuthGuard)
  @Get('claims')
  async findClaims(@GetUser() user: User): Promise<Result<Claims.Claim[]>> {
    return this.claimsSvc.findClaims(user.id);
  }
}
