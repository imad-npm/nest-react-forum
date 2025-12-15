import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendVerificationDto {
  @IsNotEmpty()
  @IsEmail()
  email: string; // ✅ Use email, a public identifier
}
