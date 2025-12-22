import { IsString, IsNotEmpty, IsInt, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  communityId: number;

  @IsBoolean()
  @IsOptional()
  isApproved?: boolean;
}
