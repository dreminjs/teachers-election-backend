import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    cookieParser({
      httpOnly: true,
      sameSite: 'none',
      secure: false,
      origin: 'http://localhost:5173',
    })
  );

  app.enableCors({ credentials: true, origin: 'http://localhost:5173' });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  await app.listen(3000);
}
bootstrap();
