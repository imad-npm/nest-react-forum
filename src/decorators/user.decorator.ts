// src/decorators/current-user.decorator.ts
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();

    // This comes from JwtStrategy.validate() → req.user
    const user: User | undefined = request.user;

    if (!user) {
      throw new UnauthorizedException(
        'No authenticated user found. Token may be missing or invalid.',
      );
    }

    return user;
  },
);
