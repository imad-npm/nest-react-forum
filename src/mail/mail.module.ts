import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { NodemailerMailService } from './services/nodemailer-mail.service';
import { IMailService } from './interfaces/mail-service.interface';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('SMTP_HOST'),
          port: config.get('SMTP_PORT'),
          secure: false,
          /* auth: {
            user: config.get('SMTP_USER'),
            pass: config.get('SMTP_PASS'),
          },*/
        },
        defaults: {
          from: config.get('SMTP_FROM'),
        },
        template: {
          dir: process.cwd() + '/src/mail/templates',
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),
  ],
  providers: [
    {
      provide: 'IMailService',
      useClass: NodemailerMailService,
    },
  ],
  exports: ['IMailService'],
})
export class MailModule {}
