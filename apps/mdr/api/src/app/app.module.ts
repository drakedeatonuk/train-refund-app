import { StripeProcessorDataService } from './payments/services/stripeProcessorData.service';
import { NestLoggerService } from './logger/services/nestLogger.service';
import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { DbService } from './database/prisma.service';
import { SendGridMailService } from './mail/services/sendGridMail.service';
import { StaticService } from './static/static.service';
import { UsersService } from './users/services/users.service';
import { PrismaUsersDataService } from './users/services/prismaUsersData.service';
import { PRISMA_USERS_DATA_SERVICE } from './users/constants/users.constants';
import { SEND_GRID_MAIL_SERVICE } from './mail/constants/mail.constants';
import { NEST_LOGGER_SERVICE } from './logger/constants/logger.constants';
import { ProcessorService } from './payments/services/processor.service';
import { STRIPE_PROCESSOR_SERVICE } from './payments/constants/payments.constants';
import { PRISMA_CLAIMS_DATA_SERVICE } from './claims/constants/claims.constants';
import { PrismaClaimsDataService } from './claims/services/prismaClaimsData.service';
import { HttpModule } from '@nestjs/axios';
import { ClaimsService } from './claims/services/claims.service';
import { TrainsService } from './trains/trains.service';
import { MailService } from './mail/services/mail.service';
import { PRISMA_ADDRESSES_DATA_SERVICE } from './addresses/constants/addresses.constants';
import { AddressesService } from './addresses/services/addresses.service';
import { PrismaAddressesDataService } from './addresses/services/prismaAddressesData.service';
import { EmailTakenConstraint } from './users/validators/emailCheck';
import { PRISMA_PHOTOS_DATA_SERVICE } from './photos/constants/photos.constants';
import { PrismaPhotosDataService } from './photos/services/prismaPhotosData.service';
import { PhotosService } from './photos/services/photos.service';
import { HUBSPOT_CRM_DATA_SERVICE } from './crm/constants/crm.constants';
import { HubspotCrmDataService } from './crm/services/hubspotCrmData.service';
import { CRMService } from './crm/services/crm.service';

@Module({
  imports: [forwardRef(() => AuthModule), HttpModule],
  controllers: [AppController, UsersController],
  providers: [
    DbService,
    UsersService,
    { provide: PRISMA_USERS_DATA_SERVICE, useClass: PrismaUsersDataService },
    { provide: SEND_GRID_MAIL_SERVICE, useClass: SendGridMailService },
    { provide: NEST_LOGGER_SERVICE, useClass: NestLoggerService },
    { provide: STRIPE_PROCESSOR_SERVICE, useClass: StripeProcessorDataService },
    { provide: PRISMA_CLAIMS_DATA_SERVICE, useClass: PrismaClaimsDataService },
    { provide: PRISMA_ADDRESSES_DATA_SERVICE, useClass: PrismaAddressesDataService },
    { provide: PRISMA_PHOTOS_DATA_SERVICE, useClass: PrismaPhotosDataService },
    { provide: HUBSPOT_CRM_DATA_SERVICE, useClass: HubspotCrmDataService },
    CRMService,
    PhotosService,
    EmailTakenConstraint,
    ProcessorService,
    AddressesService,
    StaticService,
    ClaimsService,
    TrainsService,
    MailService,
  ],
  exports: [
    DbService,
    UsersService,
    { provide: PRISMA_USERS_DATA_SERVICE, useClass: PrismaUsersDataService },
    { provide: SEND_GRID_MAIL_SERVICE, useClass: SendGridMailService },
    { provide: NEST_LOGGER_SERVICE, useClass: NestLoggerService },
    { provide: STRIPE_PROCESSOR_SERVICE, useClass: StripeProcessorDataService },
    { provide: PRISMA_CLAIMS_DATA_SERVICE, useClass: PrismaClaimsDataService },
    { provide: PRISMA_ADDRESSES_DATA_SERVICE, useClass: PrismaAddressesDataService },
    { provide: PRISMA_PHOTOS_DATA_SERVICE, useClass: PrismaPhotosDataService },
    { provide: HUBSPOT_CRM_DATA_SERVICE, useClass: HubspotCrmDataService },
    CRMService,
    PhotosService,
    EmailTakenConstraint,
    AddressesService,
    ProcessorService,
    StaticService,
    ClaimsService,
    TrainsService,
    MailService,
  ],
})
export class AppModule {}
