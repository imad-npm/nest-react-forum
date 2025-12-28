import { IsOptional, IsString, IsUrl, IsAlphanumeric, MinLength, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(20)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  bio?: string;
}
