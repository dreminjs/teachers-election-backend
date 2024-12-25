import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ credentials: true, origin: '*' });

  app.use(cookieParser());

  const logger = new Logger();

  logger.log('port: ', 3000);

  await app.listen(3000);
}
bootstrap();
