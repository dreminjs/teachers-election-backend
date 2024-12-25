import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'prisma/prisma-client';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'AccessTokenStrategy'
) {

  private logger = new Logger(AccessTokenStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies['accessToken'];
            this.logger.log(`User has been validated`);
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(email: string): Promise<User> {
    const user = await this.userService.findOne({ email });
    this.logger.log(`User ${user.email} has been validated`);
    return user
  }
}
