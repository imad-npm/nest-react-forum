import { ReportStatus } from '../entities/report.entity';
import { CommentReport } from '../entities/comment-report.entity';
import { PostReport } from '../entities/post-report.entity';
import { UserReport } from '../entities/user-report.entity';

export class ReportResponseDto {
  id: number;
  reason: string;
  description: string | null;
  status: ReportStatus;
  reporterId: number;
  createdAt: Date;
  updatedAt: Date;
  reportableType: 'comment' | 'post' | 'user';
  commentId?: number;
  postId?: number;
  reportedUserId?: number;

  static fromEntity(
    report: CommentReport | PostReport | UserReport,
  ): ReportResponseDto {
    const dto = new ReportResponseDto();
    dto.id = report.id;
    dto.reason = report.reason;
    dto.description = report.description;
    dto.status = report.status;
    dto.reporterId = report.reporterId;
    dto.createdAt = report.createdAt;
    dto.updatedAt = report.updatedAt;

    if (report instanceof CommentReport) {
      dto.reportableType = 'comment';
      dto.commentId = report.commentId;
    } else if (report instanceof PostReport) {
      dto.reportableType = 'post';
      dto.postId = report.postId;
    } else if (report instanceof UserReport) {
      dto.reportableType = 'user';
      dto.reportedUserId = report.reportedUserId;
    }

    return dto;
  }
}
