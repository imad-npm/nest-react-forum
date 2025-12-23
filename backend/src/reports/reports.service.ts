import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CommentReport } from './entities/comment-report.entity';
import { PostReport } from './entities/post-report.entity';
import { UserReport } from './entities/user-report.entity';
import { ReportStatus } from './entities/base-report.entity';
import { CommentsService } from 'src/comments/comments.service';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';
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
    private readonly commentsService: CommentsService,
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  async create(data: CreateReportData, reporter: User) {
    const { entityType, entityId, reason, description } = data;

    if (entityType === 'comment') {
      await this.commentsService.findOne(entityId);
      const report = this.commentReportRepository.create({
        reporterId: reporter.id,
        commentId: entityId,
        reason,
        description,
      });
      return this.commentReportRepository.save(report);
    } else if (entityType === 'post') {
      await this.postsService.findOne(entityId);
      const report = this.postReportRepository.create({
        reporterId: reporter.id,
        postId: entityId,
        reason,
        description,
      });
      return this.postReportRepository.save(report);
    } else if (entityType === 'user') {
      await this.usersService.findOneById(entityId);
      const report = this.userReportRepository.create({
        reporterId: reporter.id,
        reportedUserId: entityId,
        reason,
        description,
      });
      return this.userReportRepository.save(report);
    }
  }

  async findAll(query: ReportQueryDto): Promise<{ data: (CommentReport | PostReport | UserReport)[]; count: number }> {
    const { page = 1, limit = 10, status, entityType, reporterId } = query;
    const offset = (page - 1) * limit;

    const parameters: any[] = [];
    let paramIndex = 1;

    const buildSelectQuery = (tableName: string, type: string, specificIdColumn: string) => {
      let whereClauses: string[] = [];

      if (status) {
        whereClauses.push(`status = $${paramIndex++}`);
        parameters.push(status);
      }
      if (reporterId) {
        whereClauses.push(`"reporterId" = $${paramIndex++}`);
        parameters.push(reporterId);
      }
      if (entityType && entityType !== type) {
        return null; // Exclude this type if a specific entityType is requested
      }

      const where = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
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

    const commentSelect = buildSelectQuery('comment_reports', 'comment', 'commentId');
    const postSelect = buildSelectQuery('post_reports', 'post', 'postId');
    const userSelect = buildSelectQuery('user_reports', 'user', 'reportedUserId');

    const unionQueries = [commentSelect, postSelect, userSelect].filter(q => q !== null);

    if (unionQueries.length === 0) {
      return { data: [], count: 0 }; // No queries to run
    }

    const unionAllQuery = unionQueries.join(' UNION ALL ');

    // Total count query
    const countQuery = `SELECT COUNT(*) FROM (${unionAllQuery}) AS union_counts`;
    const totalCountResult = await this.commentReportRepository.query(countQuery, parameters); // Using any repository for query
    const totalCount = parseInt(totalCountResult[0].count, 10);

    // Data query with pagination and ordering
    const dataQuery = `
      ${unionAllQuery}
      ORDER BY "createdAt" DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    parameters.push(limit);
    parameters.push(offset);

    const rawData = await this.commentReportRepository.query(dataQuery, parameters);

    // Map raw data to a consistent structure (similar to ReportResponseDto)
    const data = rawData.map(item => ({
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
      reportedUserId: item.entityType === 'user' ? item.entitySpecificId : undefined,
    }));

    return { data, count: totalCount };
  }

  async findOne(id: number, entityType?: 'comment' | 'post' | 'user'): Promise<CommentReport | PostReport | UserReport> {
    let report: CommentReport | PostReport | UserReport | null;
    let repository: Repository<CommentReport | PostReport | UserReport>;

    if (!entityType) {
      throw new NotFoundException('entityType is required to find a specific report.');
    }

    switch (entityType) {
      case 'comment':
        repository = this.commentReportRepository;
        break;
      case 'post':
        repository = this.postReportRepository;
        break;
      case 'user':
        repository = this.userReportRepository;
        break;
      default:
        throw new NotFoundException(`Invalid entityType: ${entityType}`);
    }
    report = await repository.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} and type ${entityType} not found.`);
    }

    return report;
  }

  async updateStatus(id: number, status: ReportStatus, entityType: 'comment' | 'post' | 'user') {
    let report: CommentReport | PostReport | UserReport|null;
    let repository: Repository<CommentReport | PostReport | UserReport>;

    switch (entityType) {
      case 'comment':
        repository = this.commentReportRepository;
        break;
      case 'post':
        repository = this.postReportRepository;
        break;
      case 'user':
        repository = this.userReportRepository;
        break;
    }

    report = await repository.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} and type ${entityType} not found.`);
    }

    report.status = status;
    return repository.save(report);
  }
}
