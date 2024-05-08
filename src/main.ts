import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser';
import 'dotenv/config';
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
  // app.enableCors({
  //   origin:true,
  //   credentials: true,
  //   exposedHeaders: ['Authorization','Content-Type'], // * 사용할 헤더 추가.
  // });
  // app.use(cookieParser());

//   await app.listen(8080);
// }import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
  };

  const app = await NestFactory.create(
    AppModule,
    { httpsOptions },
  );
  app.use(cookieParser());

  app.enableCors({
    origin:true,
    credentials: true,
  });

  await app.listen(8080);
}

bootstrap();
