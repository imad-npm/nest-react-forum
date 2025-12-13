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
          host: config.getOrThrow<string>('SMTP_HOST'),
          port: config.getOrThrow<number>('SMTP_PORT'),
          secure: false,
          /* auth: {
            user: config.getOrThrow<string>('SMTP_USER'),
            pass: config.getOrThrow<string>('SMTP_PASS'),
          },*/
        },
        defaults: {
          from: config.getOrThrow<string>('SMTP_FROM'),
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
