import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { EmailVerificationService } from 'src/email-verification/email-verification.service';
import { AuthGuard } from '@nestjs/passport';
import { UserResponseDto } from 'src/users/dtos/user-response.dto';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailVerificationService: EmailVerificationService,
  ) { }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto.name, dto.email, dto.password);
    await this.emailVerificationService.sendVerificationEmail(user);
    return {
      message: 'Registration successful. Please verify your email.',
      user: UserResponseDto.fromEntity(user),
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: { user: User }) {
    const tokens = await this.authService.signIn(req.user);
    return {
      user: UserResponseDto.fromEntity(req.user),
      ...tokens,
    };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() req: { user: User }) {
    const tokens = await this.authService.renewTokens(req.user);
    return {
      user: UserResponseDto.fromEntity(req.user),
      ...tokens,
    };
  }

  // Step 1: Redirect to Google OAuth
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Passport automatically redirects to Google
  }

  // Step 2: Google callback → GoogleStrategy.validate() → req.user
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: { user: any }) {
    const user = await this.authService.googleLogin(req.user);
    const tokens = await this.authService.signIn(user);
    return {
      user: UserResponseDto.fromEntity(user),
      ...tokens,
    };
  }
}
