import { IsString, IsNotEmpty, IsInt } from 'class-validator';
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
}
