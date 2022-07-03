import { INestApplicationContext, Injectable, OnModuleInit } from '@nestjs/common';
import { MainClient } from '@nx-prisma/prisma-clients'

@Injectable()
export class DbService extends MainClient implements OnModuleInit {

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplicationContext) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
