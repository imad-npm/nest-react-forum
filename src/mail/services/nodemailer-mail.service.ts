import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IMailService } from '../interfaces/mail-service.interface';

@Injectable()
export class NodemailerMailService implements IMailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    context: any
  ): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject,
      template: templateName,
      context,
    });
  }
}
