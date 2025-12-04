import { IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  content: string;

  // Add the optional parent ID
  @IsOptional()
  @IsInt()
  parentId?: number;
}
