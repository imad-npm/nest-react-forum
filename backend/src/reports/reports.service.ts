import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { CommentReport } from './entities/comment-report.entity';
import { PostReport } from './entities/post-report.entity';
import { UserReport } from './entities/user-report.entity';
import { ReportStatus } from './entities/base-report.entity';
import { ReportQueryDto } from './dto/report-query.dto';

interface CreateReportData {
  entityType: 'comment' | 'post' | 'user';
  entityId: number;
  reason: string;
  description?: string;
}

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
  ) {}

  async create(data: CreateReportData, reporter: User) {
    const { entityType, entityId, reason, description } = data;

    if (entityType === 'comment') {
      const exists = await this.commentsRepository.exist({ where: { id: entityId } });
      if (!exists) throw new NotFoundException('Comment not found');

      const report = this.commentReportRepository.create({
        reporterId: reporter.id,
        commentId: entityId,
        reason,
        description,
      });
      return this.commentReportRepository.save(report);
    }

    if (entityType === 'post') {
      const exists = await this.postsRepository.exist({ where: { id: entityId } });
      if (!exists) throw new NotFoundException('Post not found');

      const report = this.postReportRepository.create({
        reporterId: reporter.id,
        postId: entityId,
        reason,
        description,
      });
      return this.postReportRepository.save(report);
    }

    if (entityType === 'user') {
      const exists = await this.usersRepository.exist({ where: { id: entityId } });
      if (!exists) throw new NotFoundException('User not found');

      const report = this.userReportRepository.create({
        reporterId: reporter.id,
        reportedUserId: entityId,
        reason,
        description,
      });
      return this.userReportRepository.save(report);
    }
  }

  async findAll(
    query: ReportQueryDto,
  ): Promise<{ data: (CommentReport | PostReport | UserReport)[]; count: number }> {
    const { page = 1, limit = 10, status, entityType, reporterId } = query;
    const offset = (page - 1) * limit;

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
