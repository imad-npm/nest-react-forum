import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { EmailChangeToken } from './entities/email-change-token.entity'; // Corrected import
import { UsersService } from 'src/users/users.service';
import type { IMailService } from 'src/mail/interfaces/mail-service.interface';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class EmailChangeService {
  constructor(
    @InjectRepository(EmailChangeToken) // Corrected injection
    private readonly emailChangeRepo: Repository<EmailChangeToken>,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    @Inject('IMailService')
    private readonly mailService: IMailService,
  ) {
    this.EXPIRATION_MS = this.configService.get<number>(
      'EMAIL_CHANGE_TOKEN_EXPIRATION',
      15 * 60 * 1000,
    );
  }
  EXPIRATION_MS: number;

  private generateVerificationLink(token: string): string {
    const domain = this.configService.get<string>('APP_DOMAIN');
    const path = '/api/email/change/verify'; // A new path for email change verification
    return `${domain}${path}?token=${token}`;
  }

  async requestEmailChange(user: User, newEmail: string): Promise<void> {
    if (user.email === newEmail) {
      throw new BadRequestException('New email cannot be the same as the current email.');
    }

    const emailExists = await this.usersService.findByEmail(newEmail).catch(() => null);
    if (emailExists && emailExists.id !== user.id) {
      throw new ConflictException('Email already in use by another user.');
    }

    // Delete any existing pending email change requests for this user
    await this.emailChangeRepo.delete({ userId: user.id });

    const token = randomUUID();
    const record = this.emailChangeRepo.create({
      userId: user.id,
      newEmail,
      token,
      expiresAt: new Date(Date.now() + this.EXPIRATION_MS),
    });

    await this.emailChangeRepo.save(record);

    const verifyUrl = this.generateVerificationLink(token);

    try {
      await this.mailService.sendEmail(
        newEmail,
        'Verify Your New Email Address',
        'email-change-verification', // New template name
        { username: user.username, verifyUrl },
      );
    } catch (err) {
      console.error('Error sending email change verification email:', err);
      throw new InternalServerErrorException(
        'Failed to send email change verification email',
      );
    }
  }

  async verifyEmailChange(token: string): Promise<User> {
    const record = await this.emailChangeRepo.findOne({ where: { token }, relations: ['user'] });

    if (!record) {
      throw new BadRequestException('Invalid or expired email change token.');
    }
    if (record.expiresAt < new Date()) {
      await this.emailChangeRepo.delete({ token });
      throw new BadRequestException('Email change token expired.');
    }

    const user = await this.usersService.updateEmail(record.userId, record.newEmail);
    // Mark email as verified immediately after successful change
    await this.usersService.markEmailAsVerified(user.id);
    await this.emailChangeRepo.delete({ token });

    return user;
  }
}
