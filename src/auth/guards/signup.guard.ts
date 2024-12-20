import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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
      return false;
    }

    if(codeWord !== "1") {
      return false;
    }
    
    return true;
  }
}
