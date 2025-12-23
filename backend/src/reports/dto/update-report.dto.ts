import { IsEnum, IsIn } from 'class-validator';
import { ReportStatus } from '../entities/base-report.entity';

export class UpdateReportDto {
  @IsEnum(ReportStatus)
  status: ReportStatus;

  @IsIn(['comment', 'post', 'user'])
  entityType: 'comment' | 'post' | 'user';
}
