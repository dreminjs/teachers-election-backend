import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SignupDto } from '../dto/signup.dto';
import { UserService } from 'src/user';

@Injectable()
export class SignupGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { email, codeWord } = context.switchToHttp().getRequest()
      .body as SignupDto;

    const user = await this.userService.findOne({ email });

    if (user) {
      throw new HttpException('Такой пользователь уже существует', HttpStatus.BAD_REQUEST)
    }

    if(codeWord !== "1") {
      throw new HttpException('Не правильная секретная информация', HttpStatus.BAD_REQUEST)
    }
    
    return true;
  }
}
