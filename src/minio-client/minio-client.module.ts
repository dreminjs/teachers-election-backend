import { Module } from '@nestjs/common';
import { MinioClientController } from './minio-client.controller';
import { MinioClientService } from './minio-client.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule
  ],
  controllers: [MinioClientController],
  providers: [MinioClientService],
  exports: [MinioClientService]
})
export class MinioClientModule {}
