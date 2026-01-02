import { IsEmail, IsString, MinLength } from 'class-validator';

export class RequestEmailChangeDto {
  @IsEmail({}, { message: 'New email must be a valid email address.' })
  newEmail: string;

  @IsString({ message: 'Current password must be a string.' })
  @MinLength(6, { message: 'Current password must be at least 6 characters long.' })
  currentPassword: string;
}
