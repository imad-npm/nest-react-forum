// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService, // inject ConfigService
  ) {}

  async register(dto: RegisterDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.users.createUser(dto, hashed);
    return this.generateTokens(user);
  }

  async validateUser(email: string, pass: string) {
    const user = await this.users.findByEmail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(pass, user.password);
    return isMatch ? user : null;
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    
    return this.generateTokens(user);
  }

  async refreshToken(refreshToken: string) {
    const payload = this.jwt.verify(refreshToken, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'), // use ConfigService
    });
    const user = await this.users.findOneById(payload.sub);
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
