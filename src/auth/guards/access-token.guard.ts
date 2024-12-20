import { AccessTokenStrategy } from "../strategies/access-token.strategy";
import { AuthGuard } from '@nestjs/passport';

export class AccessTokenGuard extends AuthGuard('AccessTokenStrategy') {}