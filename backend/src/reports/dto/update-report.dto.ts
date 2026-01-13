import { IsEnum, IsIn } from 'class-validator';
import { ReportStatus } from '../entities/report.entity';

export class UpdateReportDto {
  @IsEnum(ReportStatus)
  status: ReportStatus;

  @IsIn(['comment', 'post', 'user'])
  reportableType: Reportable;
}
