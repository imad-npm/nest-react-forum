import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Query,
  Get,
  Res,
} from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { SendVerificationDto } from './dto/send-verification.dto';
import { UsersService } from '../users/users.service';
import { ResponseDto } from 'src/common/dto/response.dto';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('email')
export class EmailVerificationController {
  constructor(
    private readonly service: EmailVerificationService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Post('resend')
  async resend(@Body() dto: SendVerificationDto): Promise<ResponseDto<null>> {
    const user = await this.usersService.findByEmail(dto.email);
    if (user && !user.emailVerifiedAt) {
      await this.service.sendVerificationEmail(user);
    }
    return new ResponseDto(null, 'If the email exists and is not verified, a new verification link has been sent.');
  }

@Get('verify')
async verify(
  @Query('token') token: string,
  @Res() res: Response,
): Promise<void> {
  const frontendUrl = this.configService.getOrThrow<string>(
    'FRONTEND_URL'  );
  const redirectUrl = new URL(`${frontendUrl}/verify-email`);

  if (!token) {
    redirectUrl.searchParams.set('error', 'Token is required');
    return res.redirect(redirectUrl.toString());
  }

  try {
    const userId = await this.service.verifyToken(token);
    await this.usersService.markEmailAsVerified(userId);

    redirectUrl.searchParams.set('success', '1');
    redirectUrl.searchParams.set(
      'message',
      'Email verified successfully',
    );
  } catch (err) {
    const message =
      err instanceof BadRequestException
        ? err.message
        : 'Invalid or expired verification token';
    redirectUrl.searchParams.set('error', '1');
    redirectUrl.searchParams.set('message', message);
  }

  return res.redirect(redirectUrl.toString());
}

}
