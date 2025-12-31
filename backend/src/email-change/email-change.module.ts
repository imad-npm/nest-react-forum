import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailChangeService } from './email-change.service';
import { EmailChangeController } from './email-change.controller';
import { EmailChangeToken } from './entities/email-change-token.entity';
import { UsersModule } from 'src/users/users.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailChangeToken]),
    UsersModule,
    MailModule,
  ],
  providers: [EmailChangeService],
  controllers: [EmailChangeController],
  exports: [EmailChangeService],
})
export class EmailChangeModule {}
