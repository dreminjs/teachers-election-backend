import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {

  private logger = new Logger(PasswordService.name)

  public async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  public async comparePassword(
    password: string,
    hashPassword: string
  ): Promise<boolean> {

    this.logger.log(`Password: ${password}`);

    return await bcrypt.compare(password, hashPassword);
  }
}
