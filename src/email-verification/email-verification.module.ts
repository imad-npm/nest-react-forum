// src/email-verification/email-verification.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerificationService } from './email-verification.service';
import { EmailVerificationController } from './email-verification.controller';
import { EmailVerificationToken } from './entities/email-verification-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmailVerificationToken])],
  controllers: [EmailVerificationController],
  providers: [EmailVerificationService],
  exports: [EmailVerificationService],
})
export class EmailVerificationModule {}
