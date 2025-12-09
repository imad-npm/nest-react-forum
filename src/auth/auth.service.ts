// src/auth/auth.service.ts
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { EmailVerificationService } from 'src/email-verification/email-verification.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService, // inject ConfigService
  ) { }

  async register(dto: RegisterDto) {
    const user = await this.userService.createUser(dto);
    return user;
  }

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findByEmail(email);

    if (!user || user.password === null) {
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    return isMatch ? user : null;
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    // ← THIS IS THE CRITICAL LINE
    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException('Email not verified.');
    }
    return this.generateTokens(user);
  }
  // src/auth/auth.service.ts
  async googleLogin(oauthUser: any) {
    if (!oauthUser?.email) {
      throw new BadRequestException('Google account has no accessible email');
    }

    let user: User | null = null;

    try {
      // If exists → load
      user = await this.userService.findByEmail(oauthUser.email);
    } catch (_) {
      user = null; // Not found
    }

    if (!user) {
      // CREATE a new user
      return this.userService.createUser({
        email: oauthUser.email,
        name: oauthUser.fullName,
        provider: 'google',
        providerId: oauthUser.id,
        emailVerifiedAt: new Date(),
        picture: oauthUser.picture,
      });
    }

    // UPDATE existing user
    return this.userService.updateUser(user, {
      name: oauthUser.fullName,
      provider: 'google',
      providerId: oauthUser.id,
      emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
    });
  }


  async renewTokens(refreshToken: string) {
    const payload = this.jwt.verify(refreshToken, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'), // use ConfigService
    });
    const user = await this.userService.findOneById(payload.sub);
    return this.generateTokens(user);
  }

  private generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'), // use ConfigService
      expiresIn: '2h',
    });
    const refreshToken = this.jwt.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'), // use ConfigService
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }
}
