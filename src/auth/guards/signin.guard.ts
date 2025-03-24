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

    const { password: hashPassword, id: userId } =
      await this.userService.findOne({
        where: { email },
      });

    if (!hashPassword)
      throw new HttpException(
        'Такой пользователь не существует',
        HttpStatus.BAD_REQUEST
      );

    const deleteTokenQuery = this.tokenService.deleteOne({ userId });

    const isPasswordValidQuery = comparePassword({
      password,
      hashPassword,
    });

    const [_, isPasswordValid] = await Promise.all([
      deleteTokenQuery,
      isPasswordValidQuery,
    ]);

    if (!isPasswordValid) {
      throw new HttpException('Неверная пара пароль', HttpStatus.BAD_REQUEST);
    }

    return true;
  }
}
