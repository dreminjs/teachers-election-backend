import { User } from '@prisma/client';

export class IExtendedRequest extends Request {
  user: User;
}
