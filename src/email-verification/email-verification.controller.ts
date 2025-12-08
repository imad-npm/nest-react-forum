import { Controller, Post, Body, BadRequestException, Query, Get } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { SendVerificationDto } from './dto/send-verification.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UsersService } from '../users/users.service';

@Controller('email')
export class EmailVerificationController {
  constructor(
    private readonly service: EmailVerificationService,
    private readonly usersService: UsersService,
  ) {}

  @Post('send')
  async send(@Body() dto: SendVerificationDto) {
    // Try to find the user by ID
    const user = await this.usersService.findOneById(dto.userId);

    if (user && !user.emailVerifiedAt) {
      // Only send verification if user exists and email not verified
      await this.service.sendVerificationEmail(user);
    }

    // Always return the same message to prevent email enumeration
    return {
      message:
        'If the email exists and is not verified, a new verification link has been sent.',
    };
  }

  @Get('verify')
  async verify(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token is required.');
    }

    try {
      const userId = await this.service.verifyToken(token);

      await this.usersService.markEmailAsVerified(userId);

      return { message: 'Email verified successfully', userId };
    } catch (err) {
      throw new BadRequestException('Invalid or expired verification token.');
    }
  }


}
