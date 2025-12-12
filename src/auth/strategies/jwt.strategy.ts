import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  // Hypothetical improvement
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
