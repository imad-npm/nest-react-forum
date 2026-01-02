import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { EmailVerificationService } from 'src/email-verification/email-verification.service';
import { AuthGuard } from '@nestjs/passport';
import { UserResponseDto } from 'src/users/dtos/user-response.dto';
import { User } from 'src/users/entities/user.entity';
import { ResponseDto } from 'src/common/dto/response.dto';
import type { Response } from 'express';
import { parseExpiresInToMs } from './utils/time.util';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // Import JwtAuthGuard

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<ResponseDto<UserResponseDto>> {
    const user = await this.authService.register(
      dto.name,
      dto.email,
      dto.password,
    );
    await this.emailVerificationService.sendVerificationEmail(user);
    return new ResponseDto(UserResponseDto.fromEntity(user), 'Registration successful. Please verify your email.');
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: { user: User },
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseDto<{ user: UserResponseDto; accessToken: string }>> {
    if (!req.user.emailVerifiedAt) {
      await this.emailVerificationService.sendVerificationEmail(req.user);

      throw new UnauthorizedException(
        'Email not verified. Verification email sent.',
      );
    }
    const { accessToken, refreshToken } = await this.authService.signIn(req.user);

    const refreshTokenExpiresIn = this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN');
    const maxAgeMs = parseExpiresInToMs(refreshTokenExpiresIn);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // Use secure cookies in production
      sameSite: 'strict',
      maxAge: maxAgeMs, // Use dynamic maxAge
    });

    return new ResponseDto({
      user: UserResponseDto.fromEntity(req.user),
      accessToken,
    });
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response): Promise<ResponseDto<null>> {
    res.clearCookie('refreshToken');
    return new ResponseDto(null, 'Logged out successfully.');
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() req: { user: User }): Promise<ResponseDto<{ user: UserResponseDto; accessToken: string }>> {
    const accessToken = await this.authService.renewAccessToken(req.user);
    return new ResponseDto({
      user: UserResponseDto.fromEntity(req.user),
      accessToken,
    });
  }

  @Get('me') // Add this endpoint
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: { user: User }): Promise<ResponseDto<UserResponseDto>> {
    return new ResponseDto(UserResponseDto.fromEntity(req.user));
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Passport automatically redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: { user: any },
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseDto<{ user: UserResponseDto; accessToken: string }>> {
    const user = await this.authService.googleLogin(req.user);
    const { accessToken, refreshToken } = await this.authService.signIn(user);

    const refreshTokenExpiresIn = this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN');
    const maxAgeMs = parseExpiresInToMs(refreshTokenExpiresIn);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: maxAgeMs, // Use dynamic maxAge
    });

    return new ResponseDto({
      user: UserResponseDto.fromEntity(user),
      accessToken,
    });
  }
}