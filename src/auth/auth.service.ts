// src/auth/auth.service.ts
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  // -------------------------------------------------------------------------
  // Register (local account)
  // -------------------------------------------------------------------------
  async register(name: string, email: string, password: string): Promise<User> {
    return this.userService.createUser(
      name,
      email,
      password, // will be hashed inside UsersService
    );
  }

  // -------------------------------------------------------------------------
  // Validate credentials (used by LocalStrategy)
  // -------------------------------------------------------------------------
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);

    // Social-only accounts have no password
    if (!user.password) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  // -------------------------------------------------------------------------
  // Sign in (called after successful local or refresh validation)
  // -------------------------------------------------------------------------
  async signIn(user: User) {
    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException('Email not verified.');
    }
    return this.generateTokens(user);
  }

  // -------------------------------------------------------------------------
  // Google OAuth login / link
  // -------------------------------------------------------------------------
  async googleLogin(oauthUser: {
    email: string;
    fullName?: string;
    id: string;
    picture?: string;
  }): Promise<User> {
    if (!oauthUser?.email) {
      throw new BadRequestException('Google account has no accessible email');
    }

    let user: User | null = null;

    try {
      user = await this.userService.findByEmail(oauthUser.email);
    } catch {
      user = null; // not found
    }

    if (!user) {
      // First time → create new user
      return this.userService.createUser(
        oauthUser.fullName ?? oauthUser.email.split('@')[0],
        oauthUser.email,
        undefined, // no password
        'google',
        oauthUser.id,
        new Date(), // email already verified by Google
        oauthUser.picture,
      );
    }

    // Existing user → make sure provider data is up-to-date
    return this.userService.updateUser(user, {
      name: oauthUser.fullName ?? user.name,
      provider: 'google',
      providerId: oauthUser.id,
      emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
    });
  }

  // -------------------------------------------------------------------------
  // Refresh token flow
  // -------------------------------------------------------------------------
  async renewTokens(user: User) {
    return this.generateTokens(user);
  }

  // -------------------------------------------------------------------------
  // Token generation (shared)
  // -------------------------------------------------------------------------
  private generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '2h',
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}