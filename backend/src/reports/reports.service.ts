import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';

import { Report, Reportable, ReportStatus } from './entities/report.entity';
import { ReportReason } from './types';
import { CommunityMembershipRole } from 'src/community-memberships/types';
import { CommunityMembership } from 'src/community-memberships/entities/community-memberships.entity';


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

    @InjectRepository(CommunityMembership)
    private readonly membershipRepository: Repository<CommunityMembership>,


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
          relations: ['post']
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
    if (reason === ReportReason.COMMUNITY_RULES && !communityId) {
      throw new BadRequestException('Community reports require a community context');
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
  }


  async findAll({
    page = 1,
    limit = 10,
    status,
    reportableType,
    reporterId,
    communityId,
    user
  }: {
    page?: number;
    limit?: number;
    status?: ReportStatus;
    reportableType?: Reportable;
    reporterId?: number;
    communityId?: number;
    user: User
  }): Promise<{ data: Report[]; count: number }> {
    const query = this.reportRepository.createQueryBuilder('report');

    await this.applyVisibilityScope(query, user);

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


  async findOne(id: number, user: User): Promise<Report> {
    const query = this.reportRepository.createQueryBuilder('report')
      .where('report.id = :id', { id });

    // Apply visibility scope (authorization)
    await this.applyVisibilityScope(query, user);

    const report = await query.getOne();

    if (!report) {
      throw new NotFoundException(`Report ${id} not found or not accessible`);
    }

    return report;
  }
  
 async resolve(id: number, user: User): Promise<Report> {
  const report = await this.reportRepository.findOneBy({ id });

  if (!report) {
    throw new NotFoundException(`Report ${id} not found`);
  }

  if (!(await this.canUpdateStatus(report, user))) {
    throw new ForbiddenException('You cannot resolve this report');
  }

  if (report.status === ReportStatus.RESOLVED) {
    throw new ConflictException('Report is already resolved');
  }

  if (report.status === ReportStatus.DISMISSED) {
    throw new ConflictException('Dismissed reports cannot be resolved');
  }

  report.status = ReportStatus.RESOLVED;
  return this.reportRepository.save(report);
}
async dismiss(id: number, user: User): Promise<Report> {
  const report = await this.reportRepository.findOneBy({ id });

  if (!report) {
    throw new NotFoundException(`Report ${id} not found`);
  }

  if (user.role !== UserRole.ADMIN) {
    throw new ForbiddenException('Only admins can dismiss reports');
  }

  if (report.status === ReportStatus.DISMISSED) {
    throw new ConflictException('Report is already dismissed');
  }

  if (report.status === ReportStatus.RESOLVED) {
    throw new ConflictException('Resolved reports cannot be dismissed');
  }

  report.status = ReportStatus.DISMISSED;
  return this.reportRepository.save(report);
}



  private async getModeratedCommunityIds(userId: number): Promise<number[]> {
    const rows = await this.membershipRepository.find({
      where: {
        userId,
        role: CommunityMembershipRole.MODERATOR,
      },
      select: ['communityId'],
    });

    return rows.map(r => r.communityId);
  }

  private async canUpdateStatus(report: Report, user: User): Promise<boolean> {
    // Admins can always update
    if (user.role === UserRole.ADMIN) return true;

    // Normal users cannot update
    // (no MODERATOR role in your system — moderation is inferred from community membership)
    const moderatedCommunityIds = await this.getModeratedCommunityIds(user.id);
    if (!report.communityId) return false; // cannot update if no community
    return moderatedCommunityIds.includes(report.communityId);
  }


  private async applyVisibilityScope(
    qb: SelectQueryBuilder<Report>,
    user: User
  ) {
    if (user.role === UserRole.ADMIN) {
      return; // full access
    }

    // Get moderated communities once
    const moderatedCommunityIds = await this.getModeratedCommunityIds(user.id);

    if (user.role === UserRole.USER && moderatedCommunityIds.length === 0) {
      // Normal user, not a mod anywhere
      qb.where('report.reporterId = :userId', { userId: user.id });
      return;
    }

    // Community moderator (or normal user who happens to moderate)
    qb.andWhere(
      new Brackets(qb2 => {
        qb2.where('report.reporterId = :userId', { userId: user.id });

        if (moderatedCommunityIds.length > 0) {
          qb2.orWhere(
            `
          report.communityId IN (:...communityIds)
          AND report.isPlatformComplaint = FALSE
          `,
            { communityIds: moderatedCommunityIds },
          );
        }
      }),
    );
  }


}
