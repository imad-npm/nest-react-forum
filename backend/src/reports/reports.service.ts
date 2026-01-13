import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';

import { Report, Reportable, ReportStatus } from './entities/report.entity';
import { ReportReason } from './types';


export const PLATFORM_LEVEL_REASONS = [
  ReportReason.HARASSMENT,
  ReportReason.VIOLENCE,
  ReportReason.HATE_CONTENT,
  ReportReason.MINOR_ABUSE,
  ReportReason.PII,
  ReportReason.INVOLUNTARY_PORN,
  ReportReason.PROHIBITED_SALES,
  ReportReason.IMPERSONATION,
  ReportReason.MANIPULATED_CONTENT,
  ReportReason.COPYRIGHT,
  ReportReason.TRADEMARK,
  ReportReason.SELF_HARM,
  ReportReason.SPAM,
  ReportReason.CONTRIBUTOR_PROGRAM,
];

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,

   
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,


  ) { }

async create(
  {
    reportableType,
    reportableId,
    reason,
    description,
  }: {
    reportableType: Reportable;
    reportableId: number;
    reason: ReportReason;
    description?: string;
  },
  reporter: User,
) {
  const isPlatformComplaint = PLATFORM_LEVEL_REASONS.includes(
    reason,
  );

  // Validate existence based on type
  let communityId: number | undefined;

  switch (reportableType) {
    case Reportable.COMMENT: {
      const comment = await this.commentsRepository.findOne({
        where: { id: reportableId },
        relations : ['post']
      });
      if (!comment) throw new NotFoundException('Comment not found');
      communityId = comment.post.communityId; // optional
      break;
    }

    case Reportable.POST: {
      const post = await this.postsRepository.findOne({
        where: { id: reportableId },
      });
      if (!post) throw new NotFoundException('Post not found');
      communityId = post.communityId;
      break;
    }

    case Reportable.USER: {
      if (reportableId === reporter.id) {
        throw new ConflictException('You cannot report yourself');
      }
      const user = await this.usersRepository.findOne({ where: { id: reportableId } });
      if (!user) throw new NotFoundException('User not found');
      break;
    }

    default:
      throw new BadRequestException('Invalid reportable type');
  }

  // Check for existing report
  const existingReport = await this.reportRepository.findOne({
    where: {
      reporterId: reporter.id,
      reportableType,
      reportableId: reportableId,
    },
  });

  if (existingReport) {
    throw new ConflictException('You have already reported this entity');
  }

  // Create and save the report
  const report = this.reportRepository.create({
    reporterId: reporter.id,
    reportableType,
    reportableId: reportableId,
    reason,
    description,
    isPlatformComplaint,
    communityId,
  });

  return this.reportRepository.save(report);
}async findAll({
  page = 1,
  limit = 10,
  status,
  reportableType,
  reporterId,
  communityId,
}: {
  page?: number;
  limit?: number;
  status?: ReportStatus;
  reportableType?: Reportable;
  reporterId?: number;
  communityId?: number;
}): Promise<{ data: Report[]; count: number }> {
  const query = this.reportRepository.createQueryBuilder('report');

  // Filters
  if (status) {
    query.andWhere('report.status = :status', { status });
  }

  if (reporterId) {
    query.andWhere('report.reporterId = :reporterId', { reporterId });
  }

  if (reportableType) {
    query.andWhere('report.reportableType = :reportableType', { reportableType });
  }

  if (communityId) {
    query.andWhere('report.communityId = :communityId', { communityId });
  }

  // Total count
  const count = await query.getCount();

  // Pagination
  const data = await query
    .orderBy('report.createdAt', 'DESC')
    .skip((page - 1) * limit)
    .take(limit)
    .getMany();

  return { data, count };
}
async findOne(id: number): Promise<Report> {
  const report = await this.reportRepository.findOne({ where: { id } });
  if (!report) {
    throw new NotFoundException(`Report ${id} not found`);
  }
  return report;
}

async updateStatus(id: number, status: ReportStatus): Promise<Report> {
  const report = await this.findOne(id);

  if (report.status === status) {
    throw new ConflictException(
      `Report is already with status "${status}"`,
    );
  }

  report.status = status;

  return this.reportRepository.save(report);
}
}
