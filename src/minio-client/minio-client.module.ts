import { Module } from '@nestjs/common';
import { MinioClientController } from './minio-client.controller';
import { MinioClientService } from './minio-client.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioModule } from 'nestjs-minio-client';
import { getMinioClientConfig } from './minio-client.config';

@Module({
  imports: [
    MinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMinioClientConfig,
    }),
    ConfigModule
  ],
  controllers: [MinioClientController],
  providers: [MinioClientService],
  exports: [MinioClientService]
})
export class MinioClientModule {}
