import { Report, Reportable, ReportStatus } from '../entities/report.entity';

export class ReportResponseDto {
  id: number;
  reason: string;
  description: string | undefined;
  status: ReportStatus;
  reporterId: number;
  createdAt: Date;
  updatedAt: Date;

  // Polymorphic target
  reportableType: Reportable;
  reportableId: number; // use for comment/post/user IDs

  static fromEntity(report: Report): ReportResponseDto {
    const dto = new ReportResponseDto();

    dto.id = report.id;
    dto.reason = report.reason;
    dto.description = report.description;
    dto.status = report.status;
    dto.reporterId = report.reporterId;
    dto.createdAt = report.createdAt;
    dto.updatedAt = report.updatedAt;

    dto.reportableType = report.reportableType;
    dto.reportableId = report.reportableId;

    

    return dto;
  }
}
