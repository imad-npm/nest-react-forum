import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

interface GetUserOptions {
  optional?: boolean;
}

export const GetUser = createParamDecorator(
  (
    options: GetUserOptions | undefined,
    ctx: ExecutionContext,
  ): User | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const user: User | undefined = request.user;

    if (!user && !options?.optional) {
      throw new UnauthorizedException(
        'No authenticated user found. Token may be missing or invalid.',
      );
    }

    return user;
  },
);