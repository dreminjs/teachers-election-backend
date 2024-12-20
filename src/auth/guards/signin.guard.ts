import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/user';
import { SignupDto } from '../dto/signup.dto';
import { PasswordService } from 'src/password';

@Injectable()
export class SigninGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { email, password } = context.switchToHttp().getRequest();

    const user = await this.userService.findOne({ email });

    if (!user) throw new HttpException('Такой пользователь не существует', HttpStatus.BAD_REQUEST)

    return true
  }
}

// ЩА ПРИДУ