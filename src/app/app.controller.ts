import { Controller } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Controller('app')
export class AppController {
    constructor(
        private readonly userService: UserService
    ){}


    
}
