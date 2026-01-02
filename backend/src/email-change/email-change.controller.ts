import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  Get,
} from '@nestjs/common';
import { EmailChangeService } from './email-change.service';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestEmailChangeDto } from './dto/request-email-change.dto';
import { VerifyEmailChangeDto } from './dto/verify-email-change.dto'; // Import the new DTO

@Controller('email/change')
export class EmailChangeController {
  constructor(private readonly emailChangeService: EmailChangeService) {}

  @Post('request')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async requestEmailChange(
    @GetUser() user: User,
    @Body() { newEmail, currentPassword }: RequestEmailChangeDto,
  ): Promise<{ message: string }> {
    await this.emailChangeService.requestEmailChange(user, newEmail, currentPassword);
    return {
      message:
        'Verification email sent to your new address. Please check your inbox to complete the change.',
    };
  }

  @Get('verify') // Changed to POST
  @HttpCode(HttpStatus.OK)
  async verifyEmailChange(
    @Query('token') token: string,
  ): Promise<{ message: string }> {
    await this.emailChangeService.verifyEmailChange(token);
    return { message: 'Your email address has been successfully updated.' };
  }
}
