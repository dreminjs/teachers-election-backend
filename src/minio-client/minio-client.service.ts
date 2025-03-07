import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import * as crypto from 'crypto';
import { BufferedFile } from './minio-client.interface';
import * as Minio from 'minio';

@Injectable()
export class MinioClientService {
  constructor(
    private readonly configService: ConfigService
    // private readonly minioService: MinioService
  ) {}

  public get client(): Minio.Client {
    return new Minio.Client({
      endPoint: this.endpoint,
      port: this.port,
      useSSL: true,
      accessKey: this.accessKey,
      secretKey: this.secrethKey,
    });
  }

  private readonly baseBucket = this.configService.get<string>('MINIO_BUCKET');

  private readonly port = +this.configService.get<string>('MINIO_PORT');

  private readonly endpoint = this.configService.get<string>('MINIO_ENDPOINT');

  private readonly bucket = this.configService.get<string>('MINIO_BUCKET');

  private readonly accessKey =
    this.configService.get<string>('MINIO_ACCESS_KEY');

  private readonly secrethKey =
    this.configService.get<string>('MINIO_SECRET_KEY');

  public async uploadOne(file: BufferedFile | null): Promise<{
    url: string;
    fileName: string;
  } | null> {
    if (!file) return null;
    const temp_filename = Date.now().toString();
    const hashedFileName = crypto
      .createHash('md5')
      .update(temp_filename)
      .digest('hex');
    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': '1234',
    };
    const ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length
    );
    const fileName = `${hashedFileName + ext}`;
    this.client.putObject(
      this.baseBucket,
      fileName,
      file.buffer,
      null,
      metaData
    );

    return {
      url: `${this.endpoint}:${this.port}/${this.bucket}/${fileName}`,
      fileName,
    };
  }
}
