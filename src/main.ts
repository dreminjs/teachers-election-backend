import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';
import {  ValidationPipe } from '@nestjs/common';

import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({ credentials: true, origin: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );


  const config = new DocumentBuilder().setTitle("Teacher Election")
  .setDescription('The Teacher Election API description')
  .setVersion('1.0')
  .addTag('teahcers')
  .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(3000);
}
bootstrap();
