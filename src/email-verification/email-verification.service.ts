import { Injectable, BadRequestException, InternalServerErrorException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { EmailVerificationToken } from './entities/email-verification-token.entity';
import { User } from 'src/users/entities/user.entity';
import type { IMailService } from 'src/mail/interfaces/mail-service.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailVerificationService {
  private readonly EXPIRATION_MS = 15 * 60 * 1000; // 15 minutes

  constructor(
    @InjectRepository(EmailVerificationToken)
    private readonly tokenRepo: Repository<EmailVerificationToken>,
    private readonly configService: ConfigService,
    @Inject('IMailService')
    private readonly mailService: IMailService,
  ) { }

  private async deleteExistingTokens(userId: number): Promise<void> {
    await this.tokenRepo.delete({ userId });
  }

  async generateToken(userId: number): Promise<string> {
    await this.deleteExistingTokens(userId);

    const token = randomUUID();
    const record = this.tokenRepo.create({
      token,
      userId,
      expiresAt: new Date(Date.now() + this.EXPIRATION_MS),
    });

    await this.tokenRepo.save(record);
    return token;
  }

  private generateVerificationLink(token: string): string {
    // You can move APP_DOMAIN to ConfigService if needed
    const domain = this.configService.get<string>('APP_DOMAIN'); // e.g. https://myapp.com
    const path = '/email/verify';
    return `${domain}${path}?token=${token}`;
  }

  async sendVerificationEmail(user: User): Promise<void> {
    const token = await this.generateToken(user.id);
    const verifyUrl = this.generateVerificationLink(token);

    try {
      await this.mailService.sendEmail(
        user.email,
        'Verify Your Email',
        'verify-email',       // templateName (templates/verify-email.hbs)
        { name: user.name, verifyUrl } // context for the template
      );
    } catch (err) {
      console.error('Error sending verification email:', err);
      throw new InternalServerErrorException('Failed to send verification email');
    }
  }

  async verifyToken(token: string): Promise<number> {
    const record = await this.tokenRepo.findOne({ where: { token } });

    if (!record) throw new BadRequestException('Invalid token');
    if (record.expiresAt < new Date()) {
      await this.tokenRepo.delete({ token });
      throw new BadRequestException('Token expired');
    }

    await this.tokenRepo.delete({ token });
    return record.userId;
  }
}
