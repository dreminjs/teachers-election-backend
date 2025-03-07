import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { MinioClientService } from './minio-client.service';
import { BufferedFile, CustomRequest } from './minio-client.interface';

@Injectable()
export class MinioFileUploadInterceptor implements NestInterceptor {
  constructor(private readonly minioClientService: MinioClientService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest() as CustomRequest;

    const file = request.file as BufferedFile

     const result = await this.minioClientService.uploadOne(
      file ? file : null
    );

    result?.fileName ? request['fileName'] = result.fileName : request['fileName'] = null

    return next.handle();
  }
}
