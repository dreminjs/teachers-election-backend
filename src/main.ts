import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';
import {  ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({ credentials: true, origin: [
    "http://localhost:5173",
    "https://teacher-election.vercel.app"
  ] });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  
  await app.listen(3000);
}
bootstrap();
