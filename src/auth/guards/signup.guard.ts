import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { SignupDto } from '../dto/signup.dto';
import { UserService } from 'src/user';

@Injectable()
export class SignupGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  private logger = new Logger(SignupGuard.name.toLocaleUpperCase())

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { email, codeWord } = context.switchToHttp().getRequest().body as SignupDto;

    this.logger.log({email})

    const user = await this.userService.findOne({ where: { email } });

    this.logger.log(user)

    if (user) {
      throw new HttpException('Такой пользователь уже существует', HttpStatus.BAD_REQUEST)
    }

    if(codeWord !== "1") {
      throw new HttpException('Не правильная секретная информация', HttpStatus.BAD_REQUEST)
    }
    
    return true;
  }
}
