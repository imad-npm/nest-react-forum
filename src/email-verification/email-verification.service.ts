import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { EmailVerificationToken } from './entities/email-verification-token.entity';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { User } from 'src/users/entities/user.entity';
import { use } from 'passport';


@Injectable()
export class EmailVerificationService {
  private transporter: nodemailer.Transporter;
  private EXPIRATION_MS = 15 * 60 * 1000; // 15 minutes

  constructor(
    @InjectRepository(EmailVerificationToken)
    private readonly tokenRepo: Repository<EmailVerificationToken>,
    private readonly configService: ConfigService,
  ) {
  this.transporter = nodemailer.createTransport({
  host: this.configService.get<string>('SMTP_HOST'),
  port: this.configService.get<number>('SMTP_PORT'),
  secure: false,
  // Only add auth if SMTP_USER and SMTP_PASS are defined
  ...(this.configService.get<string>('SMTP_USER') &&
  this.configService.get<string>('SMTP_PASS')
    ? {
        auth: {
          user: this.configService.get<string>('SMTP_USER'),
          pass: this.configService.get<string>('SMTP_PASS'),
        },
      }
    : {}),
});

  }

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

  /**
   * Generates verification URL dynamically from config domain
   */
  private generateVerificationLink(token: string): string {
    const domain = this.configService.get<string>('APP_DOMAIN'); // e.g. https://myapp.com
    const path = '/email/verify';
    return `${domain}${path}?token=${token}`;
  }

  async sendVerificationEmail(user : User): Promise<void> {
    const token = await this.generateToken(user.id);
    const verifyUrl = this.generateVerificationLink(token);

    // Load and compile the Handlebars template
const templatePath = path.resolve('src/email-verification/templates/verify-email.hbs');
const source = fs.readFileSync(templatePath, 'utf-8');

    const template = Handlebars.compile(source);
    const name =user.name
    const html = template({ name, verifyUrl });

    try {
      await this.transporter.sendMail({
        from:  this.configService.get<string>('SMTP_FROM')  ,
        to: user.email,
        subject: 'Verify Your Email',
        html,
      });
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
