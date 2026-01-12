import { IsString, IsIn, IsNumber, IsOptional } from 'class-validator';

export class CreateReportDto {
  @IsString()
  reason: string;

  @IsIn(['comment', 'post', 'user'])
  reportableType: 'comment' | 'post' | 'user';

  @IsNumber()
  entityId: number;

  @IsString()
  @IsOptional()
  description?: string;
}
