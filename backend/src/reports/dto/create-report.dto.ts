import { IsString, IsIn, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { Reportable } from '../entities/report.entity';
import { ReportReason } from '../types';

export class CreateReportDto {
  @IsEnum(ReportReason)
  reason: ReportReason;

  @IsEnum(Reportable)
  reportableType: Reportable;

  @IsNumber()
  reportableId: number;

  @IsString()
  @IsOptional()
  description?: string;
}
