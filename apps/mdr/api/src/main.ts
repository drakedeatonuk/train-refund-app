require('dotenv').config();

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'path';
import { AppModule } from './app/app.module';
import { useContainer, ValidationError } from 'class-validator';
import { AllExceptionsFilter } from './app/interceptors/allExceptions';
import { InterceptResults } from './app/interceptors/allResponses';
import * as fs from 'fs';
import * as path from 'path';
import { badRequest, err } from '@multi/shared';

console.log(process.argv);

async function bootstrap() {
  const ssl = process.env.USE_SSL === 'true' ? true : false;
  let httpsOptions = null;
  if (ssl) {
    const keyPath = process.env.SSL_KEY_PATH || '';
    const certPath = process.env.SSL_CERT_PATH || '';
    console.log(path.join(__dirname, `../../../../${keyPath}`));
    httpsOptions = {
      key: fs.readFileSync(path.join(__dirname, `../../../../${keyPath}`)).toString('utf-8'),
      cert: fs.readFileSync(path.join(__dirname, `../../../../${certPath}`)).toString('utf-8'),
    };
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, { httpsOptions });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.NESTJS_PORT || 3333;
  const hostname = process.env.NESTJS_HOSTNAME || 'localhost';

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new InterceptResults());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return err(badRequest(JSON.stringify(validationErrors)));
      },
    })
  );
  app.useStaticAssets(resolve('apps/mdr/api/src/app/static/public/'));
  app.setBaseViewsDir(resolve('apps/mdr/api/src/app/static/views/'));
  app.setViewEngine('hbs');
  app.enableCors();

  await app.listen(port, hostname, () => {
    Logger.log(`🚀 Application is running on: http${ssl?'s':''}://${hostname}:${port}/${globalPrefix}`);
  });
}

bootstrap();

