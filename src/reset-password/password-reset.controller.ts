import { Controller, Post, Body, Inject } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { ForgotDto } from './dto/forgot.dto';
import { ResetDto } from './dto/reset.dto';
import { UsersService } from '../users/users.service';
import type { IMailService } from 'src/mail/interfaces/mail-service.interface';
import { ConfigService } from '@nestjs/config';

@Controller('reset-password')
export class PasswordResetController {
  constructor(
    private resetService: PasswordResetService,
    private usersService: UsersService,
    @Inject('IMailService') private mailService: IMailService,
    private config: ConfigService,
  ) {}

  @Post('forgot')
  async forgot(@Body() dto: ForgotDto) {
    try {
      const user = await this.usersService.findByEmail(dto.email);
      if (!user) return { message: 'Email sent if account exists' };

      const { token } = await this.resetService.generateToken(user.id);

      const resetLink = this.resetService.generateResetLink(token);
      await this.mailService.sendEmail(
        user.email,
        'Reset Your Password',
        'reset-password',
        { name: user.name, resetLink },
      );

      return { message: 'Email sent if account exists' };
    } catch (err) {
      console.log(err);

      return { message: 'Email sent if account exists' };
    }
  }

  @Post('reset')
  async reset(@Body() dto: ResetDto) {
    const userId = await this.resetService.validateToken(dto.token);
    const user = await this.usersService.findOneById(userId);

    await this.usersService.updateUser( 
      { user,
         password: dto.password });
    return { message: 'Password updated' };
  }
}
