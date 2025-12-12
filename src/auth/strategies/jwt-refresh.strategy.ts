import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    config: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: config.getOrThrow<string>('JWT_REFRESH_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    // 1. Check database for active user
    const user = await this.userService.findOneById(payload.sub);

    // 2. Reject if user doesn't exist (e.g., account was deleted)
    if (!user) {
      throw new UnauthorizedException();
    }

    // 3. Attach user object to req.user
    return user;
  }
}
