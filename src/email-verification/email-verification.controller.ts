import { Controller, Post, Body } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { SendVerificationDto } from './dto/send-verification.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('email-verification')
export class EmailVerificationController {
  constructor(private readonly service: EmailVerificationService) {}

  @Post('send')
  send(@Body() dto: SendVerificationDto) {
    const token = this.service.generateToken(dto.userId);
    return { message: 'Verification token generated', token };
  }

  @Post('verify')
  verify(@Body() dto: VerifyEmailDto) {
    const userId = this.service.verifyToken(dto.token);
    return { message: 'Email verified successfully', userId };
  }
}

