import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserService } from 'src/user';
import { comparePassword } from '../helpers/password.helpers';
import { TokenService } from 'src/token';

@Injectable()
export class SigninGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { email, password } = context.switchToHttp().getRequest().body;

    const user =
      await this.userService.findOne({
        where: { email },
      });

    if (!user)
      throw new HttpException(
        'Такой пользователь не существует',
        HttpStatus.BAD_REQUEST
      );
      
    const isPasswordValid = await comparePassword({
      password,
      hashPassword: user.password,
    });

    if (!isPasswordValid) {
      throw new HttpException('Неверная пара пароль', HttpStatus.BAD_REQUEST);
    }

    return true;
  }
}
