import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { EmailVerificationService } from 'src/email-verification/email-verification.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService ,
     private readonly emailVerificationService: EmailVerificationService,

  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user= await this.authService.register(dto);
    await this.emailVerificationService.sendVerificationEmail(user);
  return { message: 'Registration successful. Please verify your email.' };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  refresh(@Body() dto) {
    return this.authService.refreshToken(dto.refreshToken);
  }
}
