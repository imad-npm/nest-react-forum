import { IsNotEmpty, IsString, IsOptional, IsAlphanumeric, MinLength, MaxLength } from 'class-validator';

export class CreateProfileDto {
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(20)
  displayName: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  bio?: string;
}