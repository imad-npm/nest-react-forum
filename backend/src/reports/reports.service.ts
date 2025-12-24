import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { CommentReport } from './entities/comment-report.entity';
import { PostReport } from './entities/post-report.entity';
import { UserReport } from './entities/user-report.entity';
import { ReportStatus } from './entities/base-report.entity';
import { CommunityModerator } from 'src/community-moderators/entities/community-moderator.entity';

const PLATFORM_COMPLAINT_REASONS = [
  'HARASSMENT',
  'VIOLENCE',
  'HATE_CONTENT',
  'MINOR_ABUSE_OR_SEXUALIZATION',
  'PII',
  'INVOLUNTARY_PORN',
  'PROHIBITED_SALES',
  'IMPERSONATION',
  'MANIPULATED_CONTENT',
  'COPYRIGHT',
  'TRADEMARK',
  'SELF_HARM',
  'SPAM',
  'CONTRIBUTOR_PROGRAM',
];

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(CommentReport)
    private readonly commentReportRepository: Repository<CommentReport>,

    @InjectRepository(PostReport)
    private readonly postReportRepository: Repository<PostReport>,

    @InjectRepository(UserReport)
    private readonly userReportRepository: Repository<UserReport>,

    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(CommunityModerator)
    private readonly communityModeratorRepository: Repository<CommunityModerator>,
  ) { }

  async create(
    {
      entityType,
      entityId,
      reason,
      description,
    }: {
      entityType: 'comment' | 'post' | 'user';
      entityId: number;
      reason: string;
      description?: string;
    },
    reporter: User,
  ) {
    const isPlatformComplaint = PLATFORM_COMPLAINT_REASONS.includes(
      reason.toUpperCase(),
    );

    if (entityType === 'comment') {
      const entity = await this.commentsRepository.findOne({
        where: { id: entityId },
      });
      if (!entity) throw new NotFoundException('Comment not found');

      const existingReport = await this.commentReportRepository.findOne({
        where: { commentId: entityId, reporterId: reporter.id },
      });
      if (existingReport) {
        throw new ConflictException('You have already reported this comment');
      }

      const report = this.commentReportRepository.create({
        reporterId: reporter.id,
        commentId: entityId,
        reason,
        description,
        isPlatformComplaint,
      });
      return this.commentReportRepository.save(report);
    }

    if (entityType === 'post') {
      const entity = await this.postsRepository.findOne({
        where: { id: entityId },
      });
      if (!entity) throw new NotFoundException('Post not found');

      const existingReport = await this.postReportRepository.findOne({
        where: { postId: entityId, reporterId: reporter.id },
      });
      if (existingReport) {
        throw new ConflictException('You have already reported this post');
      }

      const report = this.postReportRepository.create({
        reporterId: reporter.id,
        postId: entityId,
        reason,
        description,
        isPlatformComplaint,
        communityId: (entity as Post).communityId,
      });
      return this.postReportRepository.save(report);
    }

    if (entityType === 'user') {
      const entity = await this.usersRepository.findOne({
        where: { id: entityId },
      });
      if (!entity) throw new NotFoundException('User not found');

      if (entity.id === reporter.id) {
        throw new ConflictException('You cannot report yourself');
      }

      const existingReport = await this.userReportRepository.findOne({
        where: { reportedUserId: entityId, reporterId: reporter.id },
      });
      if (existingReport) {
        throw new ConflictException('You have already reported this user');
      }

      const report = this.userReportRepository.create({
        reporterId: reporter.id,
        reportedUserId: entityId,
        reason,
        description,
        isPlatformComplaint,
      });
      return this.userReportRepository.save(report);
    }
  }

  async findAll({
    page = 1,
    limit = 10,
    status,
    entityType,
    reporterId,
    userId,
    communityId,
  }: {
    page?: number;
    limit?: number;
    status?: ReportStatus;
    entityType?: 'comment' | 'post' | 'user';
    reporterId?: number;
    userId: number;
    communityId?: number;
  }): Promise<{ data: (CommentReport | PostReport | UserReport)[]; count: number }> {
    const offset = (page - 1) * limit;


    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    const isModerator =
      communityId &&
      (await this.communityModeratorRepository.findOne({
        where: { moderatorId: userId, communityId },
      }));

    const parameters: any[] = [];
    let paramIndex = 1;

    const buildSelectQuery = (
      tableName: string,
      type: string,
      specificIdColumn: string,
    ) => {
      const whereClauses: string[] = [];

      if (status) {
        whereClauses.push(`status = $${paramIndex++}`);
        parameters.push(status);
      }

      if (reporterId) {
        whereClauses.push(`"reporterId" = $${paramIndex++}`);
        parameters.push(reporterId);
      }

      if (user.role == UserRole.ADMIN) {
        whereClauses.push(`"isPlatformComplaint" = TRUE`);
      } else if (isModerator && communityId) {
        whereClauses.push(`"communityId" = $${paramIndex++}`);
        parameters.push(communityId);
      } else {
        whereClauses.push(`"isPlatformComplaint" = FALSE`);
      }

      if (entityType && entityType !== type) return null;

      const where =
        whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

      return `
        SELECT
          id,
          "reporterId",
          reason,
          description,
          status,
          "createdAt",
          "updatedAt",
          "isPlatformComplaint",
          "communityId",
          ${specificIdColumn} AS "entitySpecificId",
          '${type}' AS "entityType"
        FROM ${tableName}
        ${where}
      `;
    };

    const unionQueries = [
      buildSelectQuery('comment_reports', 'comment', 'commentId'),
      buildSelectQuery('post_reports', 'post', 'postId'),
      buildSelectQuery('user_reports', 'user', 'reportedUserId'),
    ].filter(Boolean);

    if (!unionQueries.length) {
      return { data: [], count: 0 };
    }

    const unionAllQuery = unionQueries.join(' UNION ALL ');

    const countQuery = `SELECT COUNT(*) FROM (${unionAllQuery}) AS union_counts`;
    const countResult = await this.commentReportRepository.query(
      countQuery,
      parameters,
    );
    const count = parseInt(countResult[0].count, 10);

    const dataQuery = `
      ${unionAllQuery}
      ORDER BY "createdAt" DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    parameters.push(limit, offset);

    const raw = await this.commentReportRepository.query(
      dataQuery,
      parameters,
    );

    const data = raw.map(item => ({
      id: item.id,
      reporterId: item.reporterId,
      reason: item.reason,
      description: item.description,
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      isPlatformComplaint: item.isPlatformComplaint,
      communityId: item.communityId,
      entityType: item.entityType,
      commentId: item.entityType === 'comment' ? item.entitySpecificId : undefined,
      postId: item.entityType === 'post' ? item.entitySpecificId : undefined,
      reportedUserId:
        item.entityType === 'user' ? item.entitySpecificId : undefined,
    }));

    return { data, count };
  }

  async findOne(
    id: number,
    entityType: 'comment' | 'post' | 'user',
  ): Promise<CommentReport | PostReport | UserReport> {
    let repository: Repository<any>;

    if (entityType === 'comment') repository = this.commentReportRepository;
    else if (entityType === 'post') repository = this.postReportRepository;
    else repository = this.userReportRepository;

    const report = await repository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Report ${id} not found`);
    }
    return report;
  }

  async updateStatus(
    id: number,
    status: ReportStatus,
    entityType: 'comment' | 'post' | 'user',
  ) {
    const report = await this.findOne(id, entityType);

    if (report.status === status) {
      throw new ConflictException(
        `Report is already with status "${status}"`,
      );
    }

    report.status = status;

    if (entityType === 'comment') {
      return this.commentReportRepository.save(report);
    }
    if (entityType === 'post') {
      return this.postReportRepository.save(report);
    }
    return this.userReportRepository.save(report);
  }
}
