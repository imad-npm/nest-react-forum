import { IsOptional, IsString, IsUrl, IsAlphanumeric, MinLength, MaxLength } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(20)
  username: string; // Made required

  @IsOptional()
  @IsString()
  @MaxLength(255)
  bio?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  picture?: string;
}
