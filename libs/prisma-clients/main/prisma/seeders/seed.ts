import { Users, stationShortcodes } from '../../../../mdr/src/index';
import { MainClient } from '../../index';
import { Prisma, TicketType, PurchaseType, ClaimType, ClaimStatus, Photo, Claim } from '.prisma/main-client';
import { v4 as uuid } from 'uuid';
import { sample } from 'lodash';
import * as crypto from 'crypto';

import { faker } from '@faker-js/faker';

faker.setLocale('en_GB');

if (!process.env.JWT_SECRET) throw new Error('no salt provided');
const jwtSecret = process.env.JWT_SECRET;

// specifies how many iterations to use throughout seeder (e.g. total users, claims per user, etc...)
const entriesCount = Array.from(Array(10));

const stations = Object.keys(stationShortcodes);
const prisma = new MainClient();

const userMain: Prisma.UserCreateInput = {
  email: 'user@email.com',
  password: crypto!.pbkdf2Sync('424242', jwtSecret, 10000, 64, 'SHA1')!.toString('base64'),
  firstName: 'John',
  lastName: 'Johnson',
  consent: true,
  emailToken: '',
  isVerified: true,
  crmContactId: 201,
};

function* userFactory(userNum: number): Generator<Prisma.UserCreateInput> {
  while (true) {
    yield {
      email: faker.internet.email(),
      password: crypto!.pbkdf2Sync('424242', jwtSecret, 10000, 64, 'SHA1')!.toString('base64'),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      consent: true,
      emailToken: '',
      isVerified: true,
      crmContactId: userNum,
    };
    userNum++;
  }
}
const userGenerator = userFactory(0);

var randomProperty = function (obj: object) {
  var keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0] as keyof typeof obj];
};

const claimFactory = (user: Users.BaseUser): Prisma.ClaimCreateInput => {
  const journeyStartDateTime = faker.date.recent(10);
  return {
    isReturn: faker.datatype.boolean(),
    ticketPrice: parseInt(faker.finance.amount(500, 100000)),
    ticketRef: sample(['12345678', '12345678910']) as string,
    trainDelay: sample(['15', '30', '60', '120']) as string,
    ticketType: randomProperty(TicketType),
    purchaseType: randomProperty(PurchaseType),
    claimType: randomProperty(ClaimType),
    journeyStartStation: sample(stations) ?? 'ABE',
    journeyEndStation: sample(stations) ?? 'ABW',
    journeyStartDateTime: journeyStartDateTime,
    journeyEndDateTime: faker.date.between(journeyStartDateTime, new Date()),
    claimStatus: randomProperty(ClaimStatus),
    dateCreated: faker.date.recent(5),
    user: {
      connect: {
        id: user.id,
      },
    },
    photo: {
      create: {
        userId: user.id,
        firebaseId: uuid(),
        firebaseUrl:
          'https://firebasestorage.googleapis.com/v0/b/mdr-123.appspot.com/o/tickets%2F2022%2F5%2Fdfdd1bb1-c259-4f01-bea6-7c95c0c7221d?alt=media&token=dc5752e4-ed68-44c8-bca3-708c9c0f3508',
        nativeUrl: 'blob:http://localhost:4200/4f439c00-7e07-436e-af42-ae1b3f1633f6',
      },
    },
  };
};

const addressFactory = (user: Users.BaseUser): Prisma.AddressCreateInput => {
  return {
    address1: faker.address.buildingNumber(),
    address2: faker.address.streetAddress(),
    city: faker.address.city(),
    postcode: faker.address.zipCode('######'),
    user: {
      connect: {
        id: user.id,
      },
    },
  };
};

const photoFactory = (user: Users.BaseUser, claim: Claim): Prisma.PhotoCreateInput => {
  return {
    firebaseId: 'bf3d750d-0419-4ea7-ac0c-748221a12ecb',
    firebaseUrl:
      'https://firebasestorage.googleapis.com/v0/b/mdr-123.appspot.com/o/tickets%2F2022%2F5%2Fuser%40email.com-266594e3-8b62-4b6c-98c2-1ee6e4c490e3?alt=media&token=be45597f-b14c-4496-96b4-78ada90e1b93',
    nativeUrl: 'blob:http://localhost:4200/4964ec77-d534-4c21-8b41-990038f3e17e',
    user: {
      connect: {
        id: user.id,
      },
    },
    claim: {
      connect: {
        id: claim.id,
      },
    },
  };
};

async function main() {
  console.log(`Start seeding ...`);
  const mainUser: Required<Users.BaseUser> = await prisma.user.create({
    data: userMain,
  });
  entriesCount.forEach(async () => {
    await prisma.claim.create({
      data: {
        ...claimFactory(mainUser),
      },
    });
  });
  await prisma.address.create({
    data: {
      ...addressFactory(mainUser),
    },
  });
  console.log(`Created main user with id: ${mainUser.id}`);

  entriesCount.forEach(async () => {
    const nextUserData = (await await userGenerator.next().value) as Prisma.UserCreateInput | Prisma.UserUncheckedCreateInput;
    const nextUser: Users.BaseUser = await prisma.user.create({
      data: nextUserData,
    });
    entriesCount.forEach(async () => {
      await prisma.claim.create({
        data: {
          ...claimFactory(nextUser),
        },
      });
    });
    await prisma.address.create({
      data: {
        ...addressFactory(nextUser),
      },
    });
  });
  console.log(`Created ${entriesCount.length} users with ${entriesCount.length} claims each`);
  console.log(`Seeding finished!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// // type Append<T, K> = { [index in keyof T]: T[index] & K }

// // type X = {
// //   Int: {
// //     default: number
// //   };
// //   String: Append<{
// //     unique?: true;
// //   }, 'String' | 'ObjectId' | 'Text' | 'Char' | 'VarChar' | 'Bit' | 'VarBit' | 'Uuid' | 'Xml' | 'Inet' | 'Citext'
// //   >;
// // }

// // const x: X = {
// //   1, "String"
// // };

// // type x =
