import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EmailChangeService } from './email-change.service';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; // Assuming this guard exists

class RequestEmailChangeDto {
  newEmail: string;
}

@Controller('email/change')
export class EmailChangeController {
  constructor(private readonly emailChangeService: EmailChangeService) {}

  @Post('request')
  @UseGuards(JwtAuthGuard) // Protect this endpoint
  @HttpCode(HttpStatus.OK)
  async requestEmailChange(
    @GetUser() user: User,
    @Body() { newEmail }: RequestEmailChangeDto,
  ): Promise<{ message: string }> {
    await this.emailChangeService.requestEmailChange(user, newEmail);
    return {
      message:
        'Verification email sent to your new address. Please check your inbox to complete the change.',
    };
  }

  @Get('verify')
  async verifyEmailChange(
    @Query('token') token: string,
  ): Promise<{ message: string }> {
    await this.emailChangeService.verifyEmailChange(token);
    return { message: 'Your email address has been successfully updated.' };
  }
}
